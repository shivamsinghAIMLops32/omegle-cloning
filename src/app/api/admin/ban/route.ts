import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // Check admin auth
    const cookieStore = await cookies();
    const adminAuth = cookieStore.get("admin_auth");

    if (!adminAuth || adminAuth.value !== "true") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, action, banned, banReason, reason, duration } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId required" },
        { status: 400 }
      );
    }

    // Support both old (banned: boolean) and new (action: string) formats
    const shouldBan = action === "ban" || (banned === true && action !== "unban");
    const shouldUnban = action === "unban" || (banned === false && action !== "ban");

    if (shouldBan) {
      // Calculate ban expiry if duration provided (in hours)
      let banExpiry = null;
      if (duration && duration > 0) {
        banExpiry = new Date(Date.now() + duration * 60 * 60 * 1000);
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          banned: true,
          banReason: banReason || reason || "Terms of service violation",
          bannedAt: new Date(),
          banExpiry,
        },
      });

      return NextResponse.json({
        success: true,
        message: `User banned ${duration ? `for ${duration} hours` : "permanently"}`,
      });
    } else if (shouldUnban) {
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
        { error: "Invalid action. Use 'ban' or 'unban', or set banned to true/false" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Ban action error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
