import { config } from "dotenv";
config();
import { Worker } from "bullmq";
import IORedis from "ioredis";
import prisma from "../src/lib/prisma";
import { runWorkflow } from "../src/lib/engine";

const connection = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  {
    maxRetriesPerRequest: null,
  },
);

const worker = new Worker(
  "workflow-queue",
  async (job) => {
    console.log(
      `[Job ${job.id}] Picked up execution ID: ${job.data.executionId}`,
    );
    try {
      const { workflowId, executionId } = job.data;

      const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId },
      });

      if (!workflow) throw new Error("Workflow not found");

      await runWorkflow(workflow.workflowJson, executionId);
      console.log(`[Job ${job.id}] Successfully completed`);
    } catch (err: any) {
      console.error(`[Job ${job.id}] Failed to run workflow:`, err.message);
      throw err;
    }
  },
  { connection },
);

worker.on("failed", (job, err) => {
  console.error(`BullMQ job ${job?.id} failed with reason: ${err.message}`);
});

console.log(
  "Worker started 🚀 waiting for jobs on redis:",
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
);
