"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function sendChatMessage(content: string, targetUserId?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const senderId = (session.user as any).id;
  const role = (session.user as any).role;
  const isAdmin = role === "ADMIN";

  // Jika admin mengirim pesan, targetUserId harus ada (ID pembeli)
  // Jika pembeli mengirim pesan, userId adalah ID pembeli itu sendiri
  const userId = isAdmin ? (targetUserId as string) : senderId;

  if (!userId) throw new Error("Target user ID is required for admin");

  if (!(prisma as any).chatMessage) {
    console.error("Prisma chatMessage model is missing!");
    throw new Error("Chat system is currently unavailable.");
  }

  const message = await (prisma as any).chatMessage.create({
    data: {
      content,
      senderId,
      isAdmin,
      userId,
    },
  });

  revalidatePath("/admin/chats");
  revalidatePath("/"); // Untuk mengupdate floating chat di semua halaman
  return message;
}

export async function getChatMessages(targetUserId?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return [];

  const currentUserId = (session.user as any).id;
  const role = (session.user as any).role;
  const isAdmin = role === "ADMIN";

  // Admin melihat chat user tertentu, User melihat chat dirinya sendiri
  const userId = isAdmin ? targetUserId : currentUserId;

  if (!userId) return [];

  // Debugging: Log available models if chatMessage is missing
  if (!(prisma as any).chatMessage) {
    console.error("Prisma chatMessage model is missing! Available models:", Object.keys(prisma).filter(k => !k.startsWith('$')));
    throw new Error("Chat system is currently unavailable due to database sync issues. Please contact administrator.");
  }

  return await (prisma as any).chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

export async function getAdminChatList() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (!(prisma as any).chatMessage) {
    console.error("Prisma chatMessage model is missing!");
    return [];
  }

  // Ambil daftar user yang pernah chat, diurutkan berdasarkan pesan terbaru
  const users = await prisma.user.findMany({
    where: {
      messages: { some: {} },
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return users.sort((a, b) => {
    const lastMsgA = (a.messages[0] as any)?.createdAt?.getTime() || 0;
    const lastMsgB = (b.messages[0] as any)?.createdAt?.getTime() || 0;
    return lastMsgB - lastMsgA;
  });
}
