import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    // Correctly await params
    const { id: kitId } = await context.params;

    const body = await req.json();
    const { videoIds } = body; // array of video IDs

    if (!videoIds || !videoIds.length) {
      return NextResponse.json({ error: "Missing videoIds" }, { status: 400 });
    }

    const updatedKit = await prisma.kit.update({
      where: { id: kitId },
      data: {
        kitVideos: {
          create: videoIds.map((videoId: string) => ({ videoId })),
        },
      },
      include: {
        kitVideos: { include: { video: true } },
      },
    });

    return NextResponse.json(updatedKit);
  } catch (err) {
    console.error("Failed to add videos to kit:", err);
    return NextResponse.json({ error: "Failed to add videos" }, { status: 500 });
  }
}
