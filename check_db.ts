import { PrismaClient } from "./src/generated/prisma/client";
import { config } from "dotenv";
config();
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL as string });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const creds = await prisma.credential.findMany()
  console.log(JSON.stringify(creds, null, 2));
}

main();
