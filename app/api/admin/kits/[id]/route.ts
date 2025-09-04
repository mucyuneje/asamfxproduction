// app/api/admin/kits/[id]/route.ts
import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const kitId = params.id;
  if (!kitId) return NextResponse.json({ error: "Kit ID is required" }, { status: 400 });

  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  let body: { name?: string; price?: number };
  try {
    body = await req.json();
  } catch (err) {
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

// DELETE: delete entire kit
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  // ✅ Pass authOptions here
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const deleted = await prisma.kit.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Kit deleted", kit: deleted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete kit" }, { status: 500 });
  }
}
export async function GET() {
  try {
    const kits = await prisma.kit.findMany({
      include: {
        kitVideos: {
          include: { video: true }, // include the full video object
        },
        kitPurchases: true, // if you need purchases info
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Map kitVideos to a flat videos array for frontend convenience
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