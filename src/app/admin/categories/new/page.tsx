"use client";

import { createCategory } from "@/lib/actions/category";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewCategoryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      await createCategory(formData);
      router.push("/admin/categories");
    } catch (error) {
      console.error(error);
      alert("Failed to create category");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <Link 
          href="/admin/categories" 
          className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] text-[#666666] hover:text-[#1A1A1A] transition-colors mb-6"
        >
          <ChevronLeft size={14} />
          <span>Kembali ke Kategori</span>
        </Link>
        <h1 className="font-playfair text-3xl font-bold mb-2">Kategori Baru</h1>
        <p className="text-xs uppercase tracking-[0.2em] text-[#666666]">
          Tentukan klasifikasi produk baru
        </p>
      </div>

      <form action={handleSubmit} className="bg-white border border-[#E5E5E5] p-8 space-y-6">
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] font-semibold mb-2">
            Nama Kategori
          </label>
          <input
            name="name"
            type="text"
            required
            className="w-full px-4 py-3 bg-[#F5F5F5] border-none focus:ring-1 focus:ring-[#1A1A1A] text-sm transition-all"
            placeholder="misal: Pakaian Luar"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="px-10 py-4 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors disabled:opacity-50"
        >
          {isLoading ? "Membuat..." : "Buat Kategori"}
        </button>
      </form>
    </div>
  );
}
