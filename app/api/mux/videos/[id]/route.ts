import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH: Update video by ID
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } } // ✅ synchronous params
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
  }

  try {
    const { title, subtitle, description, category, difficulty, paymentMethod, price } = await req.json();

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
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
  }
}
