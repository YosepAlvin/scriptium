const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing Prisma chatMessage access...');
    const count = await prisma.chatMessage.count();
    console.log('Success! chatMessage count:', count);
  } catch (error) {
    console.error('Error accessing chatMessage:', error.message);
    if (error.message.includes('undefined')) {
      console.log('prisma.chatMessage is indeed undefined');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
