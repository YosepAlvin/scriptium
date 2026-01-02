import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProductsCarousel from "@/components/home/FeaturedProductsCarousel";
import CategoryCards from "@/components/home/CategoryCards";
import { getCarouselConfig } from "@/lib/actions/content";
import { unstable_cache } from "next/cache";
import SectionReveal from "@/components/ui/SectionReveal";
import { blurDataURL } from "@/lib/image-utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Cache static data
const getCachedCategories = unstable_cache(
  async () => {
    const categories = await (prisma as any).category.findMany({
      take: 10, // Ambil lebih banyak untuk difilter secara manual jika runtime error
      orderBy: { name: 'asc' }
    });
    return categories.filter((cat: any) => cat.isFeatured).slice(0, 3);
  },
  ['categories-home-v2'], // Ubah key cache untuk memaksa refresh
  { revalidate: 3600, tags: ['categories'] }
);

const getCachedHeroSlides = unstable_cache(
  async () => {
    return (prisma as any).hero.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
  },
  ['hero-slides-home'],
  { revalidate: 3600, tags: ['hero'] }
);

const getCachedSectionImages = unstable_cache(
  async () => {
    return (prisma as any).sectionImage.findMany();
  },
  ['section-images-home'],
  { revalidate: 3600, tags: ['section-images'] }
);

// Cache semi-dynamic data
const getCachedFeaturedProducts = unstable_cache(
  async () => {
    return (prisma as any).product.findMany({
      include: {
        category: true,
        reviews: true
      },
      orderBy: { createdAt: 'desc' }
    });
  },
  ['featured-products-home-v2'],
  { revalidate: 300, tags: ['products', 'featured-products'] }
);

export default async function Home() {
  const [categories, featuredProducts, heroSlides, sectionImages, carouselConfig] = await Promise.all([
    getCachedCategories(),
    getCachedFeaturedProducts(),
    getCachedHeroSlides(),
    getCachedSectionImages(),
    getCarouselConfig()
  ]);

  const brandStoryImage = sectionImages.find((img: any) => img.section === "brand-story")?.image || 
    "https://images.unsplash.com/photo-1490623970972-ae8bb3da443e?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section - Dynamic Carousel */}
        <HeroSection slides={heroSlides} />

        {/* Featured Products - Auto Scroll Carousel */}
        <SectionReveal>
          <FeaturedProductsCarousel products={featuredProducts} config={carouselConfig} />
        </SectionReveal>

        {/* Categories Section - Motion Editorial */}
        <SectionReveal>
          <CategoryCards categories={categories} />
        </SectionReveal>

        {/* Brand Story - Enhanced with Dynamic Image */}
        <SectionReveal>
          <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Image
                src={brandStoryImage}
                alt="Brand Philosophy"
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={blurDataURL(1920, 1080)}
              />
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]" />
            </div>
            
            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
              <span className="text-[10px] uppercase tracking-[0.8em] text-accent mb-10 block font-bold">Filosofi Scriptum</span>
              <h2 className="font-playfair text-5xl md:text-7xl font-bold mb-12 leading-[1.1] text-[#121212]">
                Dibuat dengan Niat, <br />Dirancang untuk Warisan.
              </h2>
              <div className="w-24 h-px bg-accent mx-auto mb-12" />
              <p className="text-[#121212] text-xl md:text-2xl font-playfair italic leading-relaxed mb-16 max-w-3xl mx-auto">
                "Scriptum lahir dari keinginan untuk menghilangkan kebisingan dan kembali ke apa yang benar-benar penting. 
                Setiap bagian adalah bukti keindahan yang ditemukan dalam keseimbangan antara tradisi dan modernitas."
              </p>
              <Link 
                href="/about"
                className="text-[11px] uppercase tracking-[0.5em] font-bold border-b-2 border-accent pb-4 hover:text-accent transition-all duration-300"
              >
                Temukan Kisah Kami
              </Link>
            </div>
          </section>
        </SectionReveal>
      </main>

      <Footer />
    </div>
  );
}
