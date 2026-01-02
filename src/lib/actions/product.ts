"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { saveImage } from "@/lib/upload";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const priceInput = formData.get("price") as string;
  const price = parseFloat(priceInput.replace(/\./g, ""));
  const stock = parseInt(formData.get("stock") as string);
  const categoryId = formData.get("categoryId") as string;
  const type = formData.get("type") as string;
  const isFeatured = formData.get("isFeatured") === "true";
  
  // Handle new images
  const imageFiles = formData.getAll("images") as File[];
  const imageUrls: string[] = [];
  
  for (const file of imageFiles) {
    if (file.size > 0) {
      const url = await saveImage(file);
      if (url) imageUrls.push(url);
    }
  }
    
  const sizes = formData.get("sizes")
    ? JSON.parse(formData.get("sizes") as string)
    : [];

  const colors = formData.get("colors")
    ? formData.get("colors") as string
    : JSON.stringify([]);

  // Check if it's Limited Edition to lock it automatically
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });
  const isLimitedEdition = category?.name.toLowerCase() === "limited edition";

  const product = await prisma.product.create({
    data: {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description,
      type,
      price,
      stock,
      categoryId,
      images: JSON.stringify(imageUrls),
      colors,
      isFeatured,
      isLocked: isLimitedEdition,
      sizes: {
        create: sizes.map((size: any) => ({
          name: size.name,
          stock: parseInt(size.stock),
          color: size.color,
        })),
      },
    },
  });

  revalidatePath("/", "page");
  revalidatePath("/admin/products", "page");
  revalidatePath("/shop", "page");
  revalidateTag("products", "page");
  revalidateTag("featured-products", "page");

  return product;
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const priceInput = formData.get("price") as string;
  const price = parseFloat(priceInput.replace(/\./g, ""));
  const stock = parseInt(formData.get("stock") as string);
  const categoryId = formData.get("categoryId") as string;
  const type = formData.get("type") as string;
  const isFeatured = formData.get("isFeatured") === "true";
  
  const existingImages = formData.get("existingImages")
    ? JSON.parse(formData.get("existingImages") as string)
    : [];
    
  // Handle new images
  const newImageFiles = formData.getAll("newImages") as File[];
  const newImageUrls: string[] = [];
  
  for (const file of newImageFiles) {
    if (file.size > 0) {
      const url = await saveImage(file);
      if (url) newImageUrls.push(url);
    }
  }

  const allImages = [...existingImages, ...newImageUrls];
    
  const sizes = formData.get("sizes")
    ? JSON.parse(formData.get("sizes") as string)
    : [];

  const colors = formData.get("colors")
    ? formData.get("colors") as string
    : JSON.stringify([]);

  // Check if it's Limited Edition to lock it automatically
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  });
  const isLimitedEdition = category?.name.toLowerCase() === "limited edition";

  // Delete existing sizes first
  await (prisma as any).productSize.deleteMany({ where: { productId: id } });

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description,
      type,
      price,
      stock,
      categoryId,
      images: JSON.stringify(allImages),
      colors,
      isFeatured,
      isLocked: isLimitedEdition,
      sizes: {
        create: sizes.map((size: any) => ({
          name: size.name,
          stock: parseInt(size.stock),
          color: size.color,
        })),
      },
    },
  });

  revalidatePath("/", "page");
  revalidatePath("/admin/products", "page");
  revalidatePath("/shop", "page");
  revalidateTag("products", "page");
  revalidateTag("featured-products", "page");

  return product;
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/", "page");
  revalidatePath("/admin/products", "page");
  revalidatePath("/shop", "page");
  revalidateTag("products", "page");
  revalidateTag("featured-products", "page");
}

export async function toggleProductFeatured(id: string, isFeatured: boolean) {
  await prisma.product.update({
    where: { id },
    data: { isFeatured },
  });

  revalidatePath("/", "page");
  revalidatePath("/admin/products", "page");
  revalidateTag("products", "page");
  revalidateTag("featured-products", "page");
}
