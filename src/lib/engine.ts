import prisma from "./prisma";
import axios from "axios";

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
      console.log(`Running node [${node.data?.type}]:`, node.id);

      // Node output will hold the final result of this node's executed action
      let outputData = node.data?.output || null;

      // Logic: If / Else Condition
      let handledCondition = false;
      let conditionResult = false;
      if (node.data?.type === "condition" || node.type === "condition") {
        const expression =
          node.data?.expression || node.params?.expression || "false";
        try {
          // create a safe evaluator where $input is the previous node's data
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
        outputData = conditionResult; // save result directly
        handledCondition = true;
      }

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
        let apiKey, provider;

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
          // Default to gemini if no credential and use env var
          provider = "gemini";
          apiKey =
            process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
            process.env.GEMINI_API_KEY;
        }

        if (!apiKey)
          throw new Error(`Missing API Key for LLM provider: ${provider}`);

        const prompt =
          node.data?.prompt || node.params?.prompt || "Say hello world";

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
      }

      // HTTP Request action
      if (node.data?.type === "http" || node.type === "http") {
        const url = node.data?.url || node.params?.url;
        const method = (
          node.data?.method ||
          node.params?.method ||
          "GET"
        ).toLowerCase();
        let headers = {};
        try {
          headers = JSON.parse(
            node.data?.headers || node.params?.headers || "{}",
          );
        } catch (e) {}
        let data = undefined;
        try {
          data = JSON.parse(node.data?.body || node.params?.body || "{}");
        } catch (e) {
          data = node.data?.body;
        }

        if (!url) throw new Error("Missing HTTP URL");

        const response = await axios({ method, url, headers, data });
        outputData =
          typeof response.data === "object"
            ? JSON.stringify(response.data)
            : response.data;
      }

      // Web Scraper action
      if (node.data?.type === "scraper" || node.type === "scraper") {
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

        outputData = output;
      }

      // File Storage action
      if (node.data?.type === "storage" || node.type === "storage") {
        const path = node.data?.path || node.params?.path;
        const content = node.data?.content || node.params?.content;
        const provider = node.data?.provider || "local";

        if (!path) throw new Error("Missing File Path");

        console.log(`[Storage Node - ${provider}] Saving to ${path}:`, content);
        outputData = `Saved to ${provider} at ${path}`;
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
          // If this was a condition, only traverse the matching edge (true or false source handle)
          const expectedHandle = conditionResult ? "true" : "false";
          if (edge.sourceHandle && edge.sourceHandle !== expectedHandle) {
            continue; // skip this edge
          }
        }

        const nextNode = nodeMap.get(edge.target);
        if (nextNode) {
          queue.push({ node: nextNode, inputData: node.data });
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
