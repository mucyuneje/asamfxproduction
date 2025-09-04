import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id: kitId } = await context.params; // Await params
    const { videoId } = await req.json();

    if (!videoId) {
      return NextResponse.json({ error: "Missing videoId" }, { status: 400 });
    }

    const updatedKit = await prisma.kit.update({
      where: { id: kitId },
      data: {
        kitVideos: {
          deleteMany: { videoId }, // Correct relation name
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
