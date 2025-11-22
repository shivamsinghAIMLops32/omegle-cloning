import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        ipAddress: true,
        country: true,
        city: true,
        reportCount: true,
        banned: true,
        bannedAt: true,
        banExpiry: true,
        banReason: true,
        lastSeen: true,
        createdAt: true,
        _count: {
          select: {
            reportsReceived: true,
          }
        }
      },
      orderBy: {
        lastSeen: 'desc'
      },
      take: 100 // Limit to most recent 100 users
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
