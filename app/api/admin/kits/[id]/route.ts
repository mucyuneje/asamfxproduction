// app/api/admin/kits/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Must be a Promise
) {
  try {
    // Await the dynamic route param
    const { id: kitId } = await context.params;

    if (!kitId) {
      return NextResponse.json({ error: "Kit ID is required" }, { status: 400 });
    }

    const body = await req.json();
    if (!body) {
      return NextResponse.json({ error: "Request body is required" }, { status: 400 });
    }

    // Example: update kit name
    const updatedKit = await prisma.kit.update({
      where: { id: kitId },
      data: {
        name: body.name,
      },
    });

    return NextResponse.json({ message: "Kit updated", kit: updatedKit });
  } catch (err) {
    console.error("Failed to update kit:", err);
    return NextResponse.json({ error: "Failed to update kit" }, { status: 500 });
  }
} 
// DELETE: delete a kit
// DELETE: delete a kit
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Must be a Promise
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id: kitId } = await context.params;

    if (!kitId) {
      return NextResponse.json({ error: "Kit ID is required" }, { status: 400 });
    }

    const deleted = await prisma.kit.delete({ where: { id: kitId } });
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
