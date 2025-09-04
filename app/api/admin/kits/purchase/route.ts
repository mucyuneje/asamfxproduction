import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const formData = await req.formData();
  const kitId = formData.get("kitId") as string;
  const proof = formData.get("proof") as File;

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
