"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import CartDrawer from "@/components/cart/CartDrawer";

const Navbar = () => {
  const { totalItems } = useCart();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFCFB]/90 backdrop-blur-md border-b border-border-custom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link href="/" className="font-playfair text-3xl font-bold tracking-[0.1em] text-[#2C2C2C]">
            SCRIPTUM
            <span className="block text-[8px] tracking-[0.6em] text-accent mt-1 font-sans text-center">EST. 2024</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-12 items-center uppercase text-[10px] tracking-[0.3em] font-medium text-[#4A4A4A]">
            <Link href="/shop" className="hover:text-accent transition-all duration-300 relative group">
              Belanja
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/categories" className="hover:text-accent transition-all duration-300 relative group">
              Kategori
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/about" className="hover:text-accent transition-all duration-300 relative group">
              Tentang Kami
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            {session ? (
              <div className="group relative">
                <button className="flex items-center space-x-2 hover:text-[#8B7E74] transition-colors">
                  <User size={20} />
                  <span className="hidden md:inline text-xs uppercase tracking-widest">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E5E5E5] shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2">
                  <Link href="/my-account" className="block px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#FDFCFB]">
                    Akun Saya
                  </Link>
                  {session.user && (session.user as any).role === "ADMIN" && (
                    <Link href="/admin" className="block px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#FDFCFB]">
                      Dashboard Admin
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#FDFCFB] text-red-500"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hover:text-[#8B7E74] transition-colors">
                <User size={20} />
              </Link>
            )}

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative hover:text-[#8B7E74] transition-colors"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#1A1A1A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E5E5E5] py-4 px-6 space-y-4 flex flex-col uppercase text-xs tracking-widest font-medium">
          <Link href="/shop" onClick={() => setIsMenuOpen(false)}>Belanja</Link>
          <Link href="/categories" onClick={() => setIsMenuOpen(false)}>Kategori</Link>
          <Link href="/about" onClick={() => setIsMenuOpen(false)}>Tentang Kami</Link>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default Navbar;
