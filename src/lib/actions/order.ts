"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createOrder(data: {
  items: { 
    productId: string; 
    quantity: number; 
    price: number;
    size?: string;
    color?: string;
  }[];
  total: number;
  address: string;
  paymentMethod: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = (session.user as any).id;

  const order = await prisma.order.create({
    data: {
      userId,
      total: data.total,
      status: "PENDING",
      shippingAddress: data.address,
      paymentMethod: data.paymentMethod,
      paymentStatus: "UNPAID",
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
        })),
      },
    },
  });

  // Update stock for each product
  for (const item of data.items) {
    // 1. Decrement main product stock
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    });

    // 2. If size or color is specified, decrement specific variant stock
    if (item.size || item.color) {
      try {
        await (prisma as any).productSize.updateMany({
          where: {
            productId: item.productId,
            name: item.size || undefined,
            color: item.color || null,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      } catch (error) {
        console.error(`Failed to update stock for variant ${item.color}-${item.size} of product ${item.productId}:`, error);
      }
    }
  }

  revalidatePath("/admin/orders", "page");
  revalidatePath("/my-account", "page");

  return order;
}

export async function updateOrderStatus(orderId: string, status: string, type: "order" | "payment" = "order") {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Fetch current order status to prevent double counting
  const currentOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (!currentOrder) {
    throw new Error("Order not found");
  }

  if (type === "order") {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  } else {
    // If updating payment status
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: status },
    });

    // If payment becomes PAID and it wasn't before, increment soldCount
    if (status === "PAID" && currentOrder.paymentStatus !== "PAID") {
      for (const item of currentOrder.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            soldCount: {
              increment: item.quantity
            }
          }
        });
      }
    } else if (status !== "PAID" && currentOrder.paymentStatus === "PAID") {
      // If payment status changes FROM PAID to something else, decrement soldCount
      for (const item of currentOrder.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            soldCount: {
              decrement: item.quantity
            }
          }
        });
      }
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath("/my-account");
  revalidatePath("/admin/products"); // Revalidate products to show updated soldCount
  revalidatePath("/"); // Revalidate home where products are shown
}
