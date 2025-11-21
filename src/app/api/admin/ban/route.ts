import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // Check admin auth
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get("admin_auth");

    if (!adminAuth || adminAuth.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, action, reason, duration } = await req.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: "userId and action required" },
        { status: 400 }
      );
    }

    if (action === "ban") {
      // Calculate ban expiry if duration provided (in hours)
      let banExpiry = null;
      if (duration && duration > 0) {
        banExpiry = new Date(Date.now() + duration * 60 * 60 * 1000);
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          banned: true,
          banReason: reason || "Terms of service violation",
          bannedAt: new Date(),
          banExpiry,
        },
      });

      return NextResponse.json({
        success: true,
        message: `User banned ${duration ? `for ${duration} hours` : "permanently"}`,
      });
    } else if (action === "unban") {
      await prisma.user.update({
        where: { id: userId },
        data: {
          banned: false,
          banReason: null,
          bannedAt: null,
          banExpiry: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: "User unbanned successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'ban' or 'unban'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Ban action error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
