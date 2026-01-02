import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;

  let orderBy: any = { createdAt: "desc" };
  if (sort === "best-selling") {
    orderBy = { soldCount: "desc" };
  } else if (sort === "most-reviewed") {
    orderBy = { reviews: { _count: "desc" } };
  } else if (sort === "price-asc") {
    orderBy = { price: "asc" };
  } else if (sort === "price-desc") {
    orderBy = { price: "desc" };
  }

  let products: any[] = [];
  let categories: any[] = [];
  let loadError: string | null = null;

  try {
    products = await (prisma.product as any).findMany({
      orderBy,
      include: {
        category: true,
        reviews: {
          select: { rating: true },
        },
      },
    });
  } catch (e: any) {
    console.error("SHOP_PRODUCTS_LOAD_ERROR", e);
    loadError = "Gagal memuat produk dari database.";
  }

  try {
    categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (e: any) {
    console.error("SHOP_CATEGORIES_LOAD_ERROR", e);
  }

  const productsWithCategory = products;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Semua Koleksi
            </h1>
            <div className="w-12 h-[1px] bg-[#1A1A1A] mx-auto mb-8" />
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <Link 
                href="/shop"
                className={`text-[10px] uppercase tracking-[0.2em] font-bold pb-1 border-b ${
                  !sort || sort === 'newest' ? 'border-[#1A1A1A]' : 'border-transparent text-[#999999] hover:text-[#1A1A1A]'
                }`}
              >
                Semua
              </Link>
              {categories.map((cat) => (
                <Link 
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="text-[10px] uppercase tracking-[0.2em] text-[#999999] hover:text-[#1A1A1A] transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Sorting */}
            <div className="flex flex-wrap justify-center gap-4 py-4 border-y border-[#F0F0F0]">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#999999] py-1">Urutkan:</span>
              {[
                { label: "Terbaru", value: "newest" },
                { label: "Paling Laris", value: "best-selling" },
                { label: "Review Terbanyak", value: "most-reviewed" },
                { label: "Harga Terendah", value: "price-asc" },
                { label: "Harga Tertinggi", value: "price-desc" },
              ].map((option) => (
                <Link
                  key={option.value}
                  href={`/shop?sort=${option.value}`}
                  className={`text-[10px] uppercase tracking-[0.2em] px-3 py-1 transition-all ${
                    (sort === option.value) || (!sort && option.value === 'newest')
                      ? "text-[#1A1A1A] font-bold"
                      : "text-[#999999] hover:text-[#1A1A1A]"
                  }`}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {productsWithCategory.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {loadError && (
            <div className="text-center py-10 text-[#999999] text-xs uppercase tracking-[0.2em]">
              {loadError}
            </div>
          )}

          {productsWithCategory.length === 0 && (
            <div className="text-center py-24 text-[#999999] text-xs uppercase tracking-[0.2em]">
              Tidak ada produk ditemukan dalam koleksi ini.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
