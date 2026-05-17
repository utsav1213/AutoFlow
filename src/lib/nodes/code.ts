import { NodeExecutorResult } from "./types";

export async function execute(node: any, inputData: any): Promise<NodeExecutorResult> {
  const code = node.data?.code || node.params?.code || "return $input;";
  console.log("Executing Custom Code...");
  let outputData;
  try {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const fn = new AsyncFunction("$input", code);
    outputData = await fn(inputData);
  } catch (err: any) {
    console.error("Custom Code Error:", err);
    outputData = `Error: ${err.message}`;
  }
  return { outputData };
}
