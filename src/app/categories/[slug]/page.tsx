import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) return { title: "Category Not Found" };

  return {
    title: category.name,
    description: (category as any).description || `Lihat koleksi ${category.name} premium di Scriptum.`,
    openGraph: {
      title: `${category.name} | Scriptum`,
      description: (category as any).description,
    }
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  const products = await (prisma.product as any).findMany({
    where: { categoryId: category.id },
    include: {
      reviews: true
    },
    orderBy: { createdAt: "desc" },
  });

  const productsWithCategory = products.map((product: any) => ({
    ...product,
    category: { name: category.name },
  }));

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {category.name}
            </h1>
            <div className="w-12 h-[1px] bg-[#1A1A1A] mx-auto mb-6" />
            {(category as any).description && (
              <p className="text-[#666666] text-sm max-w-2xl mx-auto mb-10 leading-relaxed italic">
                {(category as any).description}
              </p>
            )}
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                href="/shop"
                className="text-[10px] uppercase tracking-[0.2em] text-[#999999] hover:text-[#1A1A1A] transition-colors"
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link 
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className={`text-[10px] uppercase tracking-[0.2em] ${
                    cat.slug === slug 
                      ? "font-bold border-b border-[#1A1A1A] pb-1" 
                      : "text-[#999999] hover:text-[#1A1A1A] transition-colors"
                  }`}
                >
                  {cat.name}
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

          {productsWithCategory.length === 0 && (
            <div className="text-center py-24 text-[#999999] text-xs uppercase tracking-[0.2em]">
              No products found in this category.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
