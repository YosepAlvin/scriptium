"use client";

import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/actions/order";
import { getAddresses } from "@/lib/actions/address";
import { ChevronLeft, Lock, MapPin, Check, QrCode, CreditCard, Banknote, Smartphone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const PAYMENT_METHODS = [
  {
    id: "BANK_TRANSFER",
    name: "Transfer Bank (Manual)",
    description: "BCA / Mandiri / BNI. Konfirmasi manual via WhatsApp.",
    icon: Banknote,
  },
  {
    id: "QRIS",
    name: "QRIS",
    description: "Scan barcode via GoPay, OVO, Dana, LinkAja.",
    icon: QrCode,
  },
  {
    id: "VA_BCA",
    name: "Virtual Account BCA",
    description: "Pembayaran otomatis via BCA Mobile/KlikBCA.",
    icon: CreditCard,
  },
  {
    id: "VA_MANDIRI",
    name: "Virtual Account Mandiri",
    description: "Pembayaran otomatis via Livin' by Mandiri.",
    icon: CreditCard,
  },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("BANK_TRANSFER");
  const router = useRouter();

  useEffect(() => {
    async function loadAddresses() {
      try {
        const addresses = await getAddresses();
        setSavedAddresses(addresses);
        
        // Auto-select default address
        const defaultAddress = addresses.find((a: any) => a.isDefault);
        if (defaultAddress) {
          handleSelectAddress(defaultAddress);
        }
      } catch (error) {
        console.error("Failed to load addresses:", error);
      }
    }
    loadAddresses();
  }, []);

  const handleSelectAddress = (addr: any) => {
    setSelectedAddressId(addr.id);
    const fullAddress = `${addr.recipient} | ${addr.phone}\n${addr.street}, ${addr.city}, ${addr.province}, ${addr.postalCode}`;
    setAddress(fullAddress);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsLoading(true);
    try {
      await createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
        })),
        total: totalPrice,
        address,
        paymentMethod,
      });
      clearCart();
      router.push("/checkout/success");
    } catch (error) {
      console.error(error);
      alert("Gagal membuat pesanan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-20">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[#999999] mb-8">Tas Anda kosong</p>
            <Link 
              href="/shop"
              className="inline-block px-10 py-4 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.2em]"
            >
              Kembali ke Toko
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Checkout Form */}
            <div>
              <Link 
                href="/cart"
                className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] text-[#666666] hover:text-[#1A1A1A] transition-colors mb-10"
              >
                <ChevronLeft size={14} />
                <span>Kembali ke Tas</span>
              </Link>
              
              <h1 className="font-playfair text-3xl font-bold mb-10">Checkout</h1>
              
              <form onSubmit={handleSubmit} className="space-y-12">
                <section>
                  <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-6 flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[8px]">1</span>
                    <span>Alamat Pengiriman</span>
                  </h2>
                  
                  {savedAddresses.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      {savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => handleSelectAddress(addr)}
                          className={`text-left p-4 border transition-all duration-300 relative group ${
                            selectedAddressId === addr.id 
                              ? "border-[#1A1A1A] bg-[#FDFCFB]" 
                              : "border-[#E5E5E5] hover:border-[#1A1A1A]"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <MapPin size={12} className={selectedAddressId === addr.id ? "text-[#1A1A1A]" : "text-[#999999]"} />
                              <span className="text-[10px] uppercase tracking-widest font-bold">{addr.name}</span>
                            </div>
                            {selectedAddressId === addr.id && (
                              <Check size={12} className="text-[#1A1A1A]" />
                            )}
                          </div>
                          <p className="text-[11px] font-bold mb-1">{addr.recipient}</p>
                          <p className="text-[10px] text-[#666666] leading-relaxed line-clamp-2">
                            {addr.street}, {addr.city}, {addr.province} {addr.postalCode}
                          </p>
                          <p className="text-[10px] text-[#666666] mt-1">{addr.phone}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="text-[9px] uppercase tracking-widest text-[#999999] block mb-2">
                      {savedAddresses.length > 0 ? "Atau masukkan alamat manual:" : "Masukkan alamat pengiriman:"}
                    </label>
                    <textarea
                      required
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setSelectedAddressId(null);
                      }}
                      placeholder="Alamat Lengkap (Jalan, Kota, Provinsi, Kode Pos)"
                      rows={4}
                      className="w-full px-4 py-3 bg-[#F5F5F5] border-none focus:ring-1 focus:ring-[#1A1A1A] text-sm transition-all resize-none"
                    />
                  </div>
                </section>

                <section>
                  <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-6 flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[8px]">2</span>
                    <span>Metode Pembayaran</span>
                  </h2>
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`w-full text-left p-4 border transition-all duration-300 relative group flex items-center gap-4 ${
                          paymentMethod === method.id 
                            ? "border-[#1A1A1A] bg-[#FDFCFB]" 
                            : "border-[#E5E5E5] hover:border-[#1A1A1A]"
                        }`}
                      >
                        <div className={`p-2 rounded-full ${paymentMethod === method.id ? "bg-[#1A1A1A] text-white" : "bg-[#F5F5F5] text-[#999999]"}`}>
                          <method.icon size={16} />
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-widest font-bold">{method.name}</span>
                            {paymentMethod === method.id && (
                              <Check size={12} className="text-[#1A1A1A]" />
                            )}
                          </div>
                          <p className="text-[10px] text-[#666666] mt-0.5 leading-relaxed">
                            {method.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A] opacity-50">
                    <Lock size={12} />
                    <span>Pembayaran Aman & Terenkripsi</span>
                  </div>
                </section>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#333333] transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Memproses..." : "Buat Pesanan"}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#FDFCFB] border border-[#E5E5E5] p-8 sticky top-32">
                <h2 className="font-playfair text-xl font-bold mb-8">Ringkasan Pesanan</h2>
                <div className="space-y-6 mb-8">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-12 h-16 bg-[#F5F5F5]">
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold">{item.name}</p>
                          <div className="flex space-x-2 text-[8px] uppercase tracking-widest text-[#999999]">
                            {item.size && item.size !== "ALL" && <span>Ukuran: {item.size}</span>}
                            {item.color && <span>Warna: {item.color}</span>}
                          </div>
                          <p className="text-[10px] text-[#666666]">Jumlah: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold">Rp {(item.price * item.quantity).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4 pt-6 border-t border-[#E5E5E5]">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#666666]">
                    <span>Subtotal</span>
                    <span>Rp {totalPrice.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#666666]">
                    <span>Pengiriman</span>
                    <span>Gratis</span>
                  </div>
                  <div className="flex justify-between text-xs uppercase tracking-[0.2em] font-bold pt-4">
                    <span>Total</span>
                    <span>Rp {totalPrice.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
