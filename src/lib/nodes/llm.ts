import { NodeExecutorResult } from "./types";
import prisma from "../prisma";
import axios from "axios";

export async function execute(node: any, inputData: any): Promise<NodeExecutorResult> {
  let apiKey, provider;
  let outputData;

  if (node.data?.credentialId || node.credentialId) {
    const credential = await prisma.credential.findUnique({
      where: { id: node.data?.credentialId || node.credentialId },
    });
    const data = credential?.data as {
      provider?: string;
      apiKey?: string;
    };
    provider = data?.provider || "openai";
    apiKey = data?.apiKey;
  } else {
    provider = "gemini";
    apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  }

  if (!apiKey) throw new Error(`Missing API Key for LLM provider: ${provider}`);

  const prompt = node.data?.prompt || node.params?.prompt || "Say hello world";

  if (provider === "openai") {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    outputData = res.data?.choices?.[0]?.message?.content;
  } else if (provider === "gemini") {
    const { generateText } = await import("ai");
    const { createGoogleGenerativeAI } = await import("@ai-sdk/google");

    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: prompt,
    });

    console.log("LLM output:", text);
    outputData = text;
  } else if (provider === "anthropic") {
    const res = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-haiku-20240320",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
      },
    );
    outputData = res.data?.content?.[0]?.text;
  }
  return { outputData };
}
