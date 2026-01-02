"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { blurDataURL } from "@/lib/image-utils";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  ctaText: string | null;
  ctaLink: string | null;
}

interface HeroSectionProps {
  slides: HeroSlide[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1500}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        navigation={{
          nextEl: ".hero-next",
          prevEl: ".hero-prev",
        }}
        pagination={{
          clickable: true,
          el: ".hero-pagination",
          renderBullet: (index, className) => {
            return `<span class="${className} w-8 h-1 !bg-white !rounded-none transition-all duration-500"></span>`;
          },
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative h-full w-full overflow-hidden">
            <div className="absolute inset-0 z-0">
              <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: activeIndex === index ? 1 : 1.1 }}
                transition={{ duration: 6, ease: "linear" }}
                className="relative h-full w-full"
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  placeholder="blur"
                  blurDataURL={blurDataURL(1920, 1080)}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/10 to-[#F6F4EF]/20" />
              </motion.div>
            </div>

            <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
              <AnimatePresence mode="wait">
                {activeIndex === index && (
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                    className="max-w-5xl"
                  >
                    <motion.span
                      initial={{ opacity: 0, letterSpacing: "0.2em" }}
                      animate={{ opacity: 1, letterSpacing: "1em" }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                      className="mb-8 block text-[10px] font-medium uppercase tracking-[1em] text-white drop-shadow-md"
                    >
                      Koleksi Terkurasi
                    </motion.span>
                    <h1 className="mb-10 font-playfair text-7xl font-bold leading-[0.9] tracking-tighter text-white drop-shadow-2xl md:text-[120px]">
                      {slide.title.split(" ").map((word, i) => (
                        <React.Fragment key={i}>
                          {word} {i === 0 && slide.title.split(" ").length > 1 && <br />}
                        </React.Fragment>
                      ))}
                    </h1>
                    <p className="mb-14 text-[11px] font-light uppercase tracking-[0.6em] text-white drop-shadow-md md:text-sm">
                      {slide.subtitle}
                    </p>
                    <Link
                      href={slide.ctaLink || "/shop"}
                      className="group relative inline-flex items-center justify-center overflow-hidden bg-white px-16 py-6 text-[11px] font-bold uppercase tracking-[0.4em] text-[#121212] transition-all duration-500 hover:text-white"
                    >
                      <span className="relative z-10">{slide.ctaText || "Jelajahi Koleksi"}</span>
                      <div className="absolute inset-0 translate-y-full bg-[#121212] transition-transform duration-500 group-hover:translate-y-0" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation */}
        <button className="hero-prev absolute left-8 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/30 bg-black/10 p-4 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-[#121212] md:left-12">
          <ChevronLeft size={24} />
        </button>
        <button className="hero-next absolute right-8 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/30 bg-black/10 p-4 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-[#121212] md:right-12">
          <ChevronRight size={24} />
        </button>

        {/* Custom Pagination */}
        <div className="hero-pagination absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 gap-2"></div>
      </Swiper>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-4 animate-bounce opacity-50">
        <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white">Scroll</span>
        <div className="h-12 w-px bg-white/50" />
      </div>
    </section>
  );
};

export default HeroSection;
