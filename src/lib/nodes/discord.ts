import { NodeExecutorResult } from "./types";

export async function executeDiscordNode(node: any, inputData: any): Promise<NodeExecutorResult> {
  console.log(`Executing discord node...`);
  
  // TODO: Implement discord logic here
  
  return { outputData: `discord executed successfully` };
}
