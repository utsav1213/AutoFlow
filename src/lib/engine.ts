import prisma from "./prisma";
import { executors } from "./nodes";

function interpolateStr(str: string, data: any): string {
  if (typeof str !== "string") return str;
  return str.replace(/\$\{([^}]+)\}/g, (match, path) => {
    try {
      const keys = path.trim().split(".");
      let val = data;
      for (const key of keys) {
        if (val === undefined || val === null) return match;
        val = val[key];
      }
      return val !== undefined
        ? typeof val === "object"
          ? JSON.stringify(val)
          : String(val)
        : match;
    } catch {
      return match;
    }
  });
}

function deepInterpolate(obj: any, data: any): any {
  if (typeof obj === "string") {
    return interpolateStr(obj, data);
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepInterpolate(item, data));
  }
  if (obj !== null && typeof obj === "object") {
    const res: any = {};
    for (const key in obj) {
      res[key] = deepInterpolate(obj[key], data);
    }
    return res;
  }
  return obj;
}

export async function runWorkflow(workflow: any, executionId: string) {
  let completedTasks = 0;
  const nodes = workflow.nodes || [];
  const edges = workflow.edges || [];

  const nodeMap = new Map(nodes.map((n: any) => [n.id, n]));
  const targetIds = new Set(edges.map((e: any) => e.target));

  // Find starting nodes: category === "trigger" OR no incoming edges
  const startNodes = nodes.filter(
    (n: any) => n.data?.category === "trigger" || !targetIds.has(n.id),
  );

  // Queue holds { node, inputData (from previous node) }
  const queue: { node: any; inputData: any }[] = startNodes.map((n: any) => ({
    node: n,
    inputData: {},
  }));
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { node, inputData } = queue.shift()!;
    if (visited.has(node.id)) continue;
    visited.add(node.id);

    try {
      node.data = deepInterpolate(node.data || {}, inputData);
      node.params = deepInterpolate(node.params || {}, inputData);

      const type = node.data?.type || node.type;
      console.log(`Running node [${type}]:`, node.id);

      let outputData = node.data?.output || null;
      let handledCondition = false;
      let conditionResult = false;
      let handledLoop = false;
      let loopItems: any[] = [];

      const executor = executors[type];
      if (executor) {
        const result = await executor(node, inputData);
        outputData = result.outputData;
        if (result.handledCondition) {
          handledCondition = result.handledCondition;
          conditionResult = result.conditionResult || false;
        }
        if (result.handledLoop) {
          handledLoop = result.handledLoop;
          loopItems = result.loopItems || [];
        }
      } else {
        console.warn(`No executor found for node type: ${type}`);
      }

      node.data = { ...node.data, output: outputData };

      completedTasks++;

      await prisma.executionStep.create({
        data: {
          executionId,
          nodeId: node.id,
          status: "success",
        },
      });

      // Update execution status
      await prisma.execution.update({
        where: { id: executionId },
        data: { tasksDone: `${completedTasks}/${nodes.length}` },
      });

      // Handle branching & queue next nodes
      const outgoingEdges = edges.filter((e: any) => e.source === node.id);
      for (const edge of outgoingEdges) {
        if (handledCondition) {
          const expectedHandle = conditionResult ? "true" : "false";
          if (edge.sourceHandle && edge.sourceHandle !== expectedHandle) {
            continue; // skip this edge
          }
          const nextNode = nodeMap.get(edge.target);
          if (nextNode) {
            queue.push({ node: nextNode, inputData: node.data });
          }
        } else if (handledLoop) {
          const nextNode = nodeMap.get(edge.target);
          if (nextNode) {
            if (edge.sourceHandle === "loop") {
              for (const item of loopItems) {
                queue.push({
                  node: nextNode,
                  inputData: { ...node.data, output: item },
                });
              }
            } else if (edge.sourceHandle === "done") {
              queue.push({ node: nextNode, inputData: node.data });
            }
          }
        } else {
          const nextNode = nodeMap.get(edge.target);
          if (nextNode) {
            queue.push({ node: nextNode, inputData: node.data });
          }
        }
      }
    } catch (error: any) {
      console.error("Error executing node", node.id, error?.message);
      await prisma.executionStep.create({
        data: {
          executionId,
          nodeId: node.id,
          status: "failed",
        },
      });

      await prisma.execution.update({
        where: { id: executionId },
        data: {
          status: "failed",
          tasksDone: `${completedTasks}/${nodes.length}`,
        },
      });
      // Optionally halt workflow on block failure
      // break;
    }
  }

  const currentExecution = await prisma.execution.findUnique({
    where: { id: executionId },
  });
  if (currentExecution?.status !== "failed") {
    await prisma.execution.update({
      where: { id: executionId },
      data: { status: "success", tasksDone: `${nodes.length}/${nodes.length}` },
    });
  }
}
