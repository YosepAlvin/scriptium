import { prisma } from "@/lib/prisma";
import { deleteCategory, createCategory } from "@/lib/actions/category";
import { Plus, Trash2, Edit } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminCategories() {
  let categories: any[] = [];
  let loadError: string | null = null;
  let dbLabel = "";
  let dbProductCount: number | null = null;
  let dbCategoryCount: number | null = null;

  const rawConnectionString = process.env.DATABASE_URL;
  const connectionString = rawConnectionString
    ? rawConnectionString.trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1")
    : "";

  if (connectionString) {
    try {
      const url = new URL(connectionString);
      const host = url.hostname;
      const dbName = url.pathname.replace(/^\//, "");

      const mask = (value: string) => {
        if (!value) return "";
        if (value.length <= 8) return value;
        return `${value.slice(0, 4)}…${value.slice(-3)}`;
      };

      dbLabel = `${mask(host)}/${mask(dbName)}`;
    } catch {
      dbLabel = "";
    }
  }

  try {
    [dbProductCount, dbCategoryCount] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
    ]);
  } catch (e: any) {
    console.error("ADMIN_COUNTS_LOAD_ERROR", e);
  }

  try {
    categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e: any) {
    console.error("ADMIN_CATEGORIES_LOAD_ERROR", e);
    try {
      categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
      });
      loadError =
        "Gagal memuat kategori dengan urutan terbaru. Menampilkan urutan berdasarkan nama.";
    } catch (e2: any) {
      console.error("ADMIN_CATEGORIES_FALLBACK_LOAD_ERROR", e2);
      loadError =
        "Gagal memuat kategori. Di Vercel, ini biasanya karena DATABASE_URL mengarah ke database yang berbeda atau database belum terisi.";
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="font-playfair text-3xl font-bold mb-2">Kategori</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#666666]">
            Kelola klasifikasi produk Anda
          </p>
        </div>
        <Link 
          href="/admin/categories/new"
          className="flex items-center space-x-2 px-6 py-3 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors"
        >
          <Plus size={16} />
          <span>Tambah Kategori</span>
        </Link>
      </div>

      {loadError && (
        <div className="mb-6 bg-white border border-[#E5E5E5] px-6 py-4 text-xs text-[#666666]">
          {loadError}
        </div>
      )}

      <div className="mb-6 bg-white border border-[#E5E5E5] px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-[#666666] flex flex-wrap gap-x-6 gap-y-2">
        <span>Env: {process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "unknown"}</span>
        <span>DB: {dbLabel || "unknown"}</span>
        <span>Produk(DB): {dbProductCount ?? "?"}</span>
        <span>Kategori(DB): {dbCategoryCount ?? "?"}</span>
      </div>

      <div className="bg-white border border-[#E5E5E5] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FDFCFB] border-b border-[#E5E5E5]">
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold">Nama</th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold">Slug</th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold">Produk</th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-[#FDFCFB] transition-colors">
                <td className="px-8 py-6 text-sm font-medium">{category.name}</td>
                <td className="px-8 py-6 text-xs text-[#666666]">{category.slug}</td>
                <td className="px-8 py-6 text-xs text-[#666666]">
                  -
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end space-x-4">
                    <button className="text-[#666666] hover:text-[#1A1A1A] transition-colors">
                      <Edit size={16} />
                    </button>
                    <form action={async () => {
                      "use server";
                      await deleteCategory(category.id);
                    }}>
                      <button className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && !loadError && (
              <tr>
                <td colSpan={4} className="px-8 py-12 text-center text-[#999999] text-xs uppercase tracking-[0.2em]">
                  Tidak ada kategori ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
