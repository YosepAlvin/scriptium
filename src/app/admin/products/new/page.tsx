import { prisma } from "@/lib/prisma";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import ProductForm from "@/app/admin/products/new/ProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <Link 
          href="/admin/products" 
          className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] text-[#666666] hover:text-[#1A1A1A] transition-colors mb-6"
        >
          <ChevronLeft size={14} />
          <span>Kembali ke Produk</span>
        </Link>
        <h1 className="font-playfair text-3xl font-bold mb-2">Produk Baru</h1>
        <p className="text-xs uppercase tracking-[0.2em] text-[#666666]">
          Tambahkan item baru ke koleksi Anda
        </p>
      </div>

      <div className="bg-white border border-[#E5E5E5] p-8">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
