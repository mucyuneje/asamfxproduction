// app/api/kits/purchase/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const formData = await req.formData();
  const kitId = formData.get("kitId") as string;
  const proof = formData.get("proof") as File;

  // Same as before, you’d upload to storage
  const proofUrl = `/uploads/${proof.name}`;

  const purchase = await prisma.kitPurchase.create({
    data: {
      userId: session.user.id,
      kitId,
      proofUrl,
      status: "PENDING",
    },
  });

  return NextResponse.json(purchase);
}
