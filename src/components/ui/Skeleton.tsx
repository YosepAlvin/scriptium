"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "rectangle" | "circle" | "text";
  height?: string | number;
  width?: string | number;
}

export default function Skeleton({ 
  className = "", 
  variant = "rectangle",
  height,
  width 
}: SkeletonProps) {
  const baseStyles = "relative overflow-hidden bg-[#F6F4EF]";
  
  const variantStyles = {
    rectangle: "rounded-[16px]",
    circle: "rounded-full",
    text: "rounded-[4px] h-4 w-full"
  };

  const style = {
    height: height,
    width: width
  };

  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
    >
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent"
        animate={{
          x: ["-100%", "100%"]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton variant="text" width="40%" height={12} />
          <Skeleton variant="text" width="20%" height={12} />
        </div>
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="30%" height={16} />
      </div>
    </div>
  );
}
