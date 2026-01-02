"use client";

import React from "react";
import { toggleCategoryFeatured } from "@/lib/actions/content";
import { Star, StarOff } from "lucide-react";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  isFeatured: boolean;
  image: string | null;
}

interface CategoryFeaturedManagerProps {
  initialCategories: Category[];
}

const CategoryFeaturedManager: React.FC<CategoryFeaturedManagerProps> = ({ initialCategories }) => {
  const [categories, setCategories] = React.useState(initialCategories);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    // Optimistic update
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, isFeatured: newStatus } : cat
    ));

    try {
      await toggleCategoryFeatured(id, newStatus);
    } catch (error) {
      // Revert on error
      setCategories(initialCategories);
      alert("Gagal memperbarui status kategori.");
    }
  };

  const featuredCount = categories.filter(c => c.isFeatured).length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-[#121212]">✨ Kategori Pilihan</h3>
          <p className="text-sm text-gray-500">Pilih hingga 3 kategori untuk ditampilkan secara eksklusif di beranda</p>
        </div>
        <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
          featuredCount === 3 ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
        }`}>
          {featuredCount} / 3 Terpilih
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div 
            key={category.id}
            className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-500 ${
              category.isFeatured 
                ? "border-[#C2A76D] shadow-lg ring-1 ring-[#C2A76D]" 
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="relative aspect-[4/3] w-full bg-gray-50">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                  No Image
                </div>
              )}
              
              <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
                category.isFeatured ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`} />
              
              <button
                onClick={() => handleToggle(category.id, category.isFeatured)}
                disabled={!category.isFeatured && featuredCount >= 3}
                className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 ${
                  category.isFeatured 
                    ? "bg-[#C2A76D] text-white scale-110 shadow-xl" 
                    : "bg-white/90 text-gray-400 hover:text-[#C2A76D] hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                }`}
              >
                {category.isFeatured ? <Star size={20} fill="currentColor" /> : <StarOff size={20} />}
              </button>
            </div>

            <div className="p-5">
              <h4 className={`font-bold transition-colors ${
                category.isFeatured ? "text-[#C2A76D]" : "text-[#121212]"
              }`}>
                {category.name}
              </h4>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
                {category.isFeatured ? "Tampil di Beranda" : "Tersembunyi"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFeaturedManager;
