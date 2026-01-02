"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { blurDataURL } from "@/lib/image-utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description?: string | null;
}

interface CategoryCardsProps {
  categories: Category[];
}

const CategoryCards: React.FC<CategoryCardsProps> = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-32 bg-[#F9F7F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24 relative"
        >
          <span className="text-[10px] uppercase tracking-[0.6em] text-accent mb-4 block">Eksplorasi</span>
          <h2 className="font-playfair text-5xl font-bold mb-8 text-[#121212]">Kategori Pilihan</h2>
          <p className="font-playfair italic text-[#666666] text-xl max-w-lg mx-auto leading-relaxed">
            "Menghargai setiap detail, merayakan setiap proses."
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[400px]">
          {categories.map((category, index) => {
            // Layout logic: first card spans 8 cols, others span 4
            const colSpan = index === 0 ? "md:col-span-8" : "md:col-span-4";
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`${colSpan} relative group overflow-hidden rounded-[24px]`}
              >
                <Link href={`/categories/${category.slug}`} className="block h-full w-full">
                  <Image
                    src={category.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                    placeholder="blur"
                    blurDataURL={blurDataURL(800, 600)}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-700" />
                  
                  {/* Content Container */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                    <div className="glass-effect p-8 rounded-[16px] transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
                      <span className="text-[9px] uppercase tracking-[0.4em] text-accent mb-2 block font-bold">Koleksi Terbatas</span>
                      <h3 className="font-playfair text-3xl text-white mb-3 group-hover:text-accent transition-colors duration-500">{category.name}</h3>
                      <p className="text-white/80 text-xs leading-relaxed max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                        {category.description || `Koleksi pilihan untuk gaya hidup modern Anda.`}
                      </p>
                      
                      <div className="mt-6 flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-white font-bold group-hover:gap-4 transition-all duration-500">
                        <span>Lihat Koleksi</span>
                        <div className="w-8 h-px bg-white group-hover:w-12 transition-all duration-500" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
