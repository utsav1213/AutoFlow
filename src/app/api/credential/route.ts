import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const creds = await (prisma as any).credential.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(creds);
}

export async function POST(req: Request) {
  const { title, platform, data } = await req.json();

  const cred = await (prisma as any).credential.create({
    data: {
      title,
      platform,
      data,
    },
  });

  return NextResponse.json(cred);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    await (prisma as any).credential.delete({ where: { id } });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Missing ID" }, { status: 400 });
}
