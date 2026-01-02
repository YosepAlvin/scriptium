import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Semua Kategori
            </h1>
            <div className="w-12 h-[1px] bg-[#1A1A1A] mx-auto mb-8" />
            <p className="text-xs uppercase tracking-[0.4em] text-[#666666]">
              Temukan esensi gaya Anda melalui koleksi terkurasi kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link 
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group block relative h-[450px] overflow-hidden bg-[#F5F5F5]"
              >
                {(category as any).image ? (
                  <Image
                    src={(category as any).image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-playfair text-2xl italic text-[#999999] opacity-20">
                      {category.name}
                    </span>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                  <h2 className="font-playfair text-3xl font-bold mb-2 drop-shadow-lg">
                    {category.name}
                  </h2>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 border-b border-white pb-1">
                    Lihat Koleksi
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-24 text-[#999999] text-xs uppercase tracking-[0.2em]">
              Belum ada kategori yang tersedia.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
