import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { saveImage } from "@/lib/upload";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceInput = formData.get("price") as string;
    const price = parseFloat((priceInput || "0").replace(/\./g, ""));
    const stock = parseInt((formData.get("stock") as string) || "0");
    const categoryId = formData.get("categoryId") as string;
    const type = formData.get("type") as string;
    const isFeatured = formData.get("isFeatured") === "true";

    const imageFiles = formData.getAll("images") as File[];
    const imageUrls: string[] = [];

    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const url = await saveImage(file);
        if (url) imageUrls.push(url);
      }
    }

    const sizes = formData.get("sizes")
      ? JSON.parse(formData.get("sizes") as string)
      : [];

    const colors = formData.get("colors")
      ? (formData.get("colors") as string)
      : JSON.stringify([]);

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
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

    return NextResponse.json({ success: true, productId: product.id });
  } catch (error: any) {
    console.error("API POST /api/products error:", error);
    const message = error?.message || "Terjadi kesalahan saat membuat produk.";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

