import React from "react";
import HeroManager from "./HeroManager";
import SectionImageManager from "./SectionImageManager";
import ThemeControl from "./ThemeControl";
import FeaturedCarouselManager from "@/app/admin/content/FeaturedCarouselManager";
import CategoryFeaturedManager from "./CategoryFeaturedManager";
import { getHeroes, getSectionImages, getThemeConfig, getCarouselConfig, getCategories } from "@/lib/actions/content";

export default async function AdminContentPage() {
  const [heroes, sectionImages, themeConfig, carouselConfig, categories] = await Promise.all([
    getHeroes(),
    getSectionImages(),
    getThemeConfig(),
    getCarouselConfig(),
    getCategories(),
  ]);

  return (
    <div className="space-y-16 pb-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-playfair font-bold text-[#121212]">Manajemen Konten Visual</h1>
        <p className="text-gray-500">Sesuaikan elemen visual beranda dan tema situs tanpa menyentuh kode.</p>
      </div>

      <div className="space-y-24">
        {/* Theme Control Section */}
        <section id="theme">
          <ThemeControl initialConfig={themeConfig} />
        </section>

        <div className="h-px bg-gray-100" />

        {/* Hero Manager Section */}
        <section id="hero">
          <HeroManager initialHeroes={heroes} />
        </section>

        <div className="h-px bg-gray-100" />

        {/* Featured Categories Manager Section */}
        <section id="featured-categories">
          <CategoryFeaturedManager initialCategories={categories} />
        </section>

        <div className="h-px bg-gray-100" />

        {/* Featured Carousel Manager Section */}
        <section id="carousel">
          <FeaturedCarouselManager initialConfig={carouselConfig} />
        </section>

        <div className="h-px bg-gray-100" />

        {/* Section Image Manager Section */}
        <section id="sections">
          <SectionImageManager initialImages={sectionImages} />
        </section>
      </div>
    </div>
  );
}
