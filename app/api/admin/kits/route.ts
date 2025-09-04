import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import fs from "fs";
import path from "path";

// POST: Create a new Kit
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const thumbnail = formData.get("thumbnail") as File;
    const videoIds = JSON.parse(formData.get("videoIds") as string) as string[];

    if (!name || !price || !thumbnail || videoIds.length === 0) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Save thumbnail
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const uniqueFileName = `${Date.now()}-${thumbnail.name}`;
    const filePath = path.join(uploadDir, uniqueFileName);
    const buffer = Buffer.from(await thumbnail.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const thumbnailUrl = `/uploads/${uniqueFileName}`;

    // Create Kit with videos
    const kit = await prisma.kit.create({
      data: {
        name,
        price,
        thumbnail: thumbnailUrl,
        createdBy: session.user.id,
        kitVideos: {
          create: videoIds.map((videoId) => ({ videoId })),
        },
      },
      include: {
        kitVideos: { include: { video: true } },
        kitPurchases: true,
      },
    });

    return NextResponse.json(kit);
  } catch (err) {
    console.error("POST /kits error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
// GET: Fetch all kits
export async function GET() {
  try {
    const kits = await prisma.kit.findMany({
      include: {
        kitVideos: {       // ✅ correct relation name
          include: { video: true },
        },
        kitPurchases: true, // ✅ correct relation name
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(kits);
  } catch (err) {
    console.error("GET kits error:", err);
    return NextResponse.json({ error: "Failed to fetch kits" }, { status: 500 });
  }
}
