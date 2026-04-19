import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const credential = await prisma.credential.create({
    data: {
      title: body.title || "Untitled Credential",
      platform: body.platform,
      data: body.data,
    },
  });
  return NextResponse.json(credential);
}
