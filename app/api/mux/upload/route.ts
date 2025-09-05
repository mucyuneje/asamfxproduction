import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;

if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
  throw new Error("Missing MUX_TOKEN_ID or MUX_TOKEN_SECRET in .env.local");
}

const mux = new Mux({
  tokenId: MUX_TOKEN_ID,
  tokenSecret: MUX_TOKEN_SECRET,
});

// POST: create a new Mux direct upload
export async function POST() {
  try {
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ["public"], // ensure playback ID is generated
      },
      cors_origin: "*",
    });

    return NextResponse.json({
      uploadUrl: upload.url,
      uploadId: upload.id,
      status: "waiting",
    });
  } catch (err: any) {
    console.error("POST /mux/upload error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create upload URL" },
      { status: 500 }
    );
  }
}
