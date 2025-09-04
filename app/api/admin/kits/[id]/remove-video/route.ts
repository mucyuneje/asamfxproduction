import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } } // ✅ synchronous params
) {
  const kitId = params.id;

  if (!kitId) {
    return NextResponse.json({ error: "Kit ID is required" }, { status: 400 });
  }

  try {
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
