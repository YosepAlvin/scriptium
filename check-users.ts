
import { PrismaClient } from "@prisma/client";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const db = new Database(dbPath);
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function checkUsers() {
  const users = await prisma.user.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' }
  });
  console.log("Recent Users:");
  users.forEach(u => console.log(`- ${u.name} (${u.email})`));
  
  const pembeliCount = await prisma.user.count({
    where: { name: { contains: "Pembeli" } }
  });
  console.log(`\nTotal users with 'Pembeli' in name: ${pembeliCount}`);
  
  await prisma.$disconnect();
}

checkUsers();
