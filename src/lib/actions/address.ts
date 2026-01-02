"use server";

import { prisma as prismaClient } from "@/lib/prisma";
const prisma = prismaClient as any;
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getAddresses() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return [];

  const userId = (session.user as any).id;
  return await prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: "desc" },
  });
}

export async function createAddress(data: {
  name: string;
  recipient: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  // If this is the first address, make it default
  const addressCount = await prisma.address.count({ where: { userId } });
  const isDefault = addressCount === 0 ? true : data.isDefault || false;

  // If making default, unset other defaults
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      ...data,
      isDefault,
      userId,
    },
  });

  revalidatePath("/my-account", "page");
  return address;
}

export async function updateAddress(id: string, data: {
  name: string;
  recipient: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  // Verify ownership
  const existing = await prisma.address.findUnique({
    where: { id },
  });

  if (!existing || existing.userId !== userId) {
    throw new Error("Address not found or unauthorized");
  }

  // If making default, unset other defaults
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.update({
    where: { id },
    data,
  });

  revalidatePath("/my-account");
  return address;
}

export async function deleteAddress(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  // Verify ownership
  const existing = await prisma.address.findUnique({
    where: { id },
  });

  if (!existing || existing.userId !== userId) {
    throw new Error("Address not found or unauthorized");
  }

  await prisma.address.delete({
    where: { id },
  });

  // If we deleted the default address, make the most recent one default
  if (existing.isDefault) {
    const nextAddress = await prisma.address.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    if (nextAddress) {
      await prisma.address.update({
        where: { id: nextAddress.id },
        data: { isDefault: true },
      });
    }
  }

  revalidatePath("/my-account");
}

export async function setDefaultAddress(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;

  // Verify ownership
  const existing = await prisma.address.findUnique({
    where: { id },
  });

  if (!existing || existing.userId !== userId) {
    throw new Error("Address not found or unauthorized");
  }

  // Unset all defaults for this user
  await prisma.address.updateMany({
    where: { userId },
    data: { isDefault: false },
  });

  // Set this one as default
  await prisma.address.update({
    where: { id },
    data: { isDefault: true },
  });

  revalidatePath("/my-account");
}
