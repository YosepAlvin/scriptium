"use client";

import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ChevronRight } from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="font-playfair text-4xl font-bold mb-2">Tas Belanja</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-[#666666]">
              {items.length} {items.length === 1 ? 'Produk' : 'Produk'} di tas Anda
            </p>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-[#E5E5E5]">
              <p className="text-xs uppercase tracking-[0.2em] text-[#999999] mb-8">Tas Anda kosong</p>
              <Link 
                href="/shop"
                className="inline-block px-10 py-4 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.2em] hover:bg-[#333333] transition-colors"
              >
                Lanjutkan Belanja
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-8">
                {items.map((item) => (
                  <div key={item.id} className="flex space-x-6 py-8 border-b border-[#F0F0F0] first:pt-0">
                    <div className="relative w-24 h-32 bg-[#F5F5F5] flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-sm font-medium uppercase tracking-tight mb-1">{item.name}</h3>
                          <div className="flex flex-col space-y-1 mb-2">
                            {item.size && (
                              <p className="text-[10px] uppercase tracking-widest text-[#999999]">
                                Ukuran: <span className="text-[#1A1A1A] font-bold">{item.size}</span>
                              </p>
                            )}
                            {item.color && (
                              <p className="text-[10px] uppercase tracking-widest text-[#999999]">
                                Warna: <span className="text-[#1A1A1A] font-bold">{item.color}</span>
                              </p>
                            )}
                          </div>
                          <p className="text-sm font-semibold">Rp {item.price.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#999999] hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-[#E5E5E5]">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-[#F5F5F5] transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-10 text-center text-xs">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-[#F5F5F5] transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="bg-[#FDFCFB] border border-[#E5E5E5] p-8 sticky top-32">
                  <h2 className="font-playfair text-xl font-bold mb-8">Ringkasan</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-xs uppercase tracking-widest text-[#666666]">
                      <span>Subtotal</span>
                      <span>Rp {totalPrice.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-xs uppercase tracking-widest text-[#666666]">
                      <span>Pengiriman</span>
                      <span>Dihitung saat checkout</span>
                    </div>
                    <div className="w-full h-[1px] bg-[#E5E5E5] my-4" />
                    <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                      <span>Total</span>
                      <span>Rp {totalPrice.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <Link 
                    href="/checkout"
                    className="w-full py-5 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.3em] font-bold flex items-center justify-center space-x-2 hover:bg-[#333333] transition-colors"
                  >
                    <span>Lanjutkan ke Checkout</span>
                    <ChevronRight size={14} />
                  </Link>
                  
                  <p className="mt-6 text-[10px] text-[#999999] text-center uppercase tracking-widest">
                    Secure checkout powered by Scriptum
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
