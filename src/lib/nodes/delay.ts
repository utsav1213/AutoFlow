import { NodeExecutorResult } from "./types";

export async function execute(node: any, inputData: any): Promise<NodeExecutorResult> {
  const durationSetting = node.data?.duration || node.params?.duration || "1000";
  const duration = parseInt(durationSetting, 10) || 1000;
  console.log(`Sleeping for ${duration}ms...`);
  await new Promise((resolve) => setTimeout(resolve, duration));
  return { outputData: `Delayed for ${duration}ms` };
}
