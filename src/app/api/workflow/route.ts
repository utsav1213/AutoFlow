import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const workflow = await prisma.workflow.create({
    data: {
      title: body.title,
      workflowJson: body.workflowJson,
    },
  });

  return NextResponse.json(workflow);
}
