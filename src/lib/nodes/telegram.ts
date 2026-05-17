import { NodeExecutorResult } from "./types";
import prisma from "../prisma";
import axios from "axios";

export async function execute(node: any, inputData: any): Promise<NodeExecutorResult> {
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

  return { outputData: "Telegram message sent" };
}
