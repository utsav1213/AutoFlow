import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const workflows = await (prisma as any).workflow.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(workflows);
}

export async function POST(req: Request) {
  const { title, enabled, workflowJson } = await req.json();

  const workflow = await (prisma as any).workflow.create({
    data: {
      title,
      enabled,
      workflowJson,
    },
  });

  return NextResponse.json(workflow);
}
