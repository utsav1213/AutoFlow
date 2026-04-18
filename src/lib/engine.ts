import  prisma  from "./prisma";
import axios from "axios";


export async function runWorkflow(workflow: any, executionId: string) {
  for (const node of workflow.nodes) {
    try {
      console.log("Running node:", node);

   if (node.type === "telegram") {
     const credential = await prisma.credential.findUnique({
       where: { id: node.credentialId },
     });

     const data = credential?.data as { token: string };
     const token = data?.token;

     if (!token) {
       throw new Error("Missing Telegram token");
     }

     await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
       chat_id: node.params.chatId,
       text: node.params.message,
     });
   }
      // Save success step
      await prisma.executionStep.create({
        data: {
          executionId,
          nodeId: node.id,
          status: "success",
        },
      });
    } catch (error) {
      // Save failed step
      await prisma.executionStep.create({
        data: {
          executionId,
          nodeId: node.id,
          status: "failed",
        },
      });
    }
  }

  await prisma.execution.update({
    where: { id: executionId },
    data: { status: "success" },
  });
}
