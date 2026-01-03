"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";
import { Star, MessageSquare, X } from "lucide-react";
import { blurDataURL } from "@/lib/image-utils";
import { motion, AnimatePresence } from "framer-motion";
import ProductReviews from "@/components/ProductReviews";

interface ProductViewProps {
  product: any;
  categoryName: string;
  canReview?: boolean;
}

export default function ProductView({ product, categoryName, canReview = false }: ProductViewProps) {
  const images = JSON.parse(product.images);
  const [activeImage, setActiveImage] = useState(images[0] || "https://via.placeholder.com/600x800");
  
  const sizes = product.sizes || [];
  const colors = product.colors ? JSON.parse(product.colors) : [];
  const isNoSize = product.type === "AKSESORIS" || 
    categoryName.toLowerCase() === "accessories" || 
    categoryName.toLowerCase() === "aksesoris" ||
    (sizes.length > 0 && sizes.every((s: any) => s.name === "ALL"));
  const isApparelAtasan = product.type === "APPAREL_ATASAN";
  const isApparelPants = product.type === "APPAREL_PANTS";
  const isLimitedEdition = categoryName.toLowerCase() === "limited edition";
  const totalStock = sizes.reduce((acc: number, curr: any) => acc + curr.stock, 0);
  
  // Calculate specific stock for low stock indicator
  const isLowStock = isLimitedEdition && totalStock > 0 && totalStock <= 10;
  const isOutOfStock = totalStock === 0;
  
  const [selectedSize, setSelectedSize] = useState<string | undefined>(isNoSize ? "ALL" : undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length 
    : 0;

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (!isNoSize) {
      setSelectedSize(undefined); // Reset size when color changes
    }
  };

  const availableSizes = sizes.filter((s: any) => 
    !selectedColor || s.color === selectedColor || s.color === null
  );

  const selectedSizeData = sizes.find((s: any) => 
    s.name === selectedSize && (!selectedColor || s.color === selectedColor || s.color === null)
  );

  const currentStock = (isNoSize && sizes.length === 0)
    ? product.stock
    : (selectedSize 
        ? (selectedSizeData?.stock || 0) 
        : (selectedColor 
            ? sizes.filter((s: any) => s.color === selectedColor).reduce((acc: number, curr: any) => acc + curr.stock, 0)
            : product.stock));

  const isAddToCartDisabled = (sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor) || currentStock === 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
      {/* Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-white z-[101] p-8 md:p-12 rounded-[24px] shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setIsSizeGuideOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="mb-8">
                <span className="text-[10px] uppercase tracking-[0.4em] text-accent mb-2 block font-bold">Panduan Belanja</span>
                <h3 className="font-playfair text-3xl font-bold">Size Guide</h3>
              </div>

              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] uppercase tracking-widest text-left">
                    <thead>
                      <tr className="border-b border-border-custom">
                        <th className="py-4 font-bold">Size</th>
                        {isApparelPants ? (
                          <>
                            <th className="py-4 font-bold">Waist (cm)</th>
                            <th className="py-4 font-bold">Length (cm)</th>
                          </>
                        ) : (
                          <>
                            <th className="py-4 font-bold">Chest (cm)</th>
                            <th className="py-4 font-bold">Length (cm)</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="text-foreground/70">
                      {isApparelPants ? (
                        <>
                          {[28, 30, 32, 34, 36].map(size => (
                            <tr key={size} className="border-b border-border-custom/50">
                              <td className="py-4">{size}</td>
                              <td className="py-4">{Math.round(size * 2.54)} - {Math.round(size * 2.54) + 5}</td>
                              <td className="py-4">100 - 105</td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <>
                          {[
                            { name: "S", chest: "96 - 100", length: "70" },
                            { name: "M", chest: "100 - 104", length: "72" },
                            { name: "L", chest: "104 - 108", length: "74" },
                            { name: "XL", chest: "108 - 112", length: "76" },
                          ].map(size => (
                            <tr key={size.name} className="border-b border-border-custom/50">
                              <td className="py-4">{size.name}</td>
                              <td className="py-4">{size.chest}</td>
                              <td className="py-4">{size.length}</td>
                            </tr>
                          ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-foreground/50 italic leading-relaxed">
                  * Ukuran dapat bervariasi 1-2 cm tergantung pada model dan bahan. <br />
                  * Gunakan ukuran yang biasa Anda gunakan untuk fit yang ideal.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Image Gallery - Modern Sticky Layout */}
      <div className="lg:col-span-7">
        <div className="flex flex-col md:flex-row-reverse gap-4 lg:sticky lg:top-32">
          {/* Main Image - Full Cover Effect */}
          <div className="flex-grow">
            <div className={`relative aspect-[4/5] bg-[#F9F7F5] overflow-hidden shadow-xs group transition-all duration-700 ${
              isLimitedEdition 
                ? (isLowStock 
                    ? "border-[3px] border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.25)]" 
                    : "border-[3px] border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.2)]")
                : "border border-border-custom"
            }`}>
              {isLimitedEdition && (
                <div className="absolute top-8 left-8 z-30 flex flex-col gap-3">
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="bg-[#D4AF37] text-white text-[10px] font-black tracking-[0.4em] px-5 py-2.5 shadow-2xl border border-white/20 flex items-center space-x-2"
                  >
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    <span>SPECIAL LIMITED EDITION</span>
                  </motion.div>
                  {isLowStock && (
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="bg-red-600 text-white text-[9px] font-black tracking-[0.2em] px-4 py-2 shadow-xl animate-bounce"
                    >
                      STOK KRITIS: HANYA {totalStock} UNIT
                    </motion.div>
                  )}
                </div>
              )}
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105"
                priority
                placeholder="blur"
                blurDataURL={blurDataURL(600, 800)}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent pointer-events-none" />
              
              {/* Zoom Indicator (Visual Only) */}
              <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-border-custom">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Thumbnails - Vertical on Desktop, Horizontal on Mobile */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-visible pb-2 md:pb-0 scrollbar-hide md:w-20 lg:w-24">
              {images.map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-square md:aspect-[3/4] bg-[#F9F7F5] overflow-hidden border transition-all duration-300 flex-shrink-0 w-16 md:w-full ${
                    activeImage === img ? "border-accent ring-1 ring-accent/30" : "border-border-custom opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Info - Modern Minimalist */}
      <div className="lg:col-span-5 flex flex-col">
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-[9px] uppercase tracking-[0.4em] text-accent font-bold px-2 py-1 bg-secondary border border-border-custom">
              {categoryName}
            </span>
            {product.soldCount > 0 && (
              <span className="text-[9px] uppercase tracking-[0.3em] text-wood font-medium">
                Terjual {product.soldCount > 100 ? "100+" : product.soldCount} unit
              </span>
            )}
          </div>
          
          <h1 className="font-playfair text-4xl lg:text-5xl font-bold mb-6 tracking-tight text-foreground leading-[1.1]">
            {product.name}
          </h1>
          
          <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-border-custom/50">
            <p className="text-3xl font-sans font-medium">
              Rp {product.price.toLocaleString('id-ID')}
            </p>
            {reviews.length > 0 && (
              <div className="flex items-center space-x-2 bg-secondary/50 px-3 py-1.5 rounded-full">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={10} 
                      className={`${star <= Math.round(averageRating) ? "fill-accent text-accent" : "text-border-custom"}`} 
                    />
                  ))}
                </div>
                <span className="text-[11px] font-bold text-foreground">{averageRating.toFixed(1)}</span>
                <span className="text-[11px] text-accent/60 italic">({reviews.length} ulasan)</span>
              </div>
            )}
          </div>

          {/* Color Selection - More Interactive */}
          {colors.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/60">
                  Warna
                </label>
                <div className="flex items-center space-x-2">
                  {selectedColor && (
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                      {selectedColor}
                      {isNoSize && (
                        <span className="ml-2 text-foreground/40 font-medium">
                          ({sizes.length > 0 
                            ? (sizes.find((s: any) => s.color === selectedColor)?.stock || 0) 
                            : product.stock} Stok)
                        </span>
                      )}
                    </span>
                  )}
                  {!selectedColor && <span className="text-[10px] font-medium text-accent uppercase tracking-widest">Pilih satu</span>}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {colors.map((color: string) => {
                  const colorStock = isNoSize 
                    ? (sizes.length > 0 
                        ? (sizes.find((s: any) => s.color === color)?.stock || 0) 
                        : product.stock) 
                    : null;
                  return (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      disabled={isNoSize && colorStock === 0}
                      className={`px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold border transition-all duration-300 relative ${
                        selectedColor === color 
                          ? "border-accent bg-wood text-white shadow-md" 
                          : isNoSize && colorStock === 0
                            ? "border-secondary text-border-custom cursor-not-allowed bg-secondary/30"
                            : "border-border-custom text-foreground/60 hover:border-accent hover:text-accent bg-white"
                      }`}
                    >
                      {color}
                      {colorStock !== null && colorStock > 0 && (
                        <span className={`absolute -top-2 -right-2 text-white text-[7px] px-1.5 py-0.5 rounded-full font-black whitespace-nowrap ${
                          colorStock <= 10 ? "bg-red-500 animate-pulse" : "bg-accent"
                        }`}>
                          {isLimitedEdition && colorStock <= 10 ? "SISA TERAKHIR" : `SISA ${colorStock}`}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection - Grid Layout */}
          {!isNoSize && sizes.length > 0 && (
            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/60">
                  Ukuran
                </label>
                <button 
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[9px] uppercase tracking-[0.2em] font-bold text-accent border-b border-accent/30 pb-0.5 hover:text-[#121212] transition-colors"
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2">
                {availableSizes.map((size: any) => (
                  <button
                    key={`${size.color}-${size.name}`}
                    onClick={() => setSelectedSize(size.name)}
                    disabled={size.stock === 0}
                    className={`h-12 flex flex-col items-center justify-center border transition-all duration-300 relative ${
                      selectedSize === size.name 
                        ? "border-accent bg-wood text-white shadow-md" 
                        : size.stock === 0
                          ? "border-secondary text-border-custom cursor-not-allowed bg-secondary/30"
                          : "border-border-custom text-foreground/60 hover:border-accent hover:text-accent bg-white"
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-widest font-bold">{size.name}</span>
                    {size.stock > 0 && (
                      <span className={`text-[7px] font-bold mt-0.5 whitespace-nowrap ${
                        size.stock <= 10 ? "text-red-500 animate-pulse" : "text-accent/60"
                      }`}>
                        {isLimitedEdition && size.stock <= 10 ? "SISA TERAKHIR" : `SISA ${size.stock}`}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart - Primary Action */}
          <div className="space-y-4 mb-12">
            {isOutOfStock && isLimitedEdition ? (
              <div className="p-4 bg-red-50 border border-red-200 text-center">
                <p className="text-[10px] text-red-600 font-black uppercase tracking-[0.2em]">
                  Produk Limited Edition telah habis dan tidak akan diproduksi ulang.
                </p>
              </div>
            ) : (
              <AddToCartButton 
                product={product} 
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                disabled={isAddToCartDisabled}
              />
            )}
            
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border-custom/50">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 mx-auto rounded-full bg-secondary flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <p className="text-[8px] uppercase tracking-[0.2em] font-bold text-accent">Free Shipping</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-8 h-8 mx-auto rounded-full bg-secondary flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <p className="text-[8px] uppercase tracking-[0.2em] font-bold text-accent">Safe Payment</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-8 h-8 mx-auto rounded-full bg-secondary flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <p className="text-[8px] uppercase tracking-[0.2em] font-bold text-accent">Original Quality</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Content Section */}
        <div className="mt-auto animate-fade-in delay-200">
          <div className="flex space-x-10 border-b border-border-custom/50 mb-8">
            <button 
              onClick={() => setActiveTab("description")}
              className={`pb-4 text-[10px] uppercase tracking-[0.4em] font-bold transition-all relative ${
                activeTab === "description" ? "text-foreground" : "text-accent/40 hover:text-accent"
              }`}
            >
              Deskripsi
              {activeTab === "description" && <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent" />}
            </button>
            <button 
              onClick={() => setActiveTab("reviews")}
              className={`pb-4 text-[10px] uppercase tracking-[0.4em] font-bold transition-all relative ${
                activeTab === "reviews" ? "text-foreground" : "text-accent/40 hover:text-accent"
              }`}
            >
              Review ({reviews.length})
              {activeTab === "reviews" && <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent" />}
            </button>
          </div>

          {activeTab === "description" ? (
            <div className="prose prose-sm max-w-none text-[#666666]">
              <p className="whitespace-pre-line leading-relaxed">
                {product.description}
              </p>
            </div>
          ) : (
            <ProductReviews 
              productId={product.id} 
              reviews={reviews} 
              canReview={canReview} 
            />
          )}
        </div>

        {/* Shipping & Returns info */}
        <div className="mt-16 space-y-4 border-t border-[#E5E5E5] pt-10">
          <details className="group cursor-pointer">
            <summary className="list-none flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-bold">
              <span>Pengiriman & Pengembalian</span>
              <span className="group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <p className="mt-4 text-xs text-[#666666] leading-relaxed">
              Pengiriman standar gratis untuk semua pesanan di atas Rp 2.000.000. Pengembalian diterima dalam waktu 14 hari setelah pengiriman.
            </p>
          </details>
          <div className="h-[1px] bg-[#F0F0F0]" />
          <details className="group cursor-pointer">
            <summary className="list-none flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-bold">
              <span>Bahan & Perawatan</span>
              <span className="group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <p className="mt-4 text-xs text-[#666666] leading-relaxed">
              Dirancang untuk daya tahan lama. Cuci dengan tangan atau siklus halus. Lihat label pakaian internal untuk instruksi perawatan mendalam.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
