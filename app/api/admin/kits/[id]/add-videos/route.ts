// app/api/admin/kits/[id]/add-videos/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Next.js 15 expects params as Promise
) {
  try {
    // Await the dynamic route param
    const { id: kitId } = await context.params;

    if (!kitId) {
      return NextResponse.json({ error: "Kit ID is required" }, { status: 400 });
    }

    // Check admin session
    const session = await getServerSession({ ...authOptions });
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Parse request body
    const { videoIds } = await req.json();
    if (!videoIds || !Array.isArray(videoIds) || videoIds.length === 0) {
      return NextResponse.json({ error: "Missing or invalid videoIds" }, { status: 400 });
    }

    // Update kit with new videos
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
