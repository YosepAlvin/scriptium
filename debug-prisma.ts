import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import fs from "fs/promises";
import path from "path";
import initSqlJs from "sql.js";

const sqlitePath = path.join(process.cwd(), "prisma", "dev.db");

type SqliteRow = Record<string, any>;

function sanitizeConnectionString(raw?: string) {
  return raw ? raw.trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1") : "";
}

function normalizeImages(raw: unknown) {
  if (typeof raw !== "string") return JSON.stringify([]);
  const s = raw.trim();
  if (!s) return JSON.stringify([]);

  try {
    const parsed = JSON.parse(s);
    if (Array.isArray(parsed)) return JSON.stringify(parsed);
    if (typeof parsed === "string") return JSON.stringify([parsed]);
  } catch {
    return JSON.stringify([s]);
  }

  return JSON.stringify([s]);
}

async function openSqliteDb() {
  const file = await fs.readFile(sqlitePath);
  const SQL = await initSqlJs();
  return new SQL.Database(new Uint8Array(file));
}

function sqliteTables(db: any) {
  const result = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
  const rows = result?.[0]?.values ?? [];
  return new Set(rows.map((r: any[]) => String(r[0])));
}

function sqliteColumns(db: any, tableName: string) {
  const result = db.exec(`PRAGMA table_info(\"${tableName}\")`);
  const rows = result?.[0]?.values ?? [];
  return new Set(rows.map((r: any[]) => String(r[1])));
}

function sqliteSelectAll(db: any, tableName: string, columns: string[]) {
  const cols = columns.map((c) => `\"${c}\"`).join(", ");
  const result = db.exec(`SELECT ${cols} FROM \"${tableName}\"`);
  const out: SqliteRow[] = [];
  if (!result?.[0]) return out;
  const { columns: colNames, values } = result[0];
  for (const row of values) {
    const obj: SqliteRow = {};
    for (let i = 0; i < colNames.length; i++) obj[colNames[i]] = row[i];
    out.push(obj);
  }
  return out;
}

async function syncLocalSqliteProductsToPostgres() {
  const rawConnectionString = process.env.DATABASE_URL;
  const connectionString = sanitizeConnectionString(rawConnectionString);
  if (!connectionString) throw new Error("DATABASE_URL kosong. Pastikan .env berisi DATABASE_URL.");

  const pool = new Pool({ connectionString, max: 1 });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  const sqliteDb = await openSqliteDb();
  const tables = sqliteTables(sqliteDb);

  const categoryTable = tables.has("Category") ? "Category" : tables.has("category") ? "category" : "";
  const productTable = tables.has("Product") ? "Product" : tables.has("product") ? "product" : "";
  if (!categoryTable || !productTable) {
    throw new Error(`Tabel SQLite tidak ditemukan. Ada tabel: ${[...tables].join(", ")}`);
  }

  const categoryCols = sqliteColumns(sqliteDb, categoryTable);
  const productCols = sqliteColumns(sqliteDb, productTable);

  const categories = sqliteSelectAll(sqliteDb, categoryTable, ["id", "name", "slug"].filter((c) => categoryCols.has(c)));
  const products = sqliteSelectAll(
    sqliteDb,
    productTable,
    ["id", "name", "slug", "description", "price", "stock", "images", "categoryId"].filter((c) => productCols.has(c))
  );

  const existingCategorySlugs = new Set(
    (await prisma.category.findMany({ select: { slug: true } })).map((c) => c.slug)
  );
  const existingProductSlugs = new Set(
    (await prisma.product.findMany({ select: { slug: true } })).map((p) => p.slug)
  );

  let categoriesCreated = 0;
  let productsCreated = 0;
  let productsSkipped = 0;

  const oldCategoryIdToNewId = new Map<string, string>();

  for (const c of categories) {
    const slug = String(c.slug ?? "").trim();
    const name = String(c.name ?? slug);
    const oldId = String(c.id ?? "");
    if (!slug || !oldId) continue;

    if (!existingCategorySlugs.has(slug)) {
      const created = await prisma.category.create({
        data: { name, slug },
        select: { id: true, slug: true },
      });
      existingCategorySlugs.add(created.slug);
      oldCategoryIdToNewId.set(oldId, created.id);
      categoriesCreated++;
      continue;
    }

    const existing = await prisma.category.findUnique({ where: { slug }, select: { id: true } });
    if (existing) oldCategoryIdToNewId.set(oldId, existing.id);
  }

  let fallbackCategoryId: string | null = null;
  const getCategoryIdForProduct = async (oldCategoryId: string | null | undefined) => {
    if (oldCategoryId) {
      const mapped = oldCategoryIdToNewId.get(String(oldCategoryId));
      if (mapped) return mapped;
    }

    if (fallbackCategoryId) return fallbackCategoryId;

    const fallback = await prisma.category.upsert({
      where: { slug: "uncategorized" },
      update: {},
      create: { name: "Uncategorized", slug: "uncategorized" },
      select: { id: true },
    });
    fallbackCategoryId = fallback.id;
    return fallbackCategoryId;
  };

  for (const p of products) {
    const slug = String(p.slug ?? "").trim();
    if (!slug) continue;

    if (existingProductSlugs.has(slug)) {
      productsSkipped++;
      continue;
    }

    const name = String(p.name ?? slug);
    const description = p.description != null ? String(p.description) : null;
    const price = typeof p.price === "number" ? p.price : Number(p.price ?? 0);
    const stock = typeof p.stock === "number" ? p.stock : Number(p.stock ?? 0);
    const images = normalizeImages(p.images);
    const categoryId = await getCategoryIdForProduct(p.categoryId);

    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        type: "APPAREL_ATASAN",
        price: Number.isFinite(price) ? price : 0,
        stock: Number.isFinite(stock) ? stock : 0,
        images,
        colors: JSON.stringify([]),
        categoryId,
      },
      select: { id: true },
    });

    existingProductSlugs.add(slug);
    productsCreated++;
  }

  sqliteDb.close();
  await prisma.$disconnect();
  await pool.end();

  console.log(
    JSON.stringify(
      {
        sqlite: { categories: categories.length, products: products.length },
        postgres: { categoriesCreated, productsCreated, productsSkipped },
      },
      null,
      2
    )
  );
}

syncLocalSqliteProductsToPostgres().catch((e) => {
  console.error(e);
  process.exit(1);
});
