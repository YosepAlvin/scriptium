"use client";

import { useState, Fragment } from "react";
import Image from "next/image";
import { Search, ShoppingBag, ChevronDown, ChevronUp, Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { updateOrderStatus } from "@/lib/actions/order";

interface OrderItem {
  id: string;
  product: {
    name: string;
    images: string;
  };
  quantity: number;
  price: number;
  size?: string | null;
  color?: string | null;
}

interface Order {
  id: string;
  user: {
    name: string | null;
    email: string | null;
  };
  total: number;
  status: string;
  shippingAddress?: string | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  createdAt: Date;
  items: OrderItem[];
}

export default function OrderList({ orders }: { orders: Order[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (order.user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "MENUNGGU", color: "bg-yellow-50 text-yellow-700", icon: Clock };
      case "PROCESSING":
        return { label: "DIPROSES", color: "bg-blue-50 text-blue-700", icon: Package };
      case "SHIPPED":
        return { label: "DIKIRIM", color: "bg-purple-50 text-purple-700", icon: Truck };
      case "COMPLETED":
        return { label: "SELESAI", color: "bg-green-50 text-green-700", icon: CheckCircle };
      case "CANCELLED":
        return { label: "DIBATALKAN", color: "bg-red-50 text-red-700", icon: XCircle };
      default:
        return { label: status, color: "bg-gray-50 text-gray-700", icon: Clock };
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string, type: "order" | "payment" = "order") => {
    try {
      await updateOrderStatus(orderId, newStatus, type);
    } catch (error) {
      alert(`Gagal memperbarui status ${type === 'order' ? 'pesanan' : 'pembayaran'}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]" size={16} />
          <input
            type="text"
            placeholder="Cari ID, Nama, atau Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#E5E5E5] text-xs focus:ring-1 focus:ring-[#1A1A1A] outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#666666]">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-[#E5E5E5] text-[10px] uppercase tracking-widest font-bold focus:ring-1 focus:ring-[#1A1A1A] outline-none cursor-pointer"
          >
            <option value="ALL">SEMUA STATUS</option>
            <option value="PENDING">MENUNGGU</option>
            <option value="PROCESSING">DIPROSES</option>
            <option value="SHIPPED">DIKIRIM</option>
            <option value="COMPLETED">SELESAI</option>
            <option value="CANCELLED">DIBATALKAN</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E5E5E5] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FDFCFB] border-b border-[#E5E5E5]">
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold">Pesanan</th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold">Pelanggan</th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold">Tanggal</th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold">Total</th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold">Status</th>
              <th className="px-8 py-4 text-[10px] uppercase tracking-[0.2em] font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5]">
            {filteredOrders.map((order) => {
              const status = getStatusConfig(order.status);
              const isExpanded = expandedOrder === order.id;

              return (
                <Fragment key={order.id}>
                  <tr className={`hover:bg-[#FDFCFB] transition-colors ${isExpanded ? 'bg-[#FDFCFB]' : ''}`}>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                          className="p-1 hover:bg-[#EEEEEE] transition-colors"
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        <span className="text-xs font-mono uppercase">#{order.id.slice(-8)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium">{order.user.name || "No Name"}</p>
                      <p className="text-[10px] text-[#999999]">{order.user.email || "No Email"}</p>
                    </td>
                    <td className="px-8 py-6 text-xs text-[#666666]">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-8 py-6 text-sm font-medium">
                      Rp {order.total.toLocaleString('id-ID')}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2">
                        <status.icon size={12} className={status.color.split(' ')[1]} />
                        <span className={`text-[8px] uppercase tracking-widest font-bold px-2 py-1 ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="bg-transparent text-[10px] uppercase tracking-[0.2em] font-bold border-b border-[#1A1A1A] pb-1 cursor-pointer outline-none focus:border-blue-500"
                      >
                        <option value="PENDING">MENUNGGU</option>
                        <option value="PROCESSING">PROSES</option>
                        <option value="SHIPPED">KIRIM</option>
                        <option value="COMPLETED">SELESAI</option>
                        <option value="CANCELLED">BATAL</option>
                      </select>
                    </td>
                  </tr>
                  
                  {/* Expanded Details */}
                  {isExpanded && (
                    <tr className="bg-[#FAFAFA]">
                      <td colSpan={6} className="px-8 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-[#999999]">Item Pesanan</h4>
                            <div className="space-y-4">
                              {order.items.map((item) => {
                                const images = JSON.parse(item.product.images);
                                return (
                                  <div key={item.id} className="flex items-center space-x-4">
                                    <div className="relative w-12 h-16 bg-[#F5F5F5] overflow-hidden">
                                      <Image 
                                        src={images[0] || "https://via.placeholder.com/600x800"} 
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-grow">
                                      <p className="text-xs font-bold uppercase">{item.product.name}</p>
                                      <p className="text-[10px] text-[#666666] uppercase tracking-tighter">
                                        {item.quantity}x • {item.color || 'No Color'} • {item.size || 'No Size'}
                                      </p>
                                    </div>
                                    <div className="text-xs font-medium">
                                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-[10px] uppercase tracking-widest font-bold mb-3 text-[#999999]">Metode Pembayaran</h4>
                                <div className="p-3 bg-white border border-[#E5E5E5] flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                  <span className="text-[10px] font-bold uppercase tracking-widest">
                                    {order.paymentMethod?.replace('_', ' ') || 'BANK TRANSFER'}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-[10px] uppercase tracking-widest font-bold mb-3 text-[#999999]">Status Bayar</h4>
                                <select
                                  value={order.paymentStatus || 'UNPAID'}
                                  onChange={(e) => handleStatusUpdate(order.id, e.target.value, "payment")}
                                  className={`w-full p-3 border text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer ${
                                    order.paymentStatus === 'PAID' 
                                      ? 'bg-green-50 border-green-100 text-green-700' 
                                      : 'bg-red-50 border-red-100 text-red-700'
                                  }`}
                                >
                                  <option value="UNPAID">BELUM BAYAR</option>
                                  <option value="PAID">SUDAH BAYAR</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 text-[#999999]">Informasi Pengiriman</h4>
                              <div className="p-4 bg-white border border-[#E5E5E5] space-y-2">
                                <p className="text-xs font-bold uppercase">{order.user.name}</p>
                                <p className="text-[10px] text-[#666666] leading-relaxed">
                                  {order.shippingAddress || 'Alamat pengiriman tidak tersedia.'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-[#999999] mb-1">Total Pembayaran</p>
                                <p className="text-xl font-bold">Rp {order.total.toLocaleString('id-ID')}</p>
                              </div>
                              <button className="px-6 py-2 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest font-bold hover:bg-black transition-colors">
                                Cetak Invoice
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <ShoppingBag size={32} className="text-[#999999] mb-4" strokeWidth={1} />
                    <p className="text-xs uppercase tracking-[0.2em] text-[#999999]">Tidak ada pesanan yang ditemukan.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
