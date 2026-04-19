import prisma from "./prisma";
import axios from "axios";

export async function runWorkflow(workflow: any, executionId: string) {
  let completedTasks = 0;
  const nodes = workflow.nodes || [];

  for (const node of nodes) {
    try {
      console.log("Running node:", node);

      // Telegram action
      if (node.data?.type === "telegram" || node.type === "telegram") {
        const credential = await prisma.credential.findUnique({
          where: { id: node.data?.credentialId || node.credentialId },
        });

        const data = credential?.data as { token?: string };
        const token = data?.token;

        if (!token) throw new Error("Missing Telegram token");

        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
          chat_id: node.data?.chatId || node.params?.chatId,
          text: node.data?.message || node.params?.message || "From AutoFlow",
        });
      }

      // Resend Email action
      if (node.data?.type === "resend" || node.type === "resend") {
        const credential = await prisma.credential.findUnique({
          where: { id: node.data?.credentialId || node.credentialId },
        });

        const data = credential?.data as { apiKey?: string };
        const apiKey = data?.apiKey;

        if (!apiKey) throw new Error("Missing Resend API Key");

        await axios.post(
          "https://api.resend.com/emails",
          {
            from: "Autoflow <onboarding@resend.dev>",
            to: [node.data?.to || node.params?.to],
            subject:
              node.data?.subject ||
              node.params?.subject ||
              "Workflow Notification",
            html: `<p>${node.data?.body || node.params?.body}</p>`,
          },
          { headers: { Authorization: `Bearer ${apiKey}` } },
        );
      }

      // LLM Response action
      if (node.data?.type === "llm" || node.type === "llm") {
        const credential = await prisma.credential.findUnique({
          where: { id: node.data?.credentialId || node.credentialId },
        });

        const data = credential?.data as { provider?: string; apiKey?: string };
        const provider = data?.provider || "openai";
        const apiKey = data?.apiKey;

        if (!apiKey)
          throw new Error(`Missing API Key for LLM provider: ${provider}`);

        const prompt =
          node.data?.prompt || node.params?.prompt || "Say hello world";

        if (provider === "openai") {
          await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: prompt }],
            },
            { headers: { Authorization: `Bearer ${apiKey}` } },
          );
        } else if (provider === "gemini") {
          await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
              contents: [{ parts: [{ text: prompt }] }],
            },
          );
        } else if (provider === "anthropic") {
          await axios.post(
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
        }
      }

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

  // Double check if previously set as failed
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
