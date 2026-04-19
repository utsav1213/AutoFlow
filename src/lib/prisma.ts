import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { config } from "dotenv";

config(); // Ensure variables are loaded in worker contexts too

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// Check if string exists to avoid "client password must be a string"
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error("DATABASE_URL is missing!");

const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
