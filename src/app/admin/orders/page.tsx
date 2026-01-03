import { prisma } from "@/lib/prisma";
import { ShoppingBag, DollarSign, Package, Clock, CheckCircle } from "lucide-react";
import OrderList from "./OrderList";

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate statistics
  const totalRevenue = orders
    .filter(order => order.paymentStatus === "PAID")
    .reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "PENDING").length;
  const completedOrders = orders.filter(o => o.status === "COMPLETED").length;

  const stats = [
    { label: "Total Pendapatan", value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Pesanan", value: totalOrders, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pesanan Menunggu", value: pendingOrders, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Pesanan Selesai", value: completedOrders, icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold mb-2">Pesanan</h1>
          <p className="text-xs uppercase tracking-[0.2em] text-[#666666]">
            Kelola pesanan pelanggan dan pemenuhannya
          </p>
        </div>
        <div className="text-[10px] uppercase tracking-widest font-bold text-[#999999]">
          Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-white border border-[#E5E5E5] flex items-center space-x-4">
            <div className={`p-3 ${stat.bg} ${stat.color}`}>
              <stat.icon size={20} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-widest font-bold text-[#999999] mb-1">{stat.label}</p>
              <p className="text-lg font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Orders List Component */}
      <OrderList orders={orders as any} />
    </div>
  );
}
