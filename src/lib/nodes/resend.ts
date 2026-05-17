import { NodeExecutorResult } from "./types";
import prisma from "../prisma";
import axios from "axios";

export async function execute(node: any, inputData: any): Promise<NodeExecutorResult> {
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
      subject: node.data?.subject || node.params?.subject || "Workflow Notification",
      html: `<p>${node.data?.body || node.params?.body}</p>`,
    },
    { headers: { Authorization: `Bearer ${apiKey}` } },
  );

  return { outputData: "Email sent" };
}
