import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductView from "./ProductView";
import ProductCard from "@/components/ProductCard";
import SectionReveal from "@/components/ui/SectionReveal";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await (prisma.product as any).findUnique({
    where: { slug },
    select: { name: true, description: true, images: true }
  });

  if (!product) return { title: "Product Not Found" };

  const images = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
  const ogImage = images?.[0] || "/og-image.jpg";

  return {
    title: product.name,
    description: product.description?.substring(0, 160) || `Beli ${product.name} di Scriptum.`,
    openGraph: {
      title: `${product.name} | Scriptum`,
      description: product.description?.substring(0, 160),
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Scriptum`,
      images: [ogImage],
    }
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await (prisma.product as any).findUnique({
    where: { slug },
    include: { 
      sizes: true,
      category: true,
      reviews: {
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!product) {
    notFound();
  }

  // Fetch related products from same category
  const relatedProducts = await (prisma.product as any).findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
    },
    include: {
      category: true,
      reviews: true,
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductView 
            product={product} 
            categoryName={product.category?.name || "Uncategorized"} 
          />

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <SectionReveal className="mt-32 pt-32 border-t border-border-custom">
              <div className="flex justify-between items-end mb-16">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.6em] text-accent mb-4 block">Rekomendasi</span>
                  <h2 className="font-playfair text-4xl font-bold text-[#121212]">Anda Mungkin Juga Suka</h2>
                </div>
                <Link 
                  href={`/categories/${product.category?.slug}`}
                  className="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-accent pb-1 hover:text-accent transition-colors"
                >
                  Lihat Semua
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((relatedProduct: any) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </SectionReveal>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
