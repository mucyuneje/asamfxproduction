import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ use Promise
) {
  try {
    const { id } = await context.params; // ✅ await the params
    const body = await req.json();
    const { status } = body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: { status },
      include: { user: true, video: true },
    });

    return NextResponse.json(payment);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
  }
}
