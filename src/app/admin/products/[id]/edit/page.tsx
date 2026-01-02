import { prisma } from "@/lib/prisma";
import ProductForm from "../../new/ProductForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EditProductPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    (prisma.product as any).findUnique({
      where: { id },
      include: { sizes: true },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <Link 
          href="/admin/products"
          className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] text-[#666666] hover:text-[#1A1A1A] transition-colors mb-6"
        >
          <ChevronLeft size={14} />
          <span>Kembali ke Produk</span>
        </Link>
        <h1 className="font-playfair text-3xl font-bold mb-2">Edit Produk</h1>
        <p className="text-xs uppercase tracking-[0.2em] text-[#666666]">
          Perbarui detail produk dan inventaris
        </p>
      </div>

      <div className="bg-white border border-[#E5E5E5] p-8">
        <ProductForm categories={categories} product={product as any} />
      </div>
    </div>
  );
}
