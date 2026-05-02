import { NextResponse } from "next/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, credentialId } = body;

    let apiKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (credentialId) {
      const credential = await prisma.credential.findUnique({
        where: { id: credentialId },
      });
      const data = credential?.data as { apiKey?: string };
      if (data?.apiKey) {
        apiKey = data.apiKey;
      }
    }

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "No API Key found. Set GOOGLE_GENERATIVE_AI_API_KEY or provide a valid credential.",
        },
        { status: 400 },
      );
    }

    const google = createGoogleGenerativeAI({
      apiKey,
    });

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: prompt || "Hello",
    });

    return NextResponse.json({ output: text });
  } catch (error: any) {
    console.error("LLM Test Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
