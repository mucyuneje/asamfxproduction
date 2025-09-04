// app/api/admin/payments/route.ts
import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    // 🔹 Check if user is logged in
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 🔹 Only STUDENT can submit payment
    if (session.user.role !== "STUDENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 🔹 Parse FormData
    const formData = await req.formData();
    const videoId = formData.get("videoId") as string;
    const proof = formData.get("proof") as File;

    if (!videoId || !proof) {
      return NextResponse.json({ error: "videoId and proof are required" }, { status: 400 });
    }

    // 🔹 Save proof file
    const buffer = Buffer.from(await proof.arrayBuffer());
    const fileName = `${Date.now()}-${proof.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, fileName);

    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    // 🔹 Create Payment entry without amount
    const payment = await prisma.payment.create({
      data: {
        videoId,
        userId: session.user.id,
        proofUrl: `/uploads/${fileName}`,
        status: "PENDING",
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        video: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(payment);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


// 🔹 GET all payments for ADMIN dashboard
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        video: { select: { id: true, title: true } },
      },
    });

    return NextResponse.json(payments);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// 🔹 PATCH: approve or reject payment (ADMIN only)
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { paymentId, status }: { paymentId: string; status: "APPROVED" | "REJECTED" } = await req.json();

    if (!paymentId || !status) {
      return NextResponse.json({ error: "paymentId and status are required" }, { status: 400 });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status },
      include: { user: true, video: true },
    });

    return NextResponse.json(updatedPayment);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
