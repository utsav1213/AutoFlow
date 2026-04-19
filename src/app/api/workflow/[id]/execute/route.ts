import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { workflowQueue } from "@/lib/queue";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const workflow = await prisma.workflow.findUnique({
      where: { id },
    });

    if (!workflow) {
      return NextResponse.json(
        { error: "workflow not found" },
        { status: 404 },
      );
    }

    const execution = await prisma.execution.create({
      data: {
        workflowId: workflow.id,
        status: "running",
      },
    });

    await workflowQueue.add("execute-workflow", {
      workflowId: workflow.id,
      executionId: execution.id,
    });

    return NextResponse.json({
      success: true,
      executionId: execution.id,
    });
  } catch (error) {
    console.error("Error executing workflow:", error);
    return NextResponse.json(
      { error: "Failed to execute workflow" },
      { status: 500 },
    );
  }
}
