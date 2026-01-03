
async function checkProducts() {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const products = await prisma.product.findMany({
      take: 5,
      include: {
        sizes: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log("Product Data Check:");
    products.forEach(p => {
      const totalStock = p.sizes.reduce((acc, size) => acc + size.stock, 0);
      console.log(`- ${p.name}: soldCount=${p.soldCount}, totalStock=${totalStock}, isLimited=${p.isLimited}`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
