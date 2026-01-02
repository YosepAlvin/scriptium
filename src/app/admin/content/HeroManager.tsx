"use client";

import React, { useState } from "react";
import { Plus, Trash2, GripVertical, Check, X, Image as ImageIcon } from "lucide-react";
import { upsertHero, deleteHero, updateHeroOrder } from "@/lib/actions/content";
import Image from "next/image";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  ctaText: string | null;
  ctaLink: string | null;
  isActive: boolean;
  order: number;
}

interface HeroManagerProps {
  initialHeroes: HeroSlide[];
}

const HeroManager: React.FC<HeroManagerProps> = ({ initialHeroes }) => {
  const [heroes, setHeroes] = useState(initialHeroes);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<HeroSlide>>({
    title: "",
    subtitle: "",
    image: "",
    ctaText: "Jelajahi Koleksi",
    ctaLink: "/shop",
    isActive: true
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataObj = new FormData();
    if (editingId) formDataObj.append("id", editingId);
    formDataObj.append("title", formData.title || "");
    formDataObj.append("subtitle", formData.subtitle || "");
    formDataObj.append("ctaText", formData.ctaText || "");
    formDataObj.append("ctaLink", formData.ctaLink || "");
    formDataObj.append("isActive", String(formData.isActive));
    formDataObj.append("image", formData.image || "");
    
    const fileInput = document.getElementById("heroImageFile") as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formDataObj.append("imageFile", fileInput.files[0]);
    }

    await upsertHero(formDataObj);
    setEditingId(null);
    setIsAdding(false);
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus slide hero ini?")) {
      await deleteHero(id);
      window.location.reload();
    }
  };

  const handleEdit = (hero: HeroSlide) => {
    setFormData(hero);
    setEditingId(hero.id);
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-[#121212]">📸 Hero Manager</h3>
          <p className="text-sm text-gray-500">Kelola slider utama di halaman beranda</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => {
              setIsAdding(true);
              setFormData({
                title: "",
                subtitle: "",
                image: "",
                ctaText: "Jelajahi Koleksi",
                ctaLink: "/shop",
                isActive: true
              });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#121212] text-white rounded-lg hover:bg-black transition-colors"
          >
            <Plus size={18} />
            <span>Tambah Slide</span>
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Judul Hero</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#C2A76D] transition-all"
                  placeholder="Esensi Kesederhanaan"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle || ""}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#C2A76D] transition-all"
                  placeholder="Harmoni Tradisi dalam Gaya Hidup Modern"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Teks Tombol</label>
                  <input
                    type="text"
                    value={formData.ctaText || ""}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#C2A76D] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Link Tombol</label>
                  <input
                    type="text"
                    value={formData.ctaLink || ""}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#C2A76D] transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Gambar Hero</label>
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <input
                      type="file"
                      id="heroImageFile"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, image: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <label
                      htmlFor="heroImageFile"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#C2A76D] transition-all"
                    >
                      <ImageIcon size={18} className="text-gray-400" />
                      <span className="text-sm text-gray-500">Pilih File Gambar</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-grow bg-gray-100" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-300 font-bold">Atau URL</span>
                    <div className="h-px flex-grow bg-gray-100" />
                  </div>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#C2A76D] transition-all text-xs"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>
              {formData.image && (
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                  <Image src={formData.image} alt="Preview" fill className="object-cover" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-gray-300 text-[#C2A76D] focus:ring-[#C2A76D]"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Aktifkan Slide</label>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setIsAdding(false);
              }}
              className="px-6 py-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-[#121212] text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-black transition-colors"
            >
              Simpan Slide
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {heroes.map((hero) => (
          <div key={hero.id} className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
            <div className="relative aspect-[16/9]">
              <Image src={hero.image} alt={hero.title} fill className="object-cover" />
              {!hero.isActive && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-xs font-bold uppercase tracking-widest">Tidak Aktif</span>
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(hero)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white hover:text-[#C2A76D]"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => handleDelete(hero.id)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-[#121212] line-clamp-1">{hero.title}</h4>
                <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full font-bold">#{hero.order + 1}</span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{hero.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroManager;
