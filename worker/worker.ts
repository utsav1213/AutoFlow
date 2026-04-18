import { Worker } from "bullmq";
import IORedis from "ioredis";
import  prisma  from "../src/lib/prisma";
import { runWorkflow } from "../src/lib/engine";
const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "workflow-queue",
  async (job) => {
    const { workflowId, executionId } = job.data;

    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) throw new Error("Workflow not found");

    await runWorkflow(workflow.workflowJson, executionId);
  },
  { connection },
);

console.log("Worker started 🚀");
