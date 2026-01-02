import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

const createPrismaClient = () => {
  const rawConnectionString = process.env.DATABASE_URL;
  const connectionString = rawConnectionString
    ? rawConnectionString.trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1")
    : "";

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set (or is empty). Set it in Vercel Environment Variables without quotes."
    );
  }

  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString,
      max: process.env.NODE_ENV === "production" ? 1 : 5,
    });
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pgPool = pool;
  }

  return client;
};

const getPrismaClient = () => {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
};

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop as any];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
