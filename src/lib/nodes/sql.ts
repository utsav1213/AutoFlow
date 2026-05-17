import { NodeExecutorResult } from "./types";

export async function execute(node: any, inputData: any): Promise<NodeExecutorResult> {
  const connectionString = node.data?.connectionString || node.params?.connectionString;
  const query = node.data?.query || node.params?.query;

  if (!connectionString) throw new Error("Missing SQL Connection String");
  if (!query) throw new Error("Missing SQL Query");

  const { Client } = await import("pg");
  const client = new Client({ connectionString });
  await client.connect();

  console.log(`Executing SQL Query: ${query}`);
  const res = await client.query(query);
  await client.end();

  return { outputData: res.rows };
}
