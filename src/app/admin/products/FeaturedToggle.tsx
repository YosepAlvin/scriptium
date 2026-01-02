"use client";

import React, { useState } from "react";
import { toggleProductFeatured } from "@/lib/actions/product";
import { Star } from "lucide-react";

interface FeaturedToggleProps {
  productId: string;
  isFeatured: boolean;
}

export default function FeaturedToggle({ productId, isFeatured: initialIsFeatured }: FeaturedToggleProps) {
  const [isFeatured, setIsFeatured] = useState(initialIsFeatured);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await toggleProductFeatured(productId, !isFeatured);
      setIsFeatured(!isFeatured);
    } catch (error) {
      console.error("Failed to toggle featured status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`p-2 rounded-full transition-all duration-300 ${
        isFeatured 
          ? "text-accent bg-accent/10 hover:bg-accent/20" 
          : "text-gray-300 hover:text-gray-400 hover:bg-gray-100"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      title={isFeatured ? "Hapus dari Unggulan" : "Jadikan Unggulan"}
    >
      <Star size={18} fill={isFeatured ? "currentColor" : "none"} />
    </button>
  );
}
