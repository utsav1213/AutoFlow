import prisma from "./src/lib/prisma";

async function main() {
  await prisma.$executeRawUnsafe('DELETE FROM "Credential";');
  console.log("Cleared");
}
main();
