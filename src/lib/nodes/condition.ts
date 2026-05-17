import { NodeExecutorResult } from "./types";

export async function execute(node: any, inputData: any): Promise<NodeExecutorResult> {
  let conditionResult = false;
  const expression = node.data?.expression || node.params?.expression || "false";
  try {
    const fn = new Function("$input", `return ${expression};`);
    conditionResult = fn(inputData);
    console.log(
      `Evaluating Condition: ${expression} with $input=`,
      inputData,
      "Result:",
      conditionResult,
    );
  } catch (e) {
    console.error("Condition error:", e);
    conditionResult = false;
  }
  return { outputData: conditionResult, handledCondition: true, conditionResult };
}
