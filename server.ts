import { createServer } from "node:http";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import Redis from "ioredis";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(async () => {
  const httpServer = createServer(handler);
  const io = new SocketIOServer(httpServer, { cors: { origin: "*" } });

  const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
  const { Filter: BadWordsFilter } = await import("bad-words");
  const filter = new BadWordsFilter();

  // Helper to clean up a socket on disconnect
  const cleanupSocket = async (socketId: string) => {
    console.log(`[CLEANUP] Starting cleanup for ${socketId}`);
    
    // Decrement online users
    await redis.decr("stats:users:online");
    
    const queueType = await redis.get(`user:${socketId}:queue_type`);
    
    if (queueType === "tagged") {
      // Remove from tagged queues
      const tags = await redis.smembers(`user:${socketId}:tags`);
      console.log(`[CLEANUP] Removing from tagged queues: ${tags.join(', ')}`);
      
      for (const tag of tags) {
        await redis.lrem(`queue:text:tag:${tag}`, 0, socketId);
        await redis.lrem(`queue:video:tag:${tag}`, 0, socketId);
      }
      await redis.del(`user:${socketId}:tags`);
    } else if (queueType === "general") {
      // Remove from general queues
      console.log(`[CLEANUP] Removing from general queues`);
      await redis.lrem("queue:text", 0, socketId);
      await redis.lrem("queue:video", 0, socketId);
    }
    
    await redis.del(`user:${socketId}:queue_type`);
    
    // Clean up room if in one
    const roomId = await redis.get(`user:${socketId}:room`);
    if (roomId) {
      console.log(`[CLEANUP] Disconnecting from room: ${roomId}`);
      io.to(roomId).emit("partner_disconnected");
      await redis.del(`user:${socketId}:room`);
    }
    
    console.log(`[CLEANUP] Cleanup complete for ${socketId}`);
  };

  io.on("connection", async (socket) => {
    console.log("Client connected", socket.id);
    await redis.incr("stats:users:online");

    // ---------- Queue & Matching ----------
    socket.on("join_queue", async ({ mode, tags = [] }) => {
      // Rate limit join attempts
      const key = `ratelimit:join:${socket.id}`;
      const count = await redis.incr(key);
      if (count === 1) await redis.expire(key, 60);
      if (count > 10) {
        socket.emit("message", { sender: "system", text: "Too many join requests. Please wait." });
        return;
      }

      const queueKey = `queue:${mode}`;
      let partnerId: string | null = null;
      let matchedTag: string | null = null;

      // Try to match by tags first
      if (tags.length > 0) {
        for (const tag of tags) {
          const tagQueue = `queue:${mode}:tag:${tag}`;
          partnerId = await redis.rpop(tagQueue);
          if (partnerId) { matchedTag = tag; break; }
        }
      }
      // Fallback to general queue
      if (!partnerId) partnerId = await redis.rpop(queueKey);

      if (partnerId) {
        const roomId = `${partnerId}-${socket.id}`;
        await redis.mset({
          [`user:${socket.id}:room`]: roomId,
          [`user:${partnerId}:room`]: roomId,
        });
        // Clean partner from any queue metadata
        const partnerQueueType = await redis.get(`user:${partnerId}:queue_type`);
        if (partnerQueueType === "tagged") {
          const partnerTags = await redis.smembers(`user:${partnerId}:tags`);
          for (const t of partnerTags) await redis.lrem(`queue:${mode}:tag:${t}`, 0, partnerId);
          await redis.del(`user:${partnerId}:tags`);
        }
        await redis.del(`user:${partnerId}:queue_type`);

        socket.join(roomId);
        const partnerSocket = io.sockets.sockets.get(partnerId);
        partnerSocket?.join(roomId);

        const msg = matchedTag ? `Stranger found! (Common interest: ${matchedTag})` : "Stranger found!";
        // Emit match_found with initiator flag to prevent glare
        io.to(socket.id).emit("match_found", { roomId, initiator: true });
        io.to(partnerId).emit("match_found", { roomId, initiator: false });
        
        io.to(partnerId).emit("message", { sender: "system", text: msg });
        socket.emit("message", { sender: "system", text: msg });
      } else {
        // No partner – enqueue
        if (tags.length > 0) {
          for (const tag of tags) await redis.lpush(`queue:${mode}:tag:${tag}`, socket.id);
          await redis.sadd(`user:${socket.id}:tags`, ...tags);
          await redis.set(`user:${socket.id}:queue_type`, "tagged");
          socket.emit("message", { sender: "system", text: "Waiting for a stranger with common interests..." });
        } else {
          await redis.lpush(queueKey, socket.id);
          await redis.set(`user:${socket.id}:queue_type`, "general");
          socket.emit("message", { sender: "system", text: "Waiting for a stranger..." });
        }
      }
    });

    // ---------- Text Messaging ----------
    socket.on("message", async (data) => {
      // Get user ID from Redis (stored during ban check)
      const userId = await redis.get(`socket:${socket.id}:userId`);
      
      // Check if user is banned
      if (userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { banned: true, banReason: true }
        });

        if (user?.banned) {
          socket.emit("message", { 
            sender: "system", 
            text: `You have been banned. Reason: ${user.banReason || "Terms violation"}` 
          });
          socket.emit("banned", { reason: user.banReason });
          
          // Disconnect user from room
          const roomId = await redis.get(`user:${socket.id}:room`);
          if (roomId) {
            socket.to(roomId).emit("partner_disconnected");
            socket.leave(roomId);
            await redis.del(`user:${socket.id}:room`);
          }
          
          socket.disconnect();
          return;
        }
      }

      const key = `ratelimit:msg:${socket.id}`;
      const count = await redis.incr(key);
      if (count === 1) await redis.expire(key, 60);
      if (count > 60) {
        socket.emit("message", { sender: "system", text: "You're sending messages too quickly." });
        return;
      }
      const roomId = await redis.get(`user:${socket.id}:room`);
      if (roomId) {
        const clean = filter.clean(data.text);
        socket.to(roomId).emit("message", { sender: "stranger", text: clean });
      }
    });

    // ---------- Leaving ----------
    socket.on("leave_room", async () => {
      const roomId = await redis.get(`user:${socket.id}:room`);
      if (roomId) {
        socket.to(roomId).emit("partner_disconnected");
        socket.leave(roomId);
        await redis.del(`user:${socket.id}:room`);
      }
    });

    // ---------- WebRTC Signaling ----------
    // ---------- WebRTC Signaling ----------
    socket.on("webrtc_offer", async ({ offer }) => {
      const roomId = await redis.get(`user:${socket.id}:room`);
      if (roomId) {
        socket.to(roomId).emit("webrtc_offer", { offer, senderId: socket.id });
      }
    });
    
    socket.on("webrtc_answer", async ({ answer }) => {
      const roomId = await redis.get(`user:${socket.id}:room`);
      if (roomId) {
        socket.to(roomId).emit("webrtc_answer", { answer, senderId: socket.id });
      }
    });
    
    socket.on("webrtc_ice_candidate", async ({ candidate }) => {
      const roomId = await redis.get(`user:${socket.id}:room`);
      if (roomId) {
        socket.to(roomId).emit("webrtc_ice_candidate", { candidate, senderId: socket.id });
      }
    });

    // ---------- Disconnect ----------
    socket.on("disconnect", async (reason) => {
      console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
      await cleanupSocket(socket.id);
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
