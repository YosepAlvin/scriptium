
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (key !== 'scriptium-fix') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const mode = searchParams.get('mode');

  // MODE CHECK: Inspect product data
  if (mode === 'check') {
    const products = await prisma.product.findMany({
      include: {
        sizes: true,
        _count: {
          select: { reviews: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const report = products.map(p => ({
      name: p.name,
      soldCount: p.soldCount,
      totalStock: p.sizes.reduce((acc, s) => acc + s.stock, 0) + (p.stock || 0),
      reviewCount: p._count.reviews,
      isLimited: p.name.includes('Scriptum X Leaks')
    }));

    return NextResponse.json({ 
      message: "Product Data Report", 
      data: report 
    });
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

    const results = [];
    
    // Comments pool
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

    // Create or get dummy users first
    const dummyUsers = [];
    for (let i = 0; i < 25; i++) {
      const email = `reviewer${i + 1}@scriptium-dummy.com`;
      let user = await prisma.user.findUnique({ where: { email } });
      
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: `Reviewer ${i + 1}`,
            email: email,
            role: 'BUYER',
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=Reviewer${i+1}` // Random avatar
          }
        });
      }
      dummyUsers.push(user);
    }

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

      // 3. Create 25 reviews using unique users
      const reviewsData = dummyUsers.map((user, index) => ({
        productId: product.id,
        userId: user.id,
        rating: 5,
        comment: comments[index % comments.length],
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000 * (index + 1))) // Random date
      }));

      await prisma.review.createMany({
        data: reviewsData
      });
      
      // Update sold count
      await prisma.product.update({
        where: { id: product.id },
        data: { soldCount: 50 + Math.floor(Math.random() * 50) }
      });

      results.push(`Processed ${product.name}: Stock 0, Reviews 25 (from ${dummyUsers.length} unique users)`);
    }

    return NextResponse.json({ success: true, results });

  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
