import { NextRequest, NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status } = body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: { status },
      include: { user: true, video: true }, // so frontend still gets user & video info
    });

    return NextResponse.json(payment);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
  }
}
