"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addReview(productId: string, rating: number, comment: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  // Verify purchase (must have at least one completed order with this product)
  // For now we check if they ordered it at all, regardless of status for simplicity, 
  // or strictly check for non-cancelled orders if status allows.
  const hasPurchased = await prisma.order.count({
    where: {
      userId,
      items: { some: { productId } }
    }
  });

  if (!hasPurchased) {
    throw new Error("Anda harus membeli produk ini terlebih dahulu untuk memberikan ulasan.");
  }

  // Check existing review
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  });

  if (existingReview) {
    throw new Error("Anda sudah memberikan ulasan untuk produk ini.");
  }

  await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      comment
    }
  });

  // Revalidate product page
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { slug: true }
  });

  if (product) {
    revalidatePath(`/products/${product.slug}`);
  }
}
