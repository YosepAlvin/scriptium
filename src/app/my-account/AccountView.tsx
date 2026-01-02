"use client";

import { useState } from "react";
import { Package, User, MapPin, Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { 
  createAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress 
} from "@/lib/actions/address";

interface AccountViewProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  orders: any[];
  addresses: any[];
}

export default function AccountView({ user, orders, addresses }: AccountViewProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses">("orders");
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: "orders", label: "Order History", icon: Package },
    { id: "profile", label: "Profile Details", icon: User },
    { id: "addresses", label: "Addresses", icon: MapPin },
  ];

  async function handleAddressSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      recipient: formData.get("recipient") as string,
      phone: formData.get("phone") as string,
      street: formData.get("street") as string,
      city: formData.get("city") as string,
      province: formData.get("province") as string,
      postalCode: formData.get("postalCode") as string,
      isDefault: formData.get("isDefault") === "on",
    };

    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, data);
      } else {
        await createAddress(data);
      }
      setIsAddingAddress(false);
      setEditingAddress(null);
    } catch (error) {
      console.error("Failed to save address:", error);
      alert("Failed to save address. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteAddress(id: string) {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(id);
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  }

  async function handleSetDefault(id: string) {
    try {
      await setDefaultAddress(id);
    } catch (error) {
      console.error("Failed to set default address:", error);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
      {/* Account Nav */}
      <div className="lg:col-span-1">
        <div className="space-y-2 sticky top-32">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left px-6 py-4 flex items-center gap-4 transition-all duration-300 ${
                  isActive 
                    ? "bg-white border-l-2 border-[#1A1A1A] shadow-sm" 
                    : "text-[#666666] hover:bg-[#FDFCFB]"
                }`}
              >
                <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                <span className={`text-[10px] uppercase tracking-[0.2em] ${isActive ? "font-bold" : ""}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="lg:col-span-3 min-h-[400px]">
        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold">Recent Orders</h2>
            
            {orders.length === 0 ? (
              <div className="glass-effect border border-border-custom p-20 text-center rounded-sm">
                <Package size={32} className="mx-auto text-[#999999] mb-6" strokeWidth={1} />
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#999999]">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-border-custom overflow-hidden hover:shadow-md transition-shadow duration-500">
                    <div className="bg-[#FDFCFB] px-8 py-5 border-b border-border-custom flex flex-wrap justify-between items-center gap-4">
                      <div className="flex space-x-10">
                        <div>
                          <p className="text-[8px] uppercase tracking-widest text-[#999999] mb-1.5">Order Date</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest">
                            {new Date(order.createdAt).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-widest text-[#999999] mb-1.5">Total Amount</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest">
                            Rp {order.total.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-widest text-[#999999] mb-1.5">Status</p>
                          <span className="text-[8px] uppercase tracking-widest font-bold px-3 py-1 bg-[#1A1A1A] text-white rounded-full">
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-[8px] uppercase tracking-widest text-[#999999] font-medium">
                        Order ID: #{order.id.slice(-8).toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="px-8 py-6">
                      <div className="space-y-6">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex justify-between items-center group">
                            <div className="flex items-center space-x-6">
                              <div className="relative w-16 h-20 bg-[#F9F7F5] overflow-hidden border border-border-custom">
                                {(() => {
                                  const images = typeof item.product.images === 'string' 
                                    ? JSON.parse(item.product.images) 
                                    : item.product.images;
                                  const mainImage = images?.[0];

                                  return mainImage ? (
                                    <Image
                                      src={mainImage}
                                      alt={item.product.name}
                                      fill
                                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package size={16} className="text-[#CCCCCC]" />
                                    </div>
                                  );
                                })()}
                              </div>
                              <div>
                                <p className="text-[11px] font-bold uppercase tracking-widest mb-1">{item.product.name}</p>
                                <p className="text-[10px] text-[#666666] tracking-wide">
                                  Qty: {item.quantity} × Rp {item.price.toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>
                            <button className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A] hover:underline underline-offset-4">
                              View Product
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
            <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Profile Details</h2>
            <div className="glass-effect border border-border-custom p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-[#999999] mb-2">Full Name</p>
                  <p className="text-sm font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-[#999999] mb-2">Email Address</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>
              <div className="pt-6 border-t border-border-custom">
                <button className="text-[10px] uppercase tracking-[0.2em] font-bold py-3 px-8 bg-[#1A1A1A] text-white hover:bg-[#333333] transition-colors">
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === "addresses" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[10px] uppercase tracking-[0.3em] font-bold">Shipping Addresses</h2>
              {!isAddingAddress && !editingAddress && (
                <button 
                  onClick={() => setIsAddingAddress(true)}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold hover:underline underline-offset-4"
                >
                  <Plus size={14} /> Add New Address
                </button>
              )}
            </div>

            {(isAddingAddress || editingAddress) ? (
              <div className="glass-effect border border-border-custom p-8 rounded-sm max-w-3xl">
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-8">
                  {editingAddress ? "Edit Address" : "New Address"}
                </h3>
                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-[#666666]">Address Label (e.g., Home, Office)</label>
                      <input 
                        name="name" 
                        required 
                        defaultValue={editingAddress?.name}
                        className="w-full border-b border-border-custom py-2 text-xs focus:outline-none focus:border-[#1A1A1A] transition-colors bg-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-[#666666]">Recipient Name</label>
                      <input 
                        name="recipient" 
                        required 
                        defaultValue={editingAddress?.recipient}
                        className="w-full border-b border-border-custom py-2 text-xs focus:outline-none focus:border-[#1A1A1A] transition-colors bg-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-[#666666]">Phone Number</label>
                      <input 
                        name="phone" 
                        required 
                        defaultValue={editingAddress?.phone}
                        className="w-full border-b border-border-custom py-2 text-xs focus:outline-none focus:border-[#1A1A1A] transition-colors bg-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-[#666666]">Postal Code</label>
                      <input 
                        name="postalCode" 
                        required 
                        defaultValue={editingAddress?.postalCode}
                        className="w-full border-b border-border-custom py-2 text-xs focus:outline-none focus:border-[#1A1A1A] transition-colors bg-transparent"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-[#666666]">Street Address</label>
                    <textarea 
                      name="street" 
                      required 
                      defaultValue={editingAddress?.street}
                      rows={2}
                      className="w-full border-b border-border-custom py-2 text-xs focus:outline-none focus:border-[#1A1A1A] transition-colors bg-transparent resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-[#666666]">City</label>
                      <input 
                        name="city" 
                        required 
                        defaultValue={editingAddress?.city}
                        className="w-full border-b border-border-custom py-2 text-xs focus:outline-none focus:border-[#1A1A1A] transition-colors bg-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-[#666666]">Province</label>
                      <input 
                        name="province" 
                        required 
                        defaultValue={editingAddress?.province}
                        className="w-full border-b border-border-custom py-2 text-xs focus:outline-none focus:border-[#1A1A1A] transition-colors bg-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      name="isDefault" 
                      id="isDefault"
                      defaultChecked={editingAddress?.isDefault}
                      className="w-3 h-3 accent-[#1A1A1A]"
                    />
                    <label htmlFor="isDefault" className="text-[9px] uppercase tracking-widest text-[#666666]">Set as default shipping address</label>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="text-[10px] uppercase tracking-[0.2em] font-bold py-3 px-8 bg-[#1A1A1A] text-white hover:bg-[#333333] transition-colors disabled:opacity-50"
                    >
                      {isLoading ? "Saving..." : editingAddress ? "Update Address" : "Save Address"}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsAddingAddress(false);
                        setEditingAddress(null);
                      }}
                      className="text-[10px] uppercase tracking-[0.2em] font-bold py-3 px-8 border border-border-custom hover:bg-[#FDFCFB] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                  <div key={address.id} className="group relative glass-effect border border-border-custom p-8 transition-all duration-500 hover:border-[#1A1A1A]">
                    {address.isDefault && (
                      <div className="absolute top-8 right-8 flex items-center gap-1.5 text-[#1A1A1A]">
                        <CheckCircle2 size={12} />
                        <span className="text-[8px] uppercase tracking-[0.2em] font-bold">Default</span>
                      </div>
                    )}
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-4">{address.name}</h4>
                    <div className="space-y-1.5 mb-8">
                      <p className="text-[11px] font-bold uppercase tracking-wider">{address.recipient}</p>
                      <p className="text-[10px] text-[#666666] leading-relaxed">
                        {address.street}<br />
                        {address.city}, {address.province}<br />
                        {address.postalCode}
                      </p>
                      <p className="text-[10px] text-[#666666]">{address.phone}</p>
                    </div>
                    <div className="flex items-center gap-6 pt-6 border-t border-border-custom/50">
                      <button 
                        onClick={() => setEditingAddress(address)}
                        className="text-[9px] uppercase tracking-[0.2em] font-bold flex items-center gap-1.5 hover:underline underline-offset-4"
                      >
                        <Edit2 size={10} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-[9px] uppercase tracking-[0.2em] font-bold text-red-600 flex items-center gap-1.5 hover:underline underline-offset-4"
                      >
                        <Trash2 size={10} /> Delete
                      </button>
                      {!address.isDefault && (
                        <button 
                          onClick={() => handleSetDefault(address.id)}
                          className="text-[9px] uppercase tracking-[0.2em] font-bold ml-auto hover:underline underline-offset-4"
                        >
                          Set Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => setIsAddingAddress(true)}
                  className="flex flex-col items-center justify-center border-2 border-dashed border-border-custom p-12 hover:border-[#1A1A1A] hover:bg-[#FDFCFB] transition-all duration-500 group"
                >
                  <Plus size={24} className="text-[#999999] group-hover:text-[#1A1A1A] transition-colors mb-4" strokeWidth={1} />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#666666] group-hover:text-[#1A1A1A]">Add New Address</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
