import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Mux from "@mux/mux-node";

const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;

if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
  throw new Error("Missing MUX_TOKEN_ID or MUX_TOKEN_SECRET in .env.local");
}

const mux = new Mux({ tokenId: MUX_TOKEN_ID, tokenSecret: MUX_TOKEN_SECRET });

type Params = { params: Promise<{ uploadId: string }> };

// GET: Fetch Mux upload & asset info
export async function GET(req: NextRequest, context: Params) {
  try {
    const { uploadId } = await context.params;

    if (!uploadId) {
      return NextResponse.json({ error: "Upload ID is required" }, { status: 400 });
    }

    // Retrieve upload info from Mux
    const upload = await mux.video.uploads.retrieve(uploadId);

    let assetInfo: any = null;
    let playbackId: string | null = null;

    if (upload.asset_id) {
      assetInfo = await mux.video.assets.retrieve(upload.asset_id);

      if (assetInfo.playback_ids?.length) {
        playbackId = assetInfo.playback_ids[0].id;
      } else {
        const newPlayback = await mux.video.assets.createPlaybackId(assetInfo.id, {
          policy: "public",
        });
        playbackId = newPlayback.id;
      }
    }

    // Save playbackId to DB if not already saved
    if (playbackId) {
      const videoRecord = await prisma.video.findFirst({ where: { uploadId } });
      if (videoRecord) {
        await prisma.video.update({
          where: { id: videoRecord.id },
          data: { playbackId },
        });
      }
    }

    return NextResponse.json({
      uploadId,
      status: upload.status,
      assetId: upload.asset_id || null,
      playbackId,
      assetInfo,
    });
  } catch (error: any) {
    console.error("GET /mux/upload/[uploadId] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch upload/asset info" },
      { status: 500 }
    );
  }
}
