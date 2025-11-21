import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import Redis from "ioredis";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(async () => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  // Redis client for the server
  const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

  // Profanity filter - dynamic import for CommonJS module
  const { Filter: BadWordsFilter } = await import("bad-words");
  const filter = new BadWordsFilter();

  io.on("connection", async (socket) => {
    console.log("Client connected", socket.id);
    await redis.incr("stats:users:online");

    socket.on("join_queue", async ({ mode, tags = [] }) => {
      // Rate limiting: 10 joins per minute
      const key = `ratelimit:join:${socket.id}`;
      const count = await redis.incr(key);
      if (count === 1) await redis.expire(key, 60);
      
      if (count > 10) {
        socket.emit("message", { sender: "system", text: "Too many requests. Please wait a moment." });
        return;
      }

      const queueKey = `queue:${mode}`;
      let partnerId: string | null = null;
      let matchedTag: string | null = null;

      // 1. Try to match with tags first
      if (tags.length > 0) {
        // Shuffle tags to avoid bias? For now, just iterate
        for (const tag of tags) {
          const tagQueueKey = `queue:${mode}:tag:${tag}`;
          partnerId = await redis.rpop(tagQueueKey);
          if (partnerId) {
            matchedTag = tag;
            break;
          }
        }
      }

      // 2. If no tag match, try general queue (if user is willing? For now, assume yes)
      // Actually, if user provided tags, they might prefer tagged users.
      // Omegle logic: try to match tags, if not, match anyone.
      if (!partnerId) {
        partnerId = await redis.rpop(queueKey);
      }

      if (partnerId) {
        // Match found
        const roomId = `${partnerId}-${socket.id}`;
        
        // Store room info for both users
        await redis.set(`user:${socket.id}:room`, roomId);
        await redis.set(`user:${partnerId}:room`, roomId);

        // Remove partner from their queues (if they were waiting)
        const partnerQueueType = await redis.get(`user:${partnerId}:queue_type`);
        if (partnerQueueType === "tagged") {
           const partnerTags = await redis.smembers(`user:${partnerId}:tags`);
           for (const tag of partnerTags) {
             await redis.lrem(`queue:${mode}:tag:${tag}`, 0, partnerId);
           }
           await redis.del(`user:${partnerId}:tags`);
        } else {
           // They were in general queue, already popped
        }
        await redis.del(`user:${partnerId}:queue_type`);


        socket.join(roomId);
        io.sockets.sockets.get(partnerId)?.join(roomId);

        const msg = matchedTag ? `Stranger found! (Common interest: ${matchedTag})` : "Stranger found!";
        io.to(roomId).emit("match_found", { roomId });
        io.to(partnerId).emit("message", { sender: "system", text: msg });
        socket.emit("message", { sender: "system", text: msg });
      } else {
        // No match, add to queue
        if (tags.length > 0) {
          for (const tag of tags) {
            await redis.lpush(`queue:${mode}:tag:${tag}`, socket.id);
          }
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

    socket.on("message", async (data) => {
      // Rate limiting: 60 messages per minute
      const key = `ratelimit:msg:${socket.id}`;
      const count = await redis.incr(key);
      if (count === 1) await redis.expire(key, 60);
      
      if (count > 60) {
        socket.emit("message", { sender: "system", text: "You're sending messages too quickly." });
        return;
      }

      const roomId = await redis.get(`user:${socket.id}:room`);
      if (roomId) {
        // Apply profanity filter
        const cleanText = filter.clean(data.text);
        socket.to(roomId).emit("message", { sender: "stranger", text: cleanText });
      }
    });

    socket.on("leave_room", async () => {
      const roomId = await redis.get(`user:${socket.id}:room`);
      if (roomId) {
        // Notify partner
        socket.to(roomId).emit("message", { sender: "system", text: "Stranger has disconnected." });
        socket.to(roomId).emit("partner_disconnected");
        
        // Leave the room
        socket.leave(roomId);
        
        // Clean up room reference
        await redis.del(`user:${socket.id}:room`);
      }
    });

    socket.on("disconnect", async () => {
      console.log("Client disconnected", socket.id);
      await redis.decr("stats:users:online");
      
      // Remove from queue if waiting
      const queueType = await redis.get(`user:${socket.id}:queue_type`);
      if (queueType === "tagged") {
        const tags = await redis.smembers(`user:${socket.id}:tags`);
        for (const tag of tags) {
          // We don't know the mode here easily without storing it. 
          // For simplicity, let's assume we store mode too or just try both.
          // Better: store `user:{id}:mode`
          // For now, let's just try removing from both text and video queues for these tags
          await redis.lrem(`queue:text:tag:${tag}`, 0, socket.id);
          await redis.lrem(`queue:video:tag:${tag}`, 0, socket.id);
        }
        await redis.del(`user:${socket.id}:tags`);
      } else if (queueType === "general") {
         await redis.lrem("queue:text", 0, socket.id);
         await redis.lrem("queue:video", 0, socket.id);
      }
      await redis.del(`user:${socket.id}:queue_type`);

      // Notify partner if matched
      const roomId = await redis.get(`user:${socket.id}:room`);
      if (roomId) {
        socket.to(roomId).emit("message", { sender: "system", text: "Stranger disconnected." });
        socket.to(roomId).emit("partner_disconnected");
        
        // Clean up room data
        await redis.del(`user:${socket.id}:room`);
        // We don't delete the partner's room key here immediately to allow them to see the disconnect message
        // But in a real app we'd have a more robust cleanup strategy
      }
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
