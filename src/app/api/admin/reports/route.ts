import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      include: {
        reportedUser: {
          select: {
            id: true,
            ipAddress: true,
            country: true,
            city: true,
            banned: true,
            reportCount: true,
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 100 // Most recent 100 reports
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { reportId, status, action } = await request.json();

    // Update report status
    const report = await prisma.report.update({
      where: { id: reportId },
      data: { status },
      include: {
        reportedUser: true
      }
    });

    // If action is 'ban', ban the reported user
    if (action === 'ban' && report.reportedUser) {
      await prisma.user.update({
        where: { id: report.reportedUser.id },
        data: {
          banned: true,
          bannedAt: new Date(),
          banReason: `Banned due to report: ${report.reason}`
        }
      });
    }

    return NextResponse.json({ success: true, report });
  } catch (error) {
    console.error("Failed to update report:", error);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}
