"use client";

import React, { useState } from "react";
import { updateThemeConfig } from "@/lib/actions/content";
import { Check, Moon, Sun, Type } from "lucide-react";

interface ThemeConfig {
  accentColor: string;
  fontStyle: string;
  isDarkMode: boolean;
}

interface ThemeControlProps {
  initialConfig: ThemeConfig;
}

const accentColors = [
  { name: "Gold Muted", value: "#C2A76D" },
  { name: "Charcoal Black", value: "#121212" },
  { name: "Sage Green", value: "#7D8F85" },
  { name: "Terracotta", value: "#B36A5E" },
  { name: "Slate Blue", value: "#4A5568" },
];

const fontStyles = [
  { id: "serif", name: "Modern Serif", description: "Playfair Display & Libre Baskerville" },
  { id: "sans", name: "Clean Sans", description: "Inter & Manrope" },
];

const ThemeControl: React.FC<ThemeControlProps> = ({ initialConfig }) => {
  const [config, setConfig] = useState(initialConfig);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (updates: Partial<ThemeConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    setLoading(true);
    try {
      await updateThemeConfig(updates);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-[#121212]">🎨 Theme Control</h3>
        <p className="text-sm text-gray-500">Sesuaikan tampilan visual dan nuansa situs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Accent Color */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Sun size={20} />
            </div>
            <h4 className="font-bold text-[#121212]">Warna Aksen</h4>
          </div>
          <div className="flex flex-wrap gap-3">
            {accentColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleUpdate({ accentColor: color.value })}
                className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                  config.accentColor === color.value ? "border-[#121212] scale-110" : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {config.accentColor === color.value && <Check size={16} className="text-white mix-blend-difference" />}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 italic">* Warna ini akan digunakan untuk tombol, link, dan elemen penarik perhatian lainnya.</p>
        </div>

        {/* Font Style */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Type size={20} />
            </div>
            <h4 className="font-bold text-[#121212]">Tipografi</h4>
          </div>
          <div className="space-y-3">
            {fontStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => handleUpdate({ fontStyle: style.id })}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  config.fontStyle === style.id ? "border-[#121212] bg-gray-50" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-bold ${style.id === "serif" ? "font-playfair" : "font-sans"}`}>{style.name}</span>
                  {config.fontStyle === style.id && <Check size={16} className="text-[#121212]" />}
                </div>
                <p className="text-[10px] text-gray-500">{style.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              {config.isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <h4 className="font-bold text-[#121212]">Mode Tampilan</h4>
          </div>
          <div className="flex p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => handleUpdate({ isDarkMode: false })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                !config.isDarkMode ? "bg-white text-[#121212] shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Sun size={16} />
              <span>Light Mode</span>
            </button>
            <button
              onClick={() => handleUpdate({ isDarkMode: true })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                config.isDarkMode ? "bg-white text-[#121212] shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Moon size={16} />
              <span>Dark Mode</span>
            </button>
          </div>
          <p className="text-xs text-gray-400 italic">* Sesuaikan nuansa situs antara terang yang bersih atau gelap yang elegan.</p>
        </div>
      </div>

      {loading && (
        <div className="fixed bottom-8 right-8 bg-[#121212] text-white px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm font-bold uppercase tracking-widest">Menyimpan Perubahan...</span>
        </div>
      )}
    </div>
  );
};

export default ThemeControl;
