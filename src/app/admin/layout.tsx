import Link from "next/link";
import { LayoutDashboard, Tag, Package, ShoppingCart, LogOut, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FDFCFB]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E5E5] flex flex-col">
        <div className="p-8 border-b border-[#E5E5E5]">
          <Link href="/admin" className="font-playfair text-2xl font-bold tracking-tight">
            SCRIPTUM
          </Link>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#999999] mt-2">
            Panel Admin
          </p>
        </div>

        <nav className="flex-grow p-6 space-y-2">
          <Link 
            href="/admin" 
            className="flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-widest text-[#666666] hover:bg-[#FDFCFB] hover:text-[#1A1A1A] transition-all rounded-md"
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </Link>
          <Link 
            href="/admin/categories" 
            className="flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-widest text-[#666666] hover:bg-[#FDFCFB] hover:text-[#1A1A1A] transition-all rounded-md"
          >
            <Tag size={16} />
            <span>Kategori</span>
          </Link>
          <Link 
            href="/admin/products" 
            className="flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-widest text-[#666666] hover:bg-[#FDFCFB] hover:text-[#1A1A1A] transition-all rounded-md"
          >
            <Package size={16} />
            <span>Produk</span>
          </Link>
          <Link 
            href="/admin/orders" 
            className="flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-widest text-[#666666] hover:bg-[#FDFCFB] hover:text-[#1A1A1A] transition-all rounded-md"
          >
            <ShoppingCart size={16} />
            <span>Pesanan</span>
          </Link>
          <Link 
            href="/admin/chats" 
            className="flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-widest text-[#666666] hover:bg-[#FDFCFB] hover:text-[#1A1A1A] transition-all rounded-md"
          >
            <MessageSquare size={16} />
            <span>Chat Pelanggan</span>
          </Link>
          <Link 
            href="/admin/content" 
            className="flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-widest text-[#666666] hover:bg-[#FDFCFB] hover:text-[#1A1A1A] transition-all rounded-md"
          >
            <LayoutDashboard size={16} />
            <span>Konten Visual</span>
          </Link>
        </nav>

        <div className="p-6 border-t border-[#E5E5E5]">
          <Link 
            href="/" 
            className="flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-widest text-[#666666] hover:bg-[#FDFCFB] hover:text-[#1A1A1A] transition-all rounded-md"
          >
            <LogOut size={16} />
            <span>Lihat Situs</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-10">
        {children}
      </main>
    </div>
  );
}
