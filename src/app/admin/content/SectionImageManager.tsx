"use client";

import React, { useState } from "react";
import Image from "next/image";
import { updateSectionImage } from "@/lib/actions/content";

interface SectionImage {
  id: string;
  section: string;
  image: string;
}

interface SectionImageManagerProps {
  initialImages: SectionImage[];
}

const sections = [
  { id: "featured", name: "Produk Unggulan", description: "Gambar latar belakang untuk bagian produk unggulan" },
  { id: "brand-story", name: "Kisah Brand", description: "Gambar latar belakang untuk bagian filosofi brand" },
  { id: "category-header", name: "Header Kategori", description: "Gambar header untuk halaman semua kategori" },
];

const SectionImageManager: React.FC<SectionImageManagerProps> = ({ initialImages }) => {
  const [images, setImages] = useState(initialImages);
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpdate = async (section: string, url: string) => {
    if (!url) return;
    setLoading(section);
    try {
      await updateSectionImage(section, url);
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-[#121212]">🖼️ Section Image Manager</h3>
        <p className="text-sm text-gray-500">Kelola gambar latar belakang untuk berbagai bagian situs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sections.map((section) => {
          const currentImage = images.find(img => img.section === section.id)?.image || "";
          
          return (
            <div key={section.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div>
                <h4 className="font-bold text-[#121212]">{section.name}</h4>
                <p className="text-xs text-gray-500">{section.description}</p>
              </div>

              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-50 border border-dashed border-gray-200">
                {currentImage ? (
                  <Image src={currentImage} alt={section.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <span className="text-xs">Belum ada gambar</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">URL Gambar</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={currentImage}
                    onBlur={(e) => {
                      if (e.target.value !== currentImage) {
                        handleUpdate(section.id, e.target.value);
                      }
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-grow px-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#C2A76D] transition-all"
                  />
                  {loading === section.id && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#121212]"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionImageManager;
