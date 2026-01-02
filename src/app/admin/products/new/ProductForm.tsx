"use client";

import { createProduct, updateProduct } from "@/lib/actions/product";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductSize {
  id?: string;
  name: string;
  color?: string | null;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  type: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string;
  sizes: ProductSize[];
  colors?: string | null;
  isLocked?: boolean;
}

const APPAREL_ATASAN_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const APPAREL_PANTS_SIZES = ["28", "29", "30", "31", "32", "33", "34", "36"];

export default function ProductForm({ 
  categories, 
  product 
}: { 
  categories: Category[], 
  product?: Product 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    product ? JSON.parse(product.images) : []
  );
  
  const [categoryId, setCategoryId] = useState(product?.categoryId || "");
  const [type, setType] = useState(product?.type || "APPAREL_ATASAN");
  
  const [sizes, setSizes] = useState<ProductSize[]>(product?.sizes || []);
  const [colors, setColors] = useState<string[]>(
    product?.colors ? JSON.parse(product.colors) : []
  );

  const [stock, setStock] = useState(product?.stock || 0);
  const [newSize, setNewSize] = useState("");
  const [newSizeStock, setNewSizeStock] = useState(0);
  const [newColor, setNewColor] = useState("");
  const [priceInput, setPriceInput] = useState(
    product ? product.price.toLocaleString('id-ID') : ""
  );

  const router = useRouter();

  const currentCategory = categories.find(c => c.id === categoryId);
  const isNoSize = type === "AKSESORIS";
  const isApparelAtasan = type === "APPAREL_ATASAN";
  const isApparelPants = type === "APPAREL_PANTS";
  const showSizes = isApparelAtasan || isApparelPants;

  const isLimitedEdition = currentCategory?.name.toLowerCase() === "limited edition";
  const isEditing = !!product;
  // Limited Edition: Locked if already published (isEditing) OR explicitly locked in DB
  const isLocked = (isEditing && isLimitedEdition) || !!product?.isLocked;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews: string[] = [];
      for (let i = 0; i < files.length; i++) {
        newPreviews.push(URL.createObjectURL(files[i]));
      }
      setPreviews(newPreviews);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const updateSizeStock = (name: string, color: string | null, newStock: number) => {
    setSizes(prev => prev.map(s => 
      (s.name === name && s.color === color) ? { ...s, stock: Math.max(0, newStock) } : s
    ));
  };

  const adjustStock = (name: string, color: string | null, amount: number) => {
    setSizes(prev => prev.map(s => 
      (s.name === name && s.color === color) ? { ...s, stock: Math.max(0, s.stock + amount) } : s
    ));
  };

  const addSize = (color: string) => {
    if (newSize.trim()) {
      const exists = sizes.find(s => s.name === newSize.trim() && s.color === color);
      if (exists) {
        setSizes(prev => prev.map(s => 
          (s.name === newSize.trim() && s.color === color) ? { ...s, stock: s.stock + newSizeStock } : s
        ));
      } else {
        setSizes(prev => [...prev, { name: newSize.trim(), color, stock: newSizeStock }]);
      }
      setNewSize("");
      setNewSizeStock(0);
    }
  };

  const removeSize = (name: string, color: string | null) => {
    setSizes(prev => prev.filter(s => !(s.name === name && s.color === color)));
  };

  const addColor = () => {
    if (newColor.trim()) {
      const color = newColor.trim();

      if (colors.includes(color)) {
        alert("Warna sudah ada");
        return;
      }

      if (isEditing && isLimitedEdition && isLocked) {
        alert("Produk Limited Edition yang sudah publish atau memiliki transaksi tidak dapat menambah varian baru.");
        return;
      }

      setColors(prev => [...prev, color]);
      
      // For Accessories, automatically add 'ALL' size with 0 stock
      if (isNoSize) {
        setSizes(prev => {
          const filtered = prev.filter(s => s.color !== color);
          return [...filtered, { name: "ALL", color, stock: 0 }];
        });
      }

      // For Apparel Atasan, automatically add XS, S, M, L, XL, XXL with 0 stock
      if (isApparelAtasan) {
        const standardSizes: ProductSize[] = APPAREL_ATASAN_SIZES.map(name => ({
          name,
          color,
          stock: 0
        }));
        
        setSizes(prev => {
          const filtered = prev.filter(s => s.color !== color);
          return [...filtered, ...standardSizes];
        });
      }

      // For Apparel Pants, automatically add sizes 28-36 with 0 stock
      if (isApparelPants) {
        const pantsSizes: ProductSize[] = APPAREL_PANTS_SIZES.map(name => ({
          name,
          color,
          stock: 0
        }));
        
        setSizes(prev => {
          const filtered = prev.filter(s => s.color !== color);
          return [...filtered, ...pantsSizes];
        });
      }
      
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setColors(prev => prev.filter(c => c !== color));
    // Also remove sizes associated with this color
    setSizes(prev => prev.filter(s => s.color !== color));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digits
    const value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      setPriceInput("");
      return;
    }
    // Format with dots
    const formatted = parseInt(value).toLocaleString('id-ID');
    setPriceInput(formatted);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    // Validation
    const totalStock = (showSizes || isNoSize) 
      ? sizes.reduce((acc, curr) => acc + curr.stock, 0) 
      : stock;

    if (totalStock <= 0) {
      alert("Produk harus memiliki stok awal.");
      return;
    }

    if (isApparelAtasan || isApparelPants) {
      if (sizes.length === 0) {
        alert("Struktur varian tidak sesuai tipe produk (Apparel harus memiliki ukuran).");
        return;
      }

      if (isApparelPants) {
        const hasNonNumericSize = sizes.some(s => isNaN(Number(s.name)));
        if (hasNonNumericSize) {
          alert("Struktur varian tidak sesuai tipe produk (Ukuran Celana harus berupa angka).");
          return;
        }
      }
    }

    if (isNoSize) {
      const hasInvalidSizes = sizes.some(s => s.name !== "ALL");
      if (hasInvalidSizes) {
        alert("Struktur varian tidak sesuai tipe produk (Aksesoris tidak boleh memiliki ukuran).");
        return;
      }
    }

    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    
    // Set formatted data
    formData.set("price", priceInput);
    
    // Calculate total stock if sizes or accessories are shown
    if (showSizes || isNoSize) {
      formData.set("stock", totalStock.toString());
      formData.set("sizes", JSON.stringify(sizes));
    } else {
      formData.set("stock", stock.toString());
      formData.set("sizes", JSON.stringify([]));
    }
    
    formData.set("colors", JSON.stringify(colors));
    
    if (product) {
      formData.set("existingImages", JSON.stringify(existingImages));
    }
    
    try {
      if (product) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.message || (product ? "Gagal memperbarui produk" : "Gagal membuat produk"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2">
              Nama Produk
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={product?.name}
              required
              className="w-full px-4 py-3 bg-[#F5F5F5] border-none focus:ring-1 focus:ring-[#1A1A1A] text-sm transition-all"
              placeholder="contoh: Classic Silk Shirt"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2">
                Tipe Produk
              </label>
              <select
                id="type"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#F5F5F5] border-none focus:ring-1 focus:ring-[#1A1A1A] text-sm transition-all appearance-none"
              >
                <option value="APPAREL_ATASAN">Apparel Atasan (T-Shirt, Hoodie, dll)</option>
                <option value="APPAREL_PANTS">Apparel Bawah (Jeans, Pants, dll)</option>
                <option value="AKSESORIS">Aksesoris (Tumbler, Tas, dll)</option>
              </select>
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2">
                Kategori
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#F5F5F5] border-none focus:ring-1 focus:ring-[#1A1A1A] text-sm transition-all appearance-none"
              >
                <option value="">Pilih kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2">
                Harga (Rp)
              </label>
              <input
                type="text"
                id="price"
                value={priceInput}
                onChange={handlePriceChange}
                required
                className="w-full px-4 py-3 bg-[#F5F5F5] border-none focus:ring-1 focus:ring-[#1A1A1A] text-sm transition-all"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2">
                Stok {(showSizes || isNoSize) && "(Otomatis dari Varian)"}
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                readOnly={showSizes || isNoSize || (isEditing && isLimitedEdition)}
                value={showSizes || isNoSize ? sizes.reduce((acc, curr) => acc + curr.stock, 0) : stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                required
                className={`w-full px-4 py-3 border-none focus:ring-1 focus:ring-[#1A1A1A] text-sm transition-all ${showSizes || isNoSize || (isEditing && isLimitedEdition) ? 'bg-[#EEEEEE] text-[#999999]' : 'bg-[#F5F5F5]'}`}
                placeholder="0"
              />
              {isEditing && isLimitedEdition && (
                <p className="text-[9px] text-red-500 uppercase tracking-widest mt-1 font-bold">
                  Produk Limited Edition: Stok tidak dapat ditambahkan setelah diupload.
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2">
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={product?.description || ""}
              rows={5}
              className="w-full px-4 py-3 bg-[#F5F5F5] border-none focus:ring-1 focus:ring-[#1A1A1A] text-sm transition-all resize-none"
              placeholder="Tulis deskripsi produk di sini..."
            />
          </div>

          {/* STOCK SUMMARY */}
          {(showSizes || isNoSize) && sizes.length > 0 && (
            <div className="p-6 bg-[#FDFCFB] border border-[#E5E5E5] space-y-4">
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">Ringkasan Stok Total</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white border border-[#F0F0F0]">
                  <p className="text-[8px] uppercase tracking-widest text-[#999999] mb-1">Total Produk</p>
                  <p className="text-xl font-bold">{sizes.reduce((acc, s) => acc + s.stock, 0)} <span className="text-[10px] font-normal text-[#999999]">PCS</span></p>
                </div>
                <div className="p-3 bg-white border border-[#F0F0F0]">
                  <p className="text-[8px] uppercase tracking-widest text-[#999999] mb-1">Total Varian</p>
                  <p className="text-xl font-bold">{sizes.length} <span className="text-[10px] font-normal text-[#999999]">JENIS</span></p>
                </div>
              </div>
              
                <div className="space-y-2">
                  <p className="text-[8px] uppercase tracking-widest text-[#999999]">Stok per Warna:</p>
                  <div className="flex flex-wrap gap-2">
                    {colors.map(color => {
                      const colorStock = sizes.filter(s => s.color === color).reduce((acc, s) => acc + s.stock, 0);
                      return (
                        <div key={color} className={`px-3 py-1 bg-white border flex items-center space-x-2 ${colorStock < 5 ? 'border-red-200 bg-red-50' : 'border-[#F0F0F0]'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${colorStock < 5 ? 'bg-red-500' : 'bg-[#1A1A1A]'}`} />
                          <span className={`text-[9px] uppercase tracking-wider font-medium ${colorStock < 5 ? 'text-red-700' : 'text-[#1A1A1A]'}`}>{color}:</span>
                          <span className={`text-[9px] font-bold ${colorStock < 5 ? 'text-red-700' : 'text-[#1A1A1A]'}`}>{colorStock}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {showSizes && (
                  <div className="space-y-2">
                    <p className="text-[8px] uppercase tracking-widest text-[#999999]">Stok per Ukuran:</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(new Set(sizes.map(s => s.name))).sort().map(sizeName => {
                        const sizeStock = sizes.filter(s => s.name === sizeName).reduce((acc, s) => acc + s.stock, 0);
                        return (
                          <div key={sizeName} className="px-3 py-1 bg-white border border-[#F0F0F0] flex items-center space-x-2">
                            <span className="text-[9px] uppercase tracking-wider font-medium">{sizeName}:</span>
                            <span className="text-[9px] font-bold">{sizeStock}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* COLORS & SIZES MANAGEMENT */}
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <label className="block text-[12px] uppercase tracking-[0.2em] font-black mb-3">
                  Manajemen Varian & Stok
                </label>
                <p className="text-[11px] text-[#999999] uppercase tracking-[0.1em] font-bold">
                  {isNoSize
                    ? "Aksesoris: Masukkan stok per warna (Tanpa ukuran)."
                    : isApparelPants
                    ? "Apparel Bawah: Masukkan stok untuk ukuran angka (28-36)."
                    : isApparelAtasan
                    ? "Apparel Atasan: Masukkan stok untuk ukuran (XS-XXL)."
                    : "Tambahkan warna terlebih dahulu, lalu masukkan ukuran dan stok."}
                </p>
                {isLocked && (
                  <p className="text-[10px] text-red-500 uppercase tracking-widest font-black mt-2 bg-red-50 p-2 border border-red-100">
                    ⚠ LIMITED EDITION: VARIAN DAN STOK TERKUNCI. TIDAK DAPAT DIUBAH ATAU DITAMBAHKAN.
                  </p>
                )}
              </div>
            </div>

            {!isLocked && (
              <div className="flex gap-4 h-16">
                <input
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                  placeholder="Tambah Warna (Contoh: Black, White, Navy)"
                  className="flex-grow px-6 py-4 bg-[#F5F5F5] border-none text-base font-medium focus:ring-2 focus:ring-[#1A1A1A]"
                />
                <button 
                  type="button" 
                  onClick={addColor}
                  className="px-10 bg-[#1A1A1A] text-white text-[12px] uppercase tracking-[0.2em] font-black hover:bg-black transition-colors"
                >
                  Tambah Warna
                </button>
              </div>
            )}

            <div className="space-y-10">
              {colors.map((color) => {
                const colorSizes = sizes.filter(s => s.color === color);
                const totalStock = colorSizes.reduce((acc, s) => acc + s.stock, 0);
                
                return (
                  <div key={color} className="group">
                    {/* NEW MINIMALIST HEADER */}
                    <div className="flex items-center justify-between pb-6 border-b-2 border-[#1A1A1A]">
                      <div className="flex items-baseline space-x-6">
                        <span className="text-2xl font-black tracking-tighter uppercase">{color || "Standar"}</span>
                        <span className="text-[12px] tracking-[0.2em] text-[#999999] uppercase font-black">
                          Total Stok: <span className="text-[#1A1A1A] text-lg">{totalStock} PCS</span>
                        </span>
                      </div>
                      {!isLocked && (
                        <button 
                          type="button" 
                          onClick={() => {
                            if (confirm(`Hapus varian warna ${color}?`)) {
                              removeColor(color);
                            }
                          }}
                          className="text-[11px] tracking-[0.2em] text-[#999999] hover:text-red-500 font-black uppercase transition-colors"
                        >
                          Hapus Varian
                        </button>
                      )}
                    </div>

                    <div className="pt-8">
                      {isNoSize ? (
                        <div className="flex items-center space-x-6 max-w-sm">
                          <div className="flex-grow">
                            <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-[#1A1A1A] mb-3">Jumlah Stok</label>
                            <div className="relative group/input">
                              <input
                                type="number"
                                value={sizes.find(s => s.color === color)?.stock || 0}
                                onChange={(e) => {
                                  if (isLocked) return;
                                  const val = parseInt(e.target.value) || 0;
                                  const exists = sizes.find(s => s.color === color);
                                  if (!exists) {
                                    setSizes(prev => [...prev, { name: "ALL", color, stock: val }]);
                                  } else {
                                    updateSizeStock(exists.name, color, val);
                                  }
                                }}
                                readOnly={isLocked}
                                className={`w-full border-none text-xl font-black py-4 px-6 focus:ring-2 focus:ring-[#1A1A1A] ${isLocked ? 'bg-[#EEEEEE] text-[#999999]' : 'bg-[#F5F5F5]'}`}
                              />
                            </div>
                          </div>
                          {!isLocked && (
                            <div className="flex flex-col space-y-2 pt-6">
                              <button 
                                type="button"
                                onClick={() => {
                                  const exists = sizes.find(s => s.color === color);
                                  if (exists) adjustStock(exists.name, color, 1);
                                  else setSizes(prev => [...prev, { name: "ALL", color, stock: 1 }]);
                                }}
                                className="w-12 h-12 flex items-center justify-center bg-[#F0F0F0] hover:bg-[#1A1A1A] hover:text-white transition-all text-xl font-bold"
                              >
                                +
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  const exists = sizes.find(s => s.color === color);
                                  if (exists) adjustStock(exists.name, color, -1);
                                }}
                                className="w-12 h-12 flex items-center justify-center bg-[#F0F0F0] hover:bg-[#1A1A1A] hover:text-white transition-all text-xl font-bold"
                              >
                                -
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (showSizes) ? (
                        <div className={`grid ${isApparelPants ? 'grid-cols-2 sm:grid-cols-4 md:grid-cols-8' : 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6'} gap-x-4 gap-y-8`}>
                          {(isApparelPants ? APPAREL_PANTS_SIZES : APPAREL_ATASAN_SIZES).map(sizeName => {
                            const sizeData = sizes.find(s => s.name === sizeName && s.color === color) || { name: sizeName, color, stock: 0 };
                            return (
                              <div key={sizeName} className="space-y-3">
                                <div className="text-[12px] font-black tracking-[0.2em] text-[#1A1A1A] uppercase text-center">
                                  {sizeName}
                                </div>
                                <div className="relative group/input">
                                  <input
                                    type="number"
                                    value={sizeData.stock}
                                    onChange={(e) => {
                                      if (isLocked) return;
                                      const val = parseInt(e.target.value) || 0;
                                      if (!sizes.find(s => s.name === sizeName && s.color === color)) {
                                        setSizes(prev => [...prev, { name: sizeName, color, stock: val }]);
                                      } else {
                                        updateSizeStock(sizeName, color, val);
                                      }
                                    }}
                                    readOnly={isLocked}
                                    className={`w-full border-none text-center text-lg font-black py-4 focus:ring-2 focus:ring-[#1A1A1A] transition-all shadow-sm ${isLocked ? 'bg-[#EEEEEE] text-[#999999]' : 'bg-[#F5F5F5]'} ${sizeData.stock === 0 ? 'text-[#CCCCCC]' : 'text-[#1A1A1A]'}`}
                                  />
                                  {!isLocked && (
                                    <>
                                      <div className="absolute inset-y-0 left-0 flex flex-col justify-center opacity-0 group-hover/input:opacity-100 transition-opacity">
                                        <button 
                                          type="button"
                                          onClick={() => adjustStock(sizeName, color, -1)}
                                          className="w-8 h-full text-[#999999] hover:text-[#1A1A1A] hover:bg-[#F0F0F0] text-sm font-black"
                                        >
                                          -
                                        </button>
                                      </div>
                                      <div className="absolute inset-y-0 right-0 flex flex-col justify-center opacity-0 group-hover/input:opacity-100 transition-opacity">
                                        <button 
                                          type="button"
                                          onClick={() => {
                                            if (!sizes.find(s => s.name === sizeName && s.color === color)) {
                                              setSizes(prev => [...prev, { name: sizeName, color, stock: 1 }]);
                                            } else {
                                              adjustStock(sizeName, color, 1);
                                            }
                                          }}
                                          className="w-8 h-full text-[#999999] hover:text-[#1A1A1A] hover:bg-[#F0F0F0] text-sm font-black"
                                        >
                                          +
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {showSizes && (
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={newSize}
                                onChange={(e) => setNewSize(e.target.value)}
                                placeholder="Ukuran (S, M, L, XL...)"
                                className="flex-grow px-4 py-3 bg-[#F9F9F9] border-none text-sm focus:ring-1 focus:ring-[#1A1A1A]"
                              />
                              <input
                                type="number"
                                value={newSizeStock}
                                onChange={(e) => setNewSizeStock(parseInt(e.target.value) || 0)}
                                placeholder="Stok"
                                className="w-24 px-4 py-3 bg-[#F9F9F9] border-none text-sm focus:ring-1 focus:ring-[#1A1A1A]"
                              />
                              <button 
                                type="button" 
                                onClick={() => addSize(color)}
                                className="px-10 bg-[#1A1A1A] text-white text-[12px] uppercase tracking-[0.2em] font-black hover:bg-black transition-colors"
                              >
                                Tambah
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {colors.length === 0 && (
                <div className="py-10 border-2 border-dashed border-[#E5E5E5] bg-[#FDFCFB] text-center">
                  <p className="text-[10px] text-[#999999] uppercase tracking-widest">Belum ada warna yang ditambahkan.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <label className="block text-[10px] uppercase tracking-[0.2em] font-bold mb-2">
            Gambar Produk (Bisa lebih dari 1)
          </label>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Existing Images */}
            {existingImages.map((img, idx) => (
              <div key={idx} className="relative aspect-[3/4] bg-[#F5F5F5] border border-[#E5E5E5] group">
                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => removeExistingImage(idx)}
                  className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-white text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            ))}
            {/* New Previews */}
            {previews.map((img, idx) => (
              <div key={idx} className="relative aspect-[3/4] bg-[#F5F5F5] border border-[#E5E5E5] opacity-60">
                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[8px] uppercase tracking-widest font-bold bg-white/80 px-2 py-1">Baru</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-[#E5E5E5] border-dashed bg-[#FDFCFB] hover:bg-[#F5F5F5] transition-colors cursor-pointer relative group">
            <div className="space-y-2 text-center">
              <svg className="mx-auto h-12 w-12 text-[#999999] group-hover:text-[#1A1A1A] transition-colors" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-xs text-[#1A1A1A] tracking-wider uppercase font-medium justify-center">
                <label htmlFor="images" className="relative cursor-pointer rounded-md font-bold hover:text-[#8B7E74] transition-colors">
                  <span>Unggah file gambar</span>
                  <input 
                    id="images" 
                    name={product ? "newImages" : "images"} 
                    type="file" 
                    className="sr-only" 
                    accept="image/*" 
                    multiple 
                    required={!product && existingImages.length === 0} 
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <p className="text-[10px] text-[#999999] uppercase tracking-widest">
                PNG, JPG, GIF hingga 10MB (Bisa banyak)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-10 border-t border-[#E5E5E5]">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-5 bg-[#1A1A1A] text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#333333] transition-colors disabled:bg-[#999999]"
        >
          {isLoading ? "Menyimpan..." : (product ? "Perbarui Produk" : "Buat Produk")}
        </button>
      </div>
    </form>
  );
}
