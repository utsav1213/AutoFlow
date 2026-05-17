import { NodeExecutorResult } from "./types";

export async function execute(node: any, inputData: any): Promise<NodeExecutorResult> {
  const path = node.data?.path || node.params?.path;
  const content = node.data?.content || node.params?.content;
  const provider = node.data?.provider || "local";

  if (!path) throw new Error("Missing File Path");

  console.log(`[Storage Node - ${provider}] Saving to ${path}:`, content);
  return { outputData: `Saved to ${provider} at ${path}` };
}
