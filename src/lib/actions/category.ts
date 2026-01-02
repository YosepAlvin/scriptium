"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  await prisma.category.create({
    data: { name, slug },
  });

  revalidatePath("/admin/categories", "page");
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  await prisma.category.update({
    where: { id },
    data: { name, slug },
  });

  revalidatePath("/admin/categories", "page");
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/admin/categories", "page");
}
