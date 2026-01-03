
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (key !== 'scriptium-fix') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          in: ["Hoddie Scriptium X Leaks", "Jaket Jeans Scriptium X Leaks"]
        }
      },
      include: {
        sizes: true
      }
    });

    if (products.length === 0) {
      return NextResponse.json({ message: "Products not found" });
    }

    // Get a user for reviews
    const users = await prisma.user.findMany({ take: 1 });
    if (users.length === 0) {
        // Create a dummy user if none exists
        const dummyUser = await prisma.user.create({
            data: {
                name: "Scriptium Fan",
                email: "fan@scriptium.com",
                role: "BUYER"
            }
        });
        users.push(dummyUser);
    }
    const reviewer = users[0];

    const results = [];

    for (const product of products) {
      // 1. Set Stock to 0
      await prisma.productSize.updateMany({
        where: { productId: product.id },
        data: { stock: 0 }
      });

      // 2. Clear old reviews
      await prisma.review.deleteMany({
        where: { productId: product.id }
      });

      // 3. Create 25 reviews
      const comments = [
        "Kualitas bahan sangat bagus!", "Desainnya keren banget, limited edition emang beda.",
        "Pas banget di badan, suka!", "Pengiriman cepat dan packing aman.",
        "Worth it banget harganya.", "Sangat eksklusif, bangga punya ini.",
        "Detailnya luar biasa.", "Nyaman dipakai seharian.",
        "Semoga ada restock lagi, mau beli buat kado.", "Top markotop!",
        "Bahan tebal tapi adem.", "Sablonnya rapi.",
        "Ukurannya sesuai size chart.", "Gak nyesel beli ini.",
        "Mantap jiwa!", "Recommended seller.",
        "Suka banget sama konsepnya.", "Jaketnya hangat.",
        "Hoodienya tebal.", "Keren parah.",
        "Solid build quality.", "Premium feel.",
        "Must have item!", "Auto ganteng pake ini.", "Terbaik!"
      ];

      const reviewsData = [];
      for (let i = 0; i < 25; i++) {
        reviewsData.push({
          productId: product.id,
          userId: reviewer.id,
          rating: 5,
          comment: comments[i % comments.length],
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000))
        });
      }

      await prisma.review.createMany({
        data: reviewsData
      });
      
      // Update sold count
      await prisma.product.update({
        where: { id: product.id },
        data: { soldCount: 50 + Math.floor(Math.random() * 50) }
      });

      results.push(`Processed ${product.name}: Stock 0, Reviews 25`);
    }

    return NextResponse.json({ success: true, results });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
