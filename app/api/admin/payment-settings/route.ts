import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.paymentSettings.findFirst();
    if (!settings) {
      return NextResponse.json({
        mobileMoney: { account: "", owner: "", instructions: "" },
        crypto: { account: "", owner: "", instructions: "" },
      });
    }

    return NextResponse.json({
      mobileMoney: {
        account: settings.mobileMoneyAccount || "",
        owner: settings.mobileMoneyOwner || "",
        instructions: settings.mobileMoneyInstructions || "",
      },
      crypto: {
        account: settings.cryptoAccount || "",
        owner: settings.cryptoOwner || "",
        instructions: settings.cryptoInstructions || "",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mobileMoney, crypto } = body;

    // Validate body
    if (!mobileMoney || !crypto) {
      return NextResponse.json(
        { error: "Both mobileMoney and crypto fields are required" },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await prisma.paymentSettings.findFirst();

    let updated;
    if (existing) {
      updated = await prisma.paymentSettings.update({
        where: { id: existing.id },
        data: {
          mobileMoneyAccount: mobileMoney.account,
          mobileMoneyOwner: mobileMoney.owner,
          mobileMoneyInstructions: mobileMoney.instructions,
          cryptoAccount: crypto.account,
          cryptoOwner: crypto.owner,
          cryptoInstructions: crypto.instructions,
        },
      });
    } else {
      updated = await prisma.paymentSettings.create({
        data: {
          mobileMoneyAccount: mobileMoney.account,
          mobileMoneyOwner: mobileMoney.owner,
          mobileMoneyInstructions: mobileMoney.instructions,
          cryptoAccount: crypto.account,
          cryptoOwner: crypto.owner,
          cryptoInstructions: crypto.instructions,
        },
      });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
