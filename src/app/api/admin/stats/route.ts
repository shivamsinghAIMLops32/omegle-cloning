import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      onlineUsers,
      waitingText,
      waitingVideo,
      totalReports,
      pendingReports
    ] = await Promise.all([
      redis.get("stats:users:online"),
      redis.llen("queue:text"),
      redis.llen("queue:video"),
      prisma.report.count(),
      prisma.report.count({ where: { status: "PENDING" } })
    ]);

    return NextResponse.json({
      onlineUsers: parseInt(onlineUsers || "0"),
      waitingText,
      waitingVideo,
      totalReports,
      pendingReports
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
