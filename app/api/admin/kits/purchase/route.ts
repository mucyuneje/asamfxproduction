// app/api/kit-purchases/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession({ ...authOptions });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const kitId = formData.get("kitId") as string;
    const proof = formData.get("proof") as File;

    if (!kitId || !proof) {
      return NextResponse.json(
        { error: "kitId and proof are required" },
        { status: 400 }
      );
    }

    // Example: save file to /public/uploads (implement your actual storage logic)
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
  } catch (err) {
    console.error("Failed to create purchase:", err);
    return NextResponse.json(
      { error: "Failed to create purchase" },
      { status: 500 }
    );
  }
}
