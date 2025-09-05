import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH: Update video by ID
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ dynamic params must be awaited
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const {
      title,
      subtitle,
      description,
      category,
      difficulty,
      paymentMethod,
      price,
    } = body;

    if (!title || !description || !category || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updated = await prisma.video.update({
      where: { id },
      data: {
        title,
        subtitle,
        description,
        category,
        difficulty,
        paymentMethod,
        price: price !== undefined ? Number(price) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Failed to update video:", err);
    return NextResponse.json(
      { error: "Failed to update video" },
      { status: 500 }
    );
  }
}
