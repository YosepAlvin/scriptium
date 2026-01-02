import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { redirect } from "next/navigation";
import AccountView from "./AccountView";

export default async function MyAccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const [orders, addresses] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    (prisma as any).address.findMany({
      where: { userId },
      orderBy: { isDefault: "desc" },
    })
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB]">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h1 className="font-playfair text-5xl font-bold mb-4">My Account</h1>
            <div className="flex items-center gap-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#666666]">
                Welcome back, {session.user.name}
              </p>
              <div className="h-px w-12 bg-border-custom" />
            </div>
          </div>

          <AccountView 
            user={session.user} 
            orders={orders} 
            addresses={addresses} 
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
