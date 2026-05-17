import { NodeExecutorResult } from "./types";
import axios from "axios";

export async function execute(node: any, inputData: any): Promise<NodeExecutorResult> {
  const url = node.data?.url || node.params?.url;
  const method = (node.data?.method || node.params?.method || "GET").toLowerCase();
  let headers = {};
  try {
    headers = JSON.parse(node.data?.headers || node.params?.headers || "{}");
  } catch (e) {}
  let data = undefined;
  try {
    data = JSON.parse(node.data?.body || node.params?.body || "{}");
  } catch (e) {
    data = node.data?.body;
  }

  if (!url) throw new Error("Missing HTTP URL");

  const response = await axios({ method, url, headers, data });
  const outputData = typeof response.data === "object" ? JSON.stringify(response.data) : response.data;
  return { outputData };
}
