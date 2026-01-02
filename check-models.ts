import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function check() {
  console.log("Available models on prisma client:");
  const models = Object.keys(prisma).filter(key => !key.startsWith("_") && typeof (prisma as any)[key] === 'object');
  console.log(models);
  
  if ((prisma as any).featuredCarouselConfig) {
    console.log("featuredCarouselConfig EXISTS");
  } else {
    console.log("featuredCarouselConfig DOES NOT EXIST");
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
