
import { PrismaClient } from "@prisma/client";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const db = new Database(dbPath);
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function checkSpecificUsers() {
  const emails = ['buyer92@example.com', 'buyer31@example.com', 'buyer73@example.com', 'buyer64@example.com'];
  for (const email of emails) {
    const user = await prisma.user.findUnique({ where: { email } });
    console.log(`${email}: ${user?.name}`);
  }
  await prisma.$disconnect();
}

checkSpecificUsers();
