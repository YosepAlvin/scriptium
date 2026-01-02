import { prisma } from "./src/lib/prisma";

async function check() {
  console.log("Checking prisma client models...");
  const p = prisma as any;
  
  const models = [
    'user',
    'product',
    'category',
    'order',
    'hero',
    'themeConfig',
    'sectionImage',
    'featuredCarouselConfig'
  ];

  for (const model of models) {
    console.log(`${model}: ${p[model] ? 'EXISTS' : 'MISSING'}`);
  }
}

check().catch(console.error).finally(() => (prisma as any).$disconnect?.());
