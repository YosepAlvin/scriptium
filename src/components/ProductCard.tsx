"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { blurDataURL } from "@/lib/image-utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string; // JSON string
    soldCount?: number;
    reviews?: { rating: number }[];
    category: {
      name: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const isLimitedEdition = product.category?.name.toLowerCase() === "limited edition";
  const images = JSON.parse(product.images);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultipleImages = images.length > 1;

  // Calculate total stock
  const totalStock = (product as any).sizes?.reduce((acc: number, curr: any) => acc + curr.stock, 0) || 0;
  const isLowStock = totalStock > 0 && totalStock <= 10;
  const isOutOfStock = totalStock === 0 && (product as any).sizes?.length > 0;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Calculate average rating
  const reviewCount = product.reviews?.length || 0;
  const averageRating = reviewCount > 0 
    ? product.reviews!.reduce((acc, r) => acc + r.rating, 0) / reviewCount 
    : 0;

  return (
    <div className="group block relative">
      <Link href={`/products/${product.slug}`} className="block">
        <div className={`relative aspect-[3/4] overflow-hidden mb-5 bg-[#F9F7F5] transition-all duration-700 ${
          isLimitedEdition 
            ? "border-[2px] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.3)]" 
            : "border border-border-custom/50 group-hover:border-accent/30"
        }`}>
          {isLimitedEdition && (
            <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5">
              <div className="bg-[#D4AF37] text-white text-[7px] font-black tracking-[0.3em] px-2 py-1 shadow-lg border border-white/10">
                LIMITED
              </div>
              {isLowStock && (
                <div className="bg-red-600 text-white text-[6px] font-black tracking-[0.1em] px-1.5 py-0.5 shadow-md animate-pulse">
                  SISA TERAKHIR
                </div>
              )}
            </div>
          )}
          {!isLimitedEdition && isLowStock && (
            <div className="absolute top-3 left-3 z-30">
              <div className="bg-red-500 text-white text-[7px] font-black tracking-[0.2em] px-2 py-1 shadow-md">
                SISA {totalStock}
              </div>
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-20 flex items-center justify-center">
              <div className="bg-white/90 px-4 py-2 border border-black/10 shadow-xl">
                <span className="text-[10px] font-black tracking-[0.4em] text-black uppercase">HABIS</span>
              </div>
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={images[currentImageIndex] || "https://via.placeholder.com/600x800"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                placeholder="blur"
                blurDataURL={blurDataURL(300, 400)}
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Image Navigation Arrows */}
          {hasMultipleImages && (
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <button
                onClick={prevImage}
                className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-border-custom hover:bg-white hover:scale-110 transition-all duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} className="text-[#121212]" />
              </button>
              <button
                onClick={nextImage}
                className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-border-custom hover:bg-white hover:scale-110 transition-all duration-200"
                aria-label="Next image"
              >
                <ChevronRight size={16} className="text-[#121212]" />
              </button>
            </div>
          )}

          {/* Image Indicators (Dots) */}
          {hasMultipleImages && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {images.map((_: any, idx: number) => (
                <div 
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex ? "bg-accent w-4" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Quick View Button (Modern Touch) */}
          <div className="absolute inset-x-4 bottom-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
            <div className="w-full py-3 bg-white/95 backdrop-blur-sm text-[9px] uppercase tracking-[0.3em] font-bold text-center border border-border-custom shadow-lg hover:bg-accent hover:text-white transition-colors duration-300">
              Lihat Detail
            </div>
          </div>

          {/* Wishlist Placeholder (Aesthetic) */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
            <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center border border-border-custom hover:bg-white transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#121212]">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="space-y-2 px-1">
        <div className="flex justify-between items-center overflow-hidden h-4 relative">
          <span className="text-[9px] uppercase tracking-[0.3em] text-accent font-medium translate-y-0 transition-transform duration-500 group-hover:-translate-y-full">
            {product.category?.name || "Uncategorized"}
          </span>
          <div className="absolute flex items-center space-x-1.5 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={8} 
                  className={`${i < Math.round(averageRating) ? "fill-accent text-accent" : "text-border-custom"}`} 
                />
              ))}
            </div>
            <span className="text-[9px] font-bold text-foreground/60">{averageRating.toFixed(1)}</span>
          </div>
        </div>
        
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-playfair text-lg text-[#121212] group-hover:text-accent transition-colors duration-300 leading-tight">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex justify-between items-baseline pt-1 overflow-hidden h-6 relative">
          <p className="font-sans text-sm font-semibold tracking-wide text-[#121212] group-hover:translate-x-1 transition-transform duration-500">
            Rp {product.price.toLocaleString('id-ID')}
          </p>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            {reviewCount > 0 && (
              <p className="text-[9px] text-accent/60 italic tracking-wider">({reviewCount} ulasan)</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

