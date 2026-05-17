import { NodeExecutorResult } from "./types";
import axios from "axios";

export async function execute(node: any, inputData: any): Promise<NodeExecutorResult> {
  const url = node.data?.url || node.params?.url;
  const selector = node.data?.selector || node.params?.selector;

  if (!url) throw new Error("Missing Scraper URL");

  const { data } = await axios.get(url);
  let output = "";
  if (selector) {
    const cheerio = await import("cheerio");
    const $ = cheerio.load(data);
    output = $(selector).text();
  } else {
    output = data.substring(0, 2000); // return basic truncated mock
  }

  return { outputData: output };
}
