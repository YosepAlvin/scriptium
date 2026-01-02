"use client";

import React, { useState } from "react";
import { updateCarouselConfig } from "@/lib/actions/content";
import { Settings, Play, Pause, Layout, Monitor, Tablet, Smartphone, Square, Circle } from "lucide-react";

interface FeaturedCarouselManagerProps {
  initialConfig: any;
}

export default function FeaturedCarouselManager({ initialConfig }: FeaturedCarouselManagerProps) {
  const [config, setConfig] = useState(initialConfig);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = async (updates: any) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    setIsSaving(true);
    try {
      await updateCarouselConfig(newConfig);
    } catch (error) {
      console.error("Failed to update carousel config:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-accent/10 rounded-lg">
          <Layout className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-playfair font-bold text-[#121212]">Pengaturan Carousel Produk</h2>
          <p className="text-sm text-gray-500">Kontrol perilaku dan tampilan slider produk unggulan.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Behavior Settings */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Settings className="w-5 h-5" /> Perilaku Slider
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Autoplay</p>
                <p className="text-xs text-gray-500">Geser otomatis secara berkala.</p>
              </div>
              <button
                onClick={() => handleUpdate({ autoplay: !config.autoplay })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.autoplay ? "bg-accent" : "bg-gray-200"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.autoplay ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>

            {config.autoplay && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Delay Autoplay (ms)</p>
                <input
                  type="number"
                  value={config.autoplayDelay}
                  onChange={(e) => handleUpdate({ autoplayDelay: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Infinite Loop</p>
                <p className="text-xs text-gray-500">Kembali ke awal setelah slide terakhir.</p>
              </div>
              <button
                onClick={() => handleUpdate({ loop: !config.loop })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.loop ? "bg-accent" : "bg-gray-200"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.loop ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* UI Style Settings */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Layout className="w-5 h-5" /> Gaya Visual
          </h3>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="font-medium">Style Tombol Navigasi</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleUpdate({ buttonStyle: "minimal" })}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    config.buttonStyle === "minimal" ? "border-accent bg-accent/5" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <Circle className="w-6 h-6" />
                  <span className="text-sm font-medium">Minimal (Editorial)</span>
                </button>
                <button
                  onClick={() => handleUpdate({ buttonStyle: "bold" })}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                    config.buttonStyle === "bold" ? "border-accent bg-accent/5" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <Square className="w-6 h-6" />
                  <span className="text-sm font-medium">Bold (Statement)</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tampilkan Navigasi</p>
                <p className="text-xs text-gray-500">Munculkan tombol manual di bawah slider.</p>
              </div>
              <button
                onClick={() => handleUpdate({ showNavigation: !config.showNavigation })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.showNavigation ? "bg-accent" : "bg-gray-200"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.showNavigation ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Settings */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 md:col-span-2">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Monitor className="w-5 h-5" /> Jumlah Produk Per Tampilan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-medium">Desktop (≥ 1024px)</p>
              </div>
              <input
                type="number"
                step="0.1"
                value={config.slidesPerViewDesktop}
                onChange={(e) => handleUpdate({ slidesPerViewDesktop: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Tablet className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-medium">Tablet (≥ 640px)</p>
              </div>
              <input
                type="number"
                step="0.1"
                value={config.slidesPerViewTablet}
                onChange={(e) => handleUpdate({ slidesPerViewTablet: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="w-4 h-4 text-gray-400" />
                <p className="text-sm font-medium">Mobile (&lt; 640px)</p>
              </div>
              <input
                type="number"
                step="0.1"
                value={config.slidesPerViewMobile}
                onChange={(e) => handleUpdate({ slidesPerViewMobile: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>
        </div>
      </div>

      {isSaving && (
        <div className="fixed bottom-8 right-8 bg-[#121212] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-sm font-medium">Menyimpan perubahan...</span>
        </div>
      )}
    </div>
  );
}
