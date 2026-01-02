"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Navigation, Pagination } from "swiper/modules";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface FeaturedProductsCarouselProps {
  products: any[];
  config?: {
    autoplay: boolean;
    autoplayDelay: number;
    loop: boolean;
    buttonStyle: string;
    showNavigation: boolean;
    slidesPerViewDesktop: number;
    slidesPerViewTablet: number;
    slidesPerViewMobile: number;
  };
}

const FeaturedProductsCarousel: React.FC<FeaturedProductsCarouselProps> = ({ 
  products, 
  config = {
    autoplay: true,
    autoplayDelay: 4000,
    loop: true,
    buttonStyle: "minimal",
    showNavigation: true,
    slidesPerViewDesktop: 4,
    slidesPerViewTablet: 2,
    slidesPerViewMobile: 1.2
  } 
}) => {
  const swiperRef = useRef<any>(null);

  if (!products || products.length === 0) return null;

  const isBold = config.buttonStyle === "bold";

  return (
    <section className="py-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.6em] text-accent mb-4 block">Eksklusif</span>
            <h2 className="font-playfair text-5xl font-bold text-[#121212]">Produk Unggulan</h2>
          </div>
          <Link 
            href="/shop" 
            className="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-[#121212] pb-2 hover:text-accent hover:border-accent transition-colors"
          >
            Lihat Semua Produk
          </Link>
        </div>
      </div>

      <div className="px-4 md:px-0 relative group">
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Autoplay, FreeMode, Navigation, Pagination]}
          spaceBetween={32}
          slidesPerView={config.slidesPerViewMobile}
          loop={config.loop}
          speed={1000}
          autoplay={config.autoplay ? {
            delay: config.autoplayDelay,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          } : false}
          pagination={{
            clickable: true,
            el: '.featured-pagination',
            bulletClass: 'featured-bullet',
            bulletActiveClass: 'featured-bullet-active',
          }}
          freeMode={{
            enabled: true,
            sticky: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: config.slidesPerViewTablet,
            },
            1024: {
              slidesPerView: config.slidesPerViewDesktop,
            },
          }}
          className="featured-swiper !px-4 md:!px-12 !pb-20"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation & Pagination Container */}
        {config.showNavigation && (
          <div className="flex flex-col items-center mt-8 gap-8">
            {/* Navigation Buttons */}
            <div className="flex items-center gap-6">
              <button 
                onClick={() => swiperRef.current?.slidePrev()}
                className={`flex items-center justify-center transition-all duration-300 active:scale-95 group/btn ${
                  isBold 
                    ? "w-[52px] h-[52px] rounded-[12px] bg-[#121212] text-white shadow-lg hover:bg-accent hover:text-[#121212] hover:scale-105" 
                    : "w-[44px] h-[44px] rounded-full border border-accent text-accent hover:bg-accent hover:text-[#121212] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                }`}
                aria-label="Previous product"
              >
                <ChevronLeft size={isBold ? 24 : 20} strokeWidth={isBold ? 2 : 1.5} className="transition-transform group-hover/btn:-translate-x-0.5" />
              </button>
              
              {/* Dot Indicator (Pagination) */}
              <div className="featured-pagination flex gap-2"></div>

              <button 
                onClick={() => swiperRef.current?.slideNext()}
                className={`flex items-center justify-center transition-all duration-300 active:scale-95 group/btn ${
                  isBold 
                    ? "w-[52px] h-[52px] rounded-[12px] bg-[#121212] text-white shadow-lg hover:bg-accent hover:text-[#121212] hover:scale-105" 
                    : "w-[44px] h-[44px] rounded-full border border-accent text-accent hover:bg-accent hover:text-[#121212] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                }`}
                aria-label="Next product"
              >
                <ChevronRight size={isBold ? 24 : 20} strokeWidth={isBold ? 2 : 1.5} className="transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .featured-bullet {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #E5E5E5;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .featured-bullet-active {
          background: #C2A76D;
          width: 24px;
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProductsCarousel;
