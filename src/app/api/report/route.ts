import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { withRateLimit } from "@/lib/apiRateLimit";
import { RATE_LIMITS } from "@/lib/rateLimit";

const reportSchema = z.object({
  reportedId: z.string().optional(),
  reason: z.string().min(1, "Reason is required"),
  screenshot: z.string().optional(),
  sessionId: z.string().optional(),
});

async function handlePost(request: NextRequest) {
  try {
    const body = await request.json();
    const { reason, screenshot, reportedId } = reportSchema.parse(body);

    const report = await prisma.report.create({
      data: {
        reason,
        screenshot,
        reportedUser: {
          connectOrCreate: {
            where: { id: reportedId || "unknown" },
            create: { 
              id: reportedId || "unknown",
              ipHash: "unknown", 
            }
          }
        }
      },
    });

    return NextResponse.json({ success: true, reportId: report.id });
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit report" }, { status: 500 });
  }
}

// Apply strict rate limiting: 20 reports per minute
export const POST = withRateLimit(handlePost, RATE_LIMITS.API_STRICT);
