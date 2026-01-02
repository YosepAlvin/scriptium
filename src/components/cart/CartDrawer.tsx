"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#FDFCFB] shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-border-custom flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-[#121212]" />
                <h2 className="font-playfair text-2xl font-bold text-[#121212]">Tas Belanja</h2>
                <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                  {totalItems} Item
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-[#121212]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-8 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag size={32} className="text-gray-300" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-playfair text-xl font-bold text-[#121212]">Tas Anda Kosong</p>
                    <p className="text-sm text-gray-500 max-w-[240px]">
                      Sepertinya Anda belum menambahkan produk apapun ke tas belanja.
                    </p>
                  </div>
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="px-8 py-4 bg-[#121212] text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-accent transition-colors"
                  >
                    Mulai Belanja
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="relative w-24 h-32 bg-[#F9F7F5] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-playfair text-lg font-bold text-[#121212] leading-tight group-hover:text-accent transition-colors">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                          {item.size && item.size !== "ALL" && (
                            <span className="text-[10px] uppercase tracking-widest text-gray-500">
                              Ukuran: <span className="text-[#121212] font-bold">{item.size}</span>
                            </span>
                          )}
                          {item.color && (
                            <span className="text-[10px] uppercase tracking-widest text-gray-500">
                              Warna: <span className="text-[#121212] font-bold">{item.color}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border-custom bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="font-sans font-bold text-[#121212]">
                          Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 bg-white border-t border-border-custom space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-gray-500 text-[10px] uppercase tracking-[0.2em]">
                    <span>Subtotal</span>
                    <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#121212]">
                    <span className="font-playfair text-xl font-bold">Total</span>
                    <span className="font-sans text-xl font-bold">Rp {totalPrice.toLocaleString("id-ID")}</span>
                  </div>
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest text-center">
                    Pajak dan biaya pengiriman dihitung saat checkout.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="w-full py-5 bg-[#121212] text-white flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-accent transition-all duration-300 group shadow-xl"
                  >
                    Checkout Sekarang
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button
                    onClick={onClose}
                    className="w-full py-4 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 hover:text-[#121212] transition-colors"
                  >
                    Lanjutkan Belanja
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
