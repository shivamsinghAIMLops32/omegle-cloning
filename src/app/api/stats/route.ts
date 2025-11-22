import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [onlineUsers, textQueue, videoQueue] = await Promise.all([
      redis.get("stats:users:online"),
      redis.llen("queue:text"),
      redis.llen("queue:video"),
    ]);

    return NextResponse.json({
      onlineUsers: parseInt(onlineUsers || "0"),
      textQueue: textQueue || 0,
      videoQueue: videoQueue || 0,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
