import { prisma } from "@/lib/prisma";
import { deleteCategory, createCategory } from "@/lib/actions/category";
import { Plus, Trash2, Edit } from "lucide-react";
import Link from "next/link";

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

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
                  {/* We would need a count here */}
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
