import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIP, hashIP, generateUserIdentifier } from "@/lib/fingerprint";
import { getLocationFromIP, maskIP } from "@/lib/geolocation";

export async function POST(req: NextRequest) {
  try {
    const { fingerprintHash } = await req.json();

    if (!fingerprintHash) {
      return NextResponse.json(
        { error: "Fingerprint hash required" },
        { status: 400 }
      );
    }

    // Get and hash IP
    const ip = getClientIP(req.headers);
    const ipHash = hashIP(ip);
    const userId = generateUserIdentifier(ipHash, fingerprintHash);

    // Check if user is banned
    const ban = await prisma.user.findFirst({
      where: {
        OR: [
          { fingerprintHash },
          { ipHash },
          { id: userId },
        ],
        banned: true,
      },
    });

    if (ban) {
      return NextResponse.json({
        banned: true,
        reason: ban.banReason || "Terms of service violation",
        bannedAt: ban.bannedAt,
        permanent: !ban.banExpiry,
        expiresAt: ban.banExpiry,
      });
    }

    // Get location from IP for admin tracking
    const location = await getLocationFromIP(ip);
    const maskedIP = maskIP(ip);

    console.log("[BAN CHECK] IP:", ip, "→ Masked:", maskedIP);
    console.log("[BAN CHECK] Location:", location);

    // User is not banned, create or update user record
    await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        ipHash,
        fingerprintHash,
        ipAddress: maskedIP,
        country: location?.country || null,
        city: location?.city || null,
      },
      update: {
        lastSeen: new Date(),
        ipAddress: maskedIP,
        country: location?.country || null,
        city: location?.city || null,
      },
    });

    console.log("[BAN CHECK] User upserted:", userId);

    return NextResponse.json({
      banned: false,
      userId,
    });
  } catch (error) {
    console.error("Ban check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
