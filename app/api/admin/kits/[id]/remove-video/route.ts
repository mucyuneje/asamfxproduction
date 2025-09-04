import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Next.js 15 expects params as a Promise
) {
  try {
    // Await the dynamic route param
    const { id: kitId } = await context.params;

    if (!kitId) {
      return NextResponse.json({ error: "Kit ID is required" }, { status: 400 });
    }

    const { videoId } = await req.json();
    if (!videoId) {
      return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
    }

    const updatedKit = await prisma.kit.update({
      where: { id: kitId },
      data: {
        kitVideos: {
          deleteMany: { videoId },
        },
      },
      include: {
        kitVideos: { include: { video: true } },
      },
    });

    return NextResponse.json(updatedKit);
  } catch (err) {
    console.error("Failed to remove video from kit:", err);
    return NextResponse.json({ error: "Failed to remove video" }, { status: 500 });
  }
}
