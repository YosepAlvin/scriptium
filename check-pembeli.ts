
import { PrismaClient } from "@prisma/client";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const db = new Database(dbPath);
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function check() {
  const pembeliCount = await prisma.user.count({
    where: {
      name: {
        contains: "Pembeli"
      }
    }
  });
  console.log("Users with 'Pembeli' in name:", pembeliCount);
  
  const totalUsers = await prisma.user.count({
    where: {
      role: "BUYER"
    }
  });
  console.log("Total BUYER users:", totalUsers);

  const sampleUsers = await prisma.user.findMany({
    where: { role: "BUYER" },
    take: 5,
    select: { name: true }
  });
  console.log("Sample names:", sampleUsers.map(u => u.name));

  await prisma.$disconnect();
}

check();
