import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Next.js 15 expects Promise
) {
  try {
    // Await the dynamic route parameter
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const status = body.status as "APPROVED" | "REJECTED";

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: { status },
      include: { user: true, video: true },
    });

    return NextResponse.json(payment);
  } catch (err) {
    console.error("PATCH /payment/[id] error:", err);
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
  }
}
