import { prisma } from "./src/lib/prisma";

async function check() {
  try {
    const keys = Object.keys(prisma);
    console.log("Prisma keys:", keys);
    
    // Check if hero exists
    if ((prisma as any).hero) {
      console.log("Hero model found!");
      const heroes = await (prisma as any).hero.findMany();
      console.log("Heroes count:", heroes.length);
    } else {
      console.log("Hero model NOT found on prisma object.");
    }
  } catch (error) {
    console.error("Error during check:", error);
  } finally {
    process.exit();
  }
}

check();
