
import { prisma } from './src/lib/prisma'

async function main() {
  const products = await prisma.product.findMany({ take: 1 })
  if (products.length === 0) {
    console.log('No products found')
    return
  }

  const id = products[0].id
  console.log('Updating product:', id)

  try {
    const updated = await (prisma.product as any).update({
      where: { id },
      data: {
        sizes: {
          create: [
            { name: 'TEST', color: 'RED', stock: 1 }
          ]
        }
      }
    })
    console.log('Update successful:', updated.id)
  } catch (error) {
    console.error('Update failed:', error)
  } finally {
    // Better not close it if it's the global one, but for a script it's fine
  }
}

main()
