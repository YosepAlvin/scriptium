import { prisma } from "@/lib/prisma";
import { Package, Tag, ShoppingCart, Users, TrendingUp, Eye, ShoppingBag, Clock } from "lucide-react";
import Image from "next/image";

export default async function AdminDashboard() {
  const [productCount, categoryCount, orderCount, userCount, mostViewedProducts] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "BUYER" } }),
    (prisma.product as any).findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }, // In real app, order by viewCount
      include: { category: true }
    })
  ]);

  const stats = [
    { name: "Total Produk", value: productCount, icon: Package },
    { name: "Kategori", value: categoryCount, icon: Tag },
    { name: "Total Pesanan", value: orderCount, icon: ShoppingCart },
    { name: "Total Pembeli", value: userCount, icon: Users },
  ];

  const insights = [
    { title: "Produk Terpopuler", description: "Berdasarkan jumlah kunjungan", icon: Eye },
    { title: "Conversion Rate", description: "3.2% dari total kunjungan", icon: TrendingUp },
    { title: "Abandoned Cart", description: "12 item menunggu", icon: ShoppingBag },
    { title: "Average Session", description: "4m 12s per user", icon: Clock },
  ];

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-playfair text-3xl font-bold mb-2">Ringkasan Dashboard</h1>
        <p className="text-xs uppercase tracking-[0.2em] text-[#666666]">
          Selamat datang kembali, Admin. Berikut adalah statistik terkini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-8 border border-[#E5E5E5] flex items-center space-x-6 hover:shadow-lg transition-shadow">
            <div className="p-4 bg-[#FDFCFB] border border-[#F0F0F0]">
              <stat.icon size={24} className="text-[#1A1A1A]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#999999] mb-1">
                {stat.name}
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Most Viewed Products */}
        <div className="lg:col-span-2 bg-white border border-[#E5E5E5] p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-playfair text-xl font-bold">Produk Terpopuler</h2>
            <button className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-[#1A1A1A] pb-1">
              Statistik Lengkap
            </button>
          </div>
          <div className="space-y-6">
            {mostViewedProducts.map((product: any, index: number) => (
              <div key={product.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="text-[10px] font-bold text-[#999999] w-4">0{index + 1}</div>
                  <div className="relative w-12 h-12 bg-secondary rounded-lg overflow-hidden">
                    <Image
                      src={JSON.parse(product.images)[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold group-hover:text-accent transition-colors">{product.name}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-[#999999]">{product.category?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">Rp {product.price.toLocaleString('id-ID')}</p>
                  <p className="text-[10px] text-emerald-500 font-bold">+12% Kunjungan</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Insights */}
        <div className="bg-[#1A1A1A] text-white p-8">
          <h2 className="font-playfair text-xl font-bold mb-8">Wawasan Bisnis</h2>
          <div className="grid grid-cols-1 gap-6">
            {insights.map((insight) => (
              <div key={insight.title} className="p-6 border border-white/10 hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-4 mb-3">
                  <insight.icon size={20} className="text-accent" />
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold">{insight.title}</h3>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{insight.description}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 bg-white text-black text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-accent transition-colors">
            Download Laporan
          </button>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="mt-12 bg-white border border-[#E5E5E5] p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-playfair text-xl font-bold">Pesanan Terbaru</h2>
          <button className="text-[10px] uppercase tracking-[0.2em] font-bold border-b border-[#1A1A1A] pb-1">
            Lihat Semua
          </button>
        </div>
        <div className="text-center py-12 text-[#999999] text-xs uppercase tracking-[0.2em]">
          Belum ada pesanan ditemukan.
        </div>
      </div>
    </div>
  );
}
