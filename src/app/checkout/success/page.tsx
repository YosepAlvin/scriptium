import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center pt-20 bg-[#FDFCFB]">
        <div className="max-w-md w-full px-6 text-center">
          <div className="flex justify-center mb-8">
            <CheckCircle2 size={64} className="text-[#1A1A1A]" strokeWidth={1} />
          </div>
          <h1 className="font-playfair text-3xl font-bold mb-4 tracking-tight">Order Placed Successfully</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#666666] mb-12 leading-relaxed">
            Thank you for choosing Scriptum. Your order has been received and is being processed.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/my-account"
              className="block w-full py-4 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#333333] transition-colors"
            >
              View Order History
            </Link>
            <Link 
              href="/shop"
              className="block w-full py-4 bg-transparent border border-[#E5E5E5] text-[#1A1A1A] text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#F5F5F5] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
