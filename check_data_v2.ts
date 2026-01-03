
import { prisma } from './src/lib/prisma';

async function main() {
  try {
    const products = await prisma.product.findMany({
      take: 5,
      select: { name: true, soldCount: true, sizes: true },
      orderBy: { createdAt: 'desc' }
    });
    console.log(JSON.stringify(products, null, 2));
  } catch (e) {
    console.error(e);
  }
}
main();
