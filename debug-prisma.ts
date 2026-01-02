
import { PrismaClient } from "@prisma/client";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
new Database(dbPath); // Initialize to ensure file exists
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function debug() {
  try {
    const product = await prisma.product.findFirst({
      include: {
        // @ts-ignore
        reviews: true,
        // @ts-ignore
        sizes: true
      }
    });
    
    if (product) {
      console.log("Successfully fetched product with reviews and sizes");
      // @ts-ignore - reviews might not be recognized if linter is slow
      console.log("Reviews count:", product.reviews?.length);
      // @ts-ignore - sizes might not be recognized if linter is slow
      console.log("Sizes count:", product.sizes?.length);
    }
  } catch (e) {
    console.error("Error fetching product:", e);
  } finally {
    await prisma.$disconnect();
  }
}

debug();
