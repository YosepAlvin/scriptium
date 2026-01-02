import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });

const prisma = new PrismaClient({ adapter });

async function main() {
  const products = await (prisma.product as any).findMany({
    include: {
      sizes: true,
      category: true,
    },
  });

  console.log("Products, Slugs, and their sizes:");
  products.forEach((p: any) => {
    console.log(`- ${p.name} (Slug: ${p.slug}, Category: ${p.category?.name || 'Uncategorized'})`);
    if (p.sizes && Array.isArray(p.sizes) && p.sizes.length > 0) {
      p.sizes.forEach((s: any) => {
        console.log(`  - Size: ${s.name}, Color: ${s.color || 'N/A'}, Stock: ${s.stock}`);
      });
    } else {
      console.log("  - No sizes found");
    }
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
