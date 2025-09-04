// app/api/admin/kits/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// PATCH: update a kit
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } } // ✅ synchronous params
) {
  const kitId = params.id;
  if (!kitId) return NextResponse.json({ error: "Kit ID is required" }, { status: 400 });

  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  let body: { name?: string; price?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const newName = body.name?.trim();
  const newPrice = body.price;

  if (!newName && newPrice === undefined) {
    return NextResponse.json({ error: "At least one of name or price is required" }, { status: 400 });
  }

  try {
    const kitExists = await prisma.kit.findUnique({ where: { id: kitId } });
    if (!kitExists) return NextResponse.json({ error: "Kit not found" }, { status: 404 });

    const updated = await prisma.kit.update({
      where: { id: kitId },
      data: {
        name: newName ?? kitExists.name,
        price: newPrice ?? kitExists.price,
      },
    });

    return NextResponse.json({ message: "Kit updated successfully", kit: updated });
  } catch (err) {
    console.error("PATCH kit error:", err);
    return NextResponse.json({ error: "Failed to update kit" }, { status: 500 });
  }
}

// DELETE: delete a kit
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const deleted = await prisma.kit.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Kit deleted", kit: deleted });
  } catch (err) {
    console.error("DELETE kit error:", err);
    return NextResponse.json({ error: "Failed to delete kit" }, { status: 500 });
  }
}

// GET: fetch all kits
export async function GET() {
  try {
    const kits = await prisma.kit.findMany({
      include: {
        kitVideos: { include: { video: true } },
        kitPurchases: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const mappedKits = kits.map(k => ({
      ...k,
      videos: k.kitVideos?.map(kv => kv.video) || [],
    }));

    return NextResponse.json(mappedKits);
  } catch (err) {
    console.error("GET kits error:", err);
    return NextResponse.json({ error: "Failed to fetch kits" }, { status: 500 });
  }
}
