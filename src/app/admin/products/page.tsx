import { prisma } from "@/lib/prisma";
import { deleteProduct } from "@/lib/actions/product";
import { Plus, Trash2, Edit, Package } from "lucide-react";
import Link from "next/link";
import FeaturedToggle from "./FeaturedToggle";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminProducts() {
  let products: any[] = [];
  let categories: any[] = [];
  let loadError: string | null = null;
  let variantsAvailable = true;
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
    products = await (prisma.product as any).findMany({
      include: { sizes: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (e: any) {
    variantsAvailable = false;
    console.error("ADMIN_PRODUCTS_LOAD_ERROR", e);
    loadError =
      "Gagal memuat produk lengkap (termasuk variasi ukuran/warna). Produk tetap akan ditampilkan tanpa variasi.";

    try {
      products = await (prisma.product as any).findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (e2: any) {
      console.error("ADMIN_PRODUCTS_FALLBACK_LOAD_ERROR", e2);
      loadError =
        "Gagal memuat produk. Di Vercel, ini biasanya karena DATABASE_URL mengarah ke database yang berbeda atau database belum terisi.";
    }
  }

  try {
    categories = await prisma.category.findMany();
  } catch (e: any) {
    console.error("ADMIN_PRODUCT_CATEGORIES_LOAD_ERROR", e);
  }

  const productsWithCategory = products.map((product: any) => ({
    ...product,
    category: categories.find((c: any) => c.id === product.categoryId) || { name: "Uncategorized" }
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="font-playfair text-3xl font-bold mb-2">Produk</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#666666]">
            Kelola inventaris Anda
          </p>
        </div>
        <Link 
          href="/admin/products/new"
          className="flex items-center space-x-2 px-6 py-3 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors"
        >
          <Plus size={16} />
          <span>Tambah Produk</span>
        </Link>
      </div>

      {loadError && (
        <div className="mb-6 bg-white border border-[#E5E5E5] px-6 py-4 text-xs text-[#666666]">
          {loadError}
        </div>
      )}



      <div className="bg-white border border-[#E5E5E5] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FDFCFB] border-b border-[#E5E5E5]">
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold">Produk</th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold">Kategori</th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold">Harga</th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold">Stok</th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold text-center">Unggulan</th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {productsWithCategory.map((product: any) => (
              <tr key={product.id} className="hover:bg-[#FDFCFB] transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-16 bg-[#F5F5F5] flex items-center justify-center border border-[#F0F0F0] relative overflow-hidden">
                      {(() => {
                        try {
                          const images = JSON.parse(product.images);
                          const mainImage = images[0];
                          if (mainImage) {
                            return (
                              <img 
                                src={mainImage} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                              />
                            );
                          }
                        } catch (e) {}
                        return <Package size={20} className="text-[#999999]" />;
                      })()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-[10px] text-[#999999] uppercase tracking-widest">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-xs text-[#666666] uppercase tracking-widest">
                  {product.category.name}
                </td>
                <td className="px-8 py-6 text-sm font-medium">
                  Rp {product.price.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-8 py-6 text-xs text-[#666666]">
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium text-[#1A1A1A]">{product.stock} total</span>
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 max-w-[200px]">
                        {product.sizes.map((s: any) => (
                          <span key={s.id} className="text-[8px] bg-[#F5F5F5] px-1.5 py-0.5 border border-[#F0F0F0]">
                            {s.color ? `${s.color} ` : ""}{s.name}: {s.stock}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  <FeaturedToggle productId={product.id} isFeatured={product.isFeatured} />
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end space-x-4">
                    <Link 
                      href={`/admin/products/${product.id}/edit`}
                      className="text-[#666666] hover:text-[#1A1A1A] transition-colors"
                    >
                      <Edit size={16} />
                    </Link>
                    <form action={async () => {
                      "use server";
                      await deleteProduct(product.id);
                    }}>
                      <button className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {productsWithCategory.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center text-[#999999] text-xs uppercase tracking-[0.2em]">
                  Tidak ada produk ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
