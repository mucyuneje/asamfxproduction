import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import Mux from "@mux/mux-node";

const { MUX_TOKEN_ID, MUX_TOKEN_SECRET } = process.env;

if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
  throw new Error("Missing MUX_TOKEN_ID or MUX_TOKEN_SECRET in .env.local");
}

const mux = new Mux({
  tokenId: MUX_TOKEN_ID,
  tokenSecret: MUX_TOKEN_SECRET,
});

// POST: Create a new video
export async function POST(req: Request) {
  try {
    const {
      title,
      subtitle,
      description,
      category,
      difficulty,
      paymentMethod,
      price,
      uploadId,
    } = await req.json();

    // Validate required fields
    if (!title || !description || !category || !paymentMethod || !uploadId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create video in database
    const video = await prisma.video.create({
      data: {
        title,
        subtitle,
        description,
        category,
        difficulty,
        paymentMethod,
        price: price ? Number(price) : null,
        uploadId,
      },
    });

    return NextResponse.json(video);
  } catch (err) {
    console.error("Failed to save video:", err);
    return NextResponse.json(
      { error: "Failed to save video" },
      { status: 500 }
    );
  }
}

// GET: Fetch all videos
export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(videos);
  } catch (err) {
    console.error("Failed to fetch videos:", err);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
