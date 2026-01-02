"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string;
    stock: number;
    type?: string;
  };
  selectedSize?: string;
  selectedColor?: string;
  disabled?: boolean;
}

export default function AddToCartButton({ 
  product, 
  selectedSize, 
  selectedColor,
  disabled 
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setShowSticky(offset > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (disabled || isAdding) return;
    
    setIsAdding(true);
    addToCart(product, selectedSize, selectedColor);
    
    // Feedback effect
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        disabled={disabled || isAdding}
        className={`w-full py-5 flex items-center justify-center space-x-3 text-[10px] uppercase tracking-[0.3em] font-bold transition-all relative overflow-hidden ${
          disabled
            ? "bg-[#F5F5F5] text-[#999999] cursor-not-allowed"
            : isAdding
            ? "bg-emerald-500 text-white"
            : "bg-[#121212] text-white hover:bg-black"
        }`}
      >
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <Check size={16} />
              <span>DITAMBAHKAN</span>
            </motion.div>
          ) : (
            <motion.div
              key="bag"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <ShoppingBag size={16} />
              <span>
                {disabled 
                  ? (product.stock <= 0 ? "STOK HABIS" : (product.type === "AKSESORIS" || product.type === "TUMBLER" || product.type === "ACCESSORIES" ? "PILIH WARNA" : "PILIH UKURAN & WARNA"))
                  : "TAMBAH KE TAS"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Sticky Mobile Button */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[60] bg-white p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] border-t border-border-custom md:hidden"
          >
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#121212] truncate">
                  {product.name}
                </p>
                <p className="text-sm font-semibold">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={disabled || isAdding}
                className={`px-8 py-4 flex items-center justify-center space-x-2 text-[10px] uppercase tracking-widest font-bold transition-all ${
                  disabled
                    ? "bg-[#F5F5F5] text-[#999999]"
                    : isAdding
                    ? "bg-emerald-500 text-white"
                    : "bg-[#121212] text-white"
                }`}
              >
                {isAdding ? <Check size={14} /> : <ShoppingBag size={14} />}
                <span>{isAdding ? "DITAMBAHKAN" : "BELI"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
