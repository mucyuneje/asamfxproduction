import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

// PATCH: Update video by ID
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { title, subtitle, description, category, difficulty, paymentMethod, price } = await req.json();

    if (!id) return NextResponse.json({ error: "Video ID is required" }, { status: 400 });

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
