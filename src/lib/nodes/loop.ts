import { NodeExecutorResult } from "./types";

export async function execute(node: any, inputData: any): Promise<NodeExecutorResult> {
  let loopItems: any[] = [];
  const expression = node.data?.arrayExpression || node.params?.arrayExpression || "[]";
  try {
    const fn = new Function("$input", `return ${expression};`);
    const res = fn(inputData);
    if (Array.isArray(res)) loopItems = res;
  } catch (e) {
    console.error("Loop error:", e);
  }
  return { outputData: loopItems, handledLoop: true, loopItems };
}
