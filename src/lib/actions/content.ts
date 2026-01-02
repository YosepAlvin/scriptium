"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { saveImage } from "@/lib/upload";

// Hero Actions
export async function getHeroes() {
  return await (prisma as any).hero.findMany({
    orderBy: { order: 'asc' }
  });
}

export async function upsertHero(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const ctaText = formData.get("ctaText") as string;
  const ctaLink = formData.get("ctaLink") as string;
  const isActive = formData.get("isActive") === "true";
  const imageFile = formData.get("imageFile") as File;
  let image = formData.get("image") as string;

  if (imageFile && imageFile.size > 0) {
    const uploadedUrl = await saveImage(imageFile);
    if (uploadedUrl) image = uploadedUrl;
  }

  const data = {
    title,
    subtitle,
    ctaText,
    ctaLink,
    isActive,
    image
  };

  if (id && id !== "undefined") {
    await (prisma as any).hero.update({
      where: { id },
      data
    });
  } else {
    // Get last order
    const lastHero = await (prisma as any).hero.findFirst({
      orderBy: { order: 'desc' }
    });
    const order = lastHero ? lastHero.order + 1 : 0;

    await (prisma as any).hero.create({
      data: { ...data, order }
    });
  }
  revalidatePath("/", "page");
  revalidatePath("/admin/content", "page");
  revalidateTag("hero", "page");
}

// Category Actions
export async function getCategories() {
  return await (prisma as any).category.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function toggleCategoryFeatured(id: string, isFeatured: boolean) {
  // Gunakan query mentah atau pastikan prisma client terupdate
  await (prisma as any).category.update({
    where: { id },
    data: { isFeatured: isFeatured }
  });
  revalidatePath("/", "page");
  revalidatePath("/admin/content", "page");
  revalidateTag("categories", "page");

}

export async function deleteHero(id: string) {
  await (prisma as any).hero.delete({
    where: { id }
  });
  revalidatePath("/", "page");
  revalidatePath("/admin/content", "page");
  revalidateTag("hero", "page");
}

export async function updateHeroOrder(orderedIds: string[]) {
  for (let i = 0; i < orderedIds.length; i++) {
    await (prisma as any).hero.update({
      where: { id: orderedIds[i] },
      data: { order: i }
    });
  }
  revalidatePath("/", "page");
  revalidatePath("/admin/content", "page");
  revalidateTag("hero", "page");
}

// Section Image Actions
export async function getSectionImages() {
  return await (prisma as any).sectionImage.findMany();
}

export async function updateSectionImage(section: string, image: string) {
  await (prisma as any).sectionImage.upsert({
    where: { section },
    update: { image },
    create: { section, image }
  });
  revalidatePath("/", "page");
  revalidatePath("/admin/content", "page");
  revalidateTag("section-images", "page");
}

// Theme Actions
export async function getThemeConfig() {
  let config = await (prisma as any).themeConfig.findFirst();
  if (!config) {
    config = await (prisma as any).themeConfig.create({
      data: {
        accentColor: "#C2A76D",
        fontStyle: "serif",
        isDarkMode: false
      }
    });
  }
  return config;
}

export async function updateThemeConfig(data: any) {
  const config = await getThemeConfig();
  await (prisma as any).themeConfig.update({
    where: { id: (config as any).id },
    data
  });
  revalidatePath("/", "page");
  revalidatePath("/admin/content", "page");
  revalidateTag("theme", "page");

}

// Featured Carousel Actions
export async function getCarouselConfig() {
  let config = await (prisma as any).featuredCarouselConfig.findFirst();
  if (!config) {
    config = await (prisma as any).featuredCarouselConfig.create({
      data: {
        autoplay: true,
        autoplayDelay: 4000,
        loop: true,
        buttonStyle: "minimal",
        showNavigation: true,
        slidesPerViewDesktop: 4,
        slidesPerViewTablet: 2,
        slidesPerViewMobile: 1.2
      }
    });
  }
  return config;
}

export async function updateCarouselConfig(data: any) {
  const config = await getCarouselConfig();
  await (prisma as any).featuredCarouselConfig.update({
    where: { id: (config as any).id },
    data
  });
  revalidatePath("/", "page");
  revalidatePath("/admin/content", "page");
  revalidateTag("carousel", "page");

}
