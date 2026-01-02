import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const categories = [
    { 
      name: "T-Shirts", 
      slug: "t-shirts", 
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
      description: "Essential minimalist t-shirts for your daily wear.",
      isFeatured: true
    },
    { 
      name: "Pants", 
      slug: "pants", 
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop",
      description: "Comfortable and stylish pants for any occasion.",
      isFeatured: false
    },
    { 
      name: "Outerwear", 
      slug: "outerwear", 
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
      description: "Premium outerwear to keep you warm and stylish.",
      isFeatured: false
    },
    { 
      name: "Accessories", 
      slug: "accessories", 
      image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=800&auto=format&fit=crop",
      description: "Curated accessories to complete your look.",
      isFeatured: true
    },
    { 
      name: "Tumblers", 
      slug: "tumblers", 
      image: "https://images.unsplash.com/photo-1623329010995-576366d1a89d?q=80&w=800&auto=format&fit=crop",
      description: "Modern, functional, and lifestyle-focused tumblers with a matte finish and minimalist design.",
      isFeatured: false
    },
    { 
      name: "Stationery", 
      slug: "stationery", 
      image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=800&auto=format&fit=crop",
      description: "Intellectual and calm writing tools, notebooks, and journals for your daily thoughts.",
      isFeatured: false
    },
    { 
      name: "Limited Edition", 
      slug: "limited-edition", 
      image: "https://images.unsplash.com/photo-1511511450040-677116ff389e?q=80&w=800&auto=format&fit=crop",
      description: "Exclusive, limited quantity premium products with a luxury editorial aesthetic.",
      isFeatured: true
    },
  ];

  for (const category of categories) {
    // Re-triggering type check
    await (prisma.category as any).upsert({
      where: { slug: category.slug },
      update: { 
        image: category.image,
        description: category.description,
        isFeatured: category.isFeatured
      },
      create: category,
    });
  }

  // Seed Admin User
  const adminEmail = "admin@scriptum.com";
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin Scriptum",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Categories and Admin seeded successfully.");

  // Seed some products with sizes
  const tshirtCat = await prisma.category.findUnique({ where: { slug: "t-shirts" } });
  const pantsCat = await prisma.category.findUnique({ where: { slug: "pants" } });
  const outerwearCat = await prisma.category.findUnique({ where: { slug: "outerwear" } });
  const accCat = await prisma.category.findUnique({ where: { slug: "accessories" } });
  const tumblerCat = await prisma.category.findUnique({ where: { slug: "tumblers" } });
  const stationeryCat = await prisma.category.findUnique({ where: { slug: "stationery" } });
  const limitedCat = await prisma.category.findUnique({ where: { slug: "limited-edition" } });

  if (tshirtCat && pantsCat && outerwearCat && accCat && tumblerCat && stationeryCat && limitedCat) {
    // Delete existing sizes for products we are about to seed to avoid duplicates/stale data
    const productSlugs = [
      "classic-essential-tee", "cigarrete", "slim-fit-chinos", "minimalist-bomber-jacket",
      "leather-wallet", "matte-black-tumbler", "minimalist-notebook", "luxury-watch-limited"
    ];
    for (const slug of productSlugs) {
      const product = await prisma.product.findUnique({ where: { slug } });
      if (product) {
        await (prisma as any).productSize.deleteMany({ where: { productId: product.id } });
      }
    }

    // T-Shirts
    await (prisma.product as any).upsert({
      where: { slug: "classic-essential-tee" },
      update: {},
      create: {
        name: "Classic Essential Tee",
        slug: "classic-essential-tee",
        description: "Premium organic cotton t-shirt with a perfect fit.",
        price: 249000,
        stock: 550,
        isFeatured: true,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop"
        ]),
        categoryId: tshirtCat.id,
        sizes: {
          create: [
            { name: "S", stock: 100 },
            { name: "M", stock: 200 },
            { name: "L", stock: 100 },
            { name: "XL", stock: 150 },
          ]
        }
      }
    });

    await (prisma.product as any).upsert({
      where: { slug: "cigarrete" },
      update: {},
      create: {
        name: "Cigarrete",
        slug: "cigarrete",
        description: "hidup terkadang penuh sebuah makna yang luar biasa, sekedar merokok sambil menulis sebuah cerita benar benar sangat mengasyikan",
        price: 200000,
        stock: 400,
        isFeatured: true,
        images: JSON.stringify(["https://images.unsplash.com/photo-1550995694-3f5f4a7b1bd2?q=80&w=800&auto=format&fit=crop"]),
        categoryId: tshirtCat.id,
        sizes: {
          create: [
            { name: "S", color: "HITAM", stock: 50 },
            { name: "M", color: "HITAM", stock: 50 },
            { name: "L", color: "HITAM", stock: 50 },
            { name: "XL", color: "HITAM", stock: 50 },
          ]
        },
        colors: JSON.stringify(["HITAM", "PUTIH", "NAVY"])
      }
    });

    // Pants
    await (prisma.product as any).upsert({
      where: { slug: "slim-fit-chinos" },
      update: {},
      create: {
        name: "Slim Fit Chinos",
        slug: "slim-fit-chinos",
        description: "Versatile chinos for any occasion.",
        price: 499000,
        stock: 300,
        isFeatured: true,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1473966968600-fa804b86d27b?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop"
        ]),
        categoryId: pantsCat.id,
        sizes: {
          create: [
            { name: "28", stock: 100 },
            { name: "30", stock: 100 },
            { name: "32", stock: 100 },
          ]
        }
      }
    });

    // Outerwear
    await (prisma.product as any).upsert({
      where: { slug: "minimalist-bomber-jacket" },
      update: {},
      create: {
        name: "Minimalist Bomber Jacket",
        slug: "minimalist-bomber-jacket",
        description: "Clean and modern bomber jacket.",
        price: 899000,
        stock: 150,
        isFeatured: true,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop"
        ]),
        categoryId: outerwearCat.id,
        sizes: {
          create: [
            { name: "M", color: "NAVY", stock: 25 },
            { name: "L", color: "NAVY", stock: 25 },
            { name: "XL", color: "NAVY", stock: 25 },
          ]
        },
        colors: JSON.stringify(["NAVY", "BLACK"])
      }
    });

    // Accessories
    await (prisma.product as any).upsert({
      where: { slug: "leather-wallet" },
      update: {},
      create: {
        name: "Minimalist Leather Wallet",
        slug: "leather-wallet",
        description: "Handcrafted genuine leather wallet with a slim profile.",
        price: 350000,
        stock: 100,
        isFeatured: true,
        images: JSON.stringify(["https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop"]),
        categoryId: accCat.id,
        sizes: { create: [{ name: "One Size", stock: 100 }] }
      }
    });

    // Tumblers
    await (prisma.product as any).upsert({
      where: { slug: "matte-black-tumbler" },
      update: {},
      create: {
        name: "Matte Black Lifestyle Tumbler",
        slug: "matte-black-tumbler",
        description: "Double-walled vacuum insulated tumbler for hot and cold drinks.",
        price: 275000,
        stock: 200,
        isFeatured: true,
        images: JSON.stringify(["https://images.unsplash.com/photo-1517254456976-ee8682099819?q=80&w=800&auto=format&fit=crop"]),
        categoryId: tumblerCat.id,
        sizes: { create: [{ name: "500ml", stock: 200 }] }
      }
    });

    // Stationery
    await (prisma.product as any).upsert({
      where: { slug: "minimalist-notebook" },
      update: {},
      create: {
        name: "Zen Minimalist Notebook",
        slug: "minimalist-notebook",
        description: "Premium cream paper with a soft-touch cover for your daily reflections.",
        price: 145000,
        stock: 300,
        isFeatured: true,
        images: JSON.stringify(["https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=800&auto=format&fit=crop"]),
        categoryId: stationeryCat.id,
        sizes: { create: [{ name: "A5", stock: 300 }] }
      }
    });

    // Limited Edition
    await (prisma.product as any).upsert({
      where: { slug: "luxury-watch-limited" },
      update: {},
      create: {
        name: "Heritage Chronograph - Limited Edition",
        slug: "luxury-watch-limited",
        description: "An exclusive timepiece crafted with precision and elegance. Individually numbered.",
        price: 4500000,
        stock: 50,
        isFeatured: true,
        images: JSON.stringify(["https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop"]),
        categoryId: limitedCat.id,
        sizes: { create: [{ name: "40mm", stock: 50 }] }
      }
    });

    // Re-adding user's previous products based on existing uploads
    await (prisma.product as any).upsert({
      where: { slug: "scriptum-notebook-jilid-1" },
      update: {},
      create: {
        name: "Scriptum Notebook Jilid 1",
        slug: "scriptum-notebook-jilid-1",
        description: "Edisi pertama dari koleksi notebook eksklusif Scriptum.",
        price: 185000,
        stock: 100,
        isFeatured: true,
        images: JSON.stringify([
          "/uploads/1767205203345-k2n2zl-jilid-1-black.png",
          "/uploads/1767205203348-ev52kn-jilid-1cream.png"
        ]),
        categoryId: stationeryCat.id,
        sizes: { create: [{ name: "A5", stock: 100 }] },
        colors: JSON.stringify(["Black", "Cream"])
      }
    });

    await (prisma.product as any).upsert({
      where: { slug: "scriptum-notebook-jilid-2" },
      update: {},
      create: {
        name: "Scriptum Notebook Jilid 2",
        slug: "scriptum-notebook-jilid-2",
        description: "Edisi kedua dengan desain yang lebih minimalis dan elegan.",
        price: 195000,
        stock: 80,
        isFeatured: true,
        images: JSON.stringify([
          "/uploads/1767257253822-7qkka9-jilid-2-black.png",
          "/uploads/1767257253825-4odu29-jilid-2-white.png"
        ]),
        categoryId: stationeryCat.id,
        sizes: { create: [{ name: "A5", stock: 80 }] },
        colors: JSON.stringify(["Black", "White"])
      }
    });
  }

  console.log("Products with sizes seeded successfully.");

  // --- NEW SEED LOGIC: 100 BUYERS, ORDERS, AND REVIEWS ---

  console.log("Seeding 100 buyers...");
  const buyerPassword = await bcrypt.hash("buyer123", 10);
  
  const provinces = ["DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Banten", "DI Yogyakarta"];
  const cities = {
    "DKI Jakarta": ["Jakarta Selatan", "Jakarta Pusat", "Jakarta Barat", "Jakarta Timur", "Jakarta Utara"],
    "Jawa Barat": ["Bandung", "Bogor", "Depok", "Bekasi", "Sukabumi"],
    "Jawa Tengah": ["Semarang", "Surakarta", "Magelang", "Salatiga"],
    "Jawa Timur": ["Surabaya", "Malang", "Sidoarjo", "Gresik"],
    "Banten": ["Tangerang", "Tangerang Selatan", "Serang"],
    "DI Yogyakarta": ["Yogyakarta", "Sleman", "Bantul"]
  };

  const indonesianNames = [
    "Arif", "Rudi", "Siti", "Paijo", "Paino", "Budi", "Agus", "Iwan", "Eko", "Dedi",
    "Sari", "Dewi", "Ani", "Lani", "Maya", "Indah", "Putri", "Rina", "Wati", "Yanti",
    "Hendra", "Bambang", "Slamet", "Joko", "Mulyono", "Hartono", "Suranto", "Supardi", "Sutrisno", "Sugeng",
    "Ratna", "Sri", "Endang", "Sumiyati", "Suryani", "Tatik", "Haryati", "Nurhayati", "Aminah", "Siti Aminah",
    "Andi", "Anto", "Asep", "Cecep", "Dede", "Denny", "Donny", "Dicky", "Dody", "Dicky",
    "Fitri", "Gita", "Hana", "Ira", "Jihan", "Kartika", "Lestari", "Mila", "Nadia", "Olivia",
    "Prasetyo", "Qori", "Ridwan", "Setiawan", "Taufik", "Umar", "Vicky", "Wawan", "Xena", "Yuda",
    "Zul", "Aditya", "Bayu", "Candra", "Dimas", "Erik", "Fajar", "Galih", "Hafiz", "Ilham",
    "Jaka", "Kurniawan", "Lukman", "Maulana", "Nugroho", "Oky", "Pandu", "Rian", "Satria", "Tio",
    "Utomo", "Vino", "Wisnu", "Yoga", "Zaki", "Bagas", "Dafa", "Farhan", "Guntur", "Hanif"
  ];

  const buyersData = Array.from({ length: 100 }).map((_, i) => {
    const firstName = indonesianNames[i % indonesianNames.length];
    const lastName = ["Hidayat", "Saputra", "Wijaya", "Kusuma", "Pratama", "Santoso", "Lestari", "Putra", "Putri", "Sari"][Math.floor(Math.random() * 10)];
    return {
      name: `${firstName} ${lastName}`,
      email: `buyer${i + 1}@example.com`,
      password: buyerPassword,
      role: "BUYER",
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)), // Random date in last 30 days
    };
  });

  for (const buyer of buyersData) {
    const createdBuyer = await prisma.user.upsert({
      where: { email: buyer.email },
      update: {
        name: buyer.name,
      },
      create: buyer,
    });

    // Seed Address for each buyer
    const province = provinces[Math.floor(Math.random() * provinces.length)];
    // @ts-ignore
    const city = cities[province][Math.floor(Math.random() * cities[province].length)];
    
    // @ts-ignore
    await prisma.address.create({
      data: {
        userId: createdBuyer.id,
        name: "Rumah",
        recipient: createdBuyer.name || "Penerima",
        phone: "0812" + Math.floor(Math.random() * 100000000),
        street: "Jl. Contoh No. " + Math.floor(Math.random() * 100),
        city: city,
        province: province,
        postalCode: String(Math.floor(Math.random() * 90000) + 10000),
        isDefault: true
      }
    });
  }

  const allBuyers = await prisma.user.findMany({ where: { role: "BUYER" } });
  const allProducts = await prisma.product.findMany();

  console.log("Generating random orders and reviews...");
  const reviewTemplates = [
    "Bahannya enak dan sablonnya rapi.",
    "Desainnya simpel tapi keliatan mahal.",
    "Ukuran pas, bakal repeat order.",
    "Kualitas premium, pengiriman cepat banget.",
    "Sangat puas dengan kualitas kainnya, adem.",
    "Warnanya sesuai foto, jahitan rapi.",
    "Produk original, packing aman.",
    "Sesuai ekspektasi, mantap Scriptum!",
    "Nyaman dipakai seharian, desainnya oke punya.",
    "Gak nyesel beli di sini, respon penjual cepat.",
  ];

  for (const buyer of allBuyers) {
    // Each buyer buys 1-5 random products
    const numOrders = Math.floor(Math.random() * 3) + 1; // 1-3 orders per user for realism
    
    for (let i = 0; i < numOrders; i++) {
      const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
      const orderItems = [];
      let orderTotal = 0;

      // Select random products for this order
      const selectedProducts = [...allProducts]
        .sort(() => 0.5 - Math.random())
        .slice(0, numItems);

      for (const product of selectedProducts) {
        const qty = Math.floor(Math.random() * 2) + 1;
        orderItems.push({
          productId: product.id,
          quantity: qty,
          price: product.price,
        });
        orderTotal += product.price * qty;
      }

      const order = await prisma.order.create({
        data: {
          userId: buyer.id,
          total: orderTotal,
          status: Math.random() > 0.2 ? "COMPLETED" : "SHIPPED", // Most are completed
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 15 * 24 * 60 * 60 * 1000)),
          items: {
            create: orderItems,
          },
        },
      });

      // Potentially leave a review for one of the products in the order
      if (order.status === "COMPLETED" && Math.random() > 0.4) {
        const productToReview = selectedProducts[0];
        try {
          // @ts-ignore - Prisma types might not be updated in IDE
          await prisma.review.upsert({
            where: {
              userId_productId: {
                userId: buyer.id,
                productId: productToReview.id,
              },
            },
            update: {},
            create: {
              userId: buyer.id,
              productId: productToReview.id,
              rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
              comment: reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)],
              createdAt: new Date(order.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days after order
            },
          });
        } catch (e) {
          // Ignore unique constraint errors if buyer already reviewed this product
        }
      }
    }
  }

  // Update soldCount for all products based on COMPLETED orders
  console.log("Updating product sold counts...");
  for (const product of allProducts) {
    const soldItems = await prisma.orderItem.findMany({
      where: {
        productId: product.id,
        order: {
          status: "COMPLETED",
        },
      },
    });
    const totalSold = soldItems.reduce((acc, item) => acc + item.quantity, 0);
    // @ts-ignore - Prisma types might not be updated in IDE
    await prisma.product.update({
      where: { id: product.id },
      data: { 
        // @ts-ignore
        soldCount: totalSold 
      },
    });
  }

  // Seed Hero Data
  console.log("Seeding hero data...");
  // @ts-ignore
  await prisma.hero.createMany({
    data: [
      {
        title: "Esensi Kesederhanaan",
        subtitle: "Harmoni Tradisi dalam Gaya Hidup Modern",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop",
        ctaText: "Jelajahi Koleksi",
        ctaLink: "/shop",
        order: 0,
        isActive: true
      },
      {
        title: "Kualitas Tanpa Kompromi",
        subtitle: "Setiap Serat Memiliki Cerita",
        image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2000&auto=format&fit=crop",
        ctaText: "Lihat Katalog",
        ctaLink: "/shop",
        order: 1,
        isActive: true
      },
      {
        title: "Koleksi Musim Dingin",
        subtitle: "Kehangatan dalam Balutan Estetika",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop",
        ctaText: "Belanja Sekarang",
        ctaLink: "/shop",
        order: 2,
        isActive: true
      }
    ]
  });

  // Seed Theme Config
  console.log("Seeding theme config...");
  // @ts-ignore
  await prisma.themeConfig.create({
    data: {
      accentColor: "#C2A76D",
      fontStyle: "serif",
      isDarkMode: false
    }
  });

  // Seed Section Images
  console.log("Seeding section images...");
  // @ts-ignore
  await prisma.sectionImage.createMany({
    data: [
      {
        section: "featured",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000"
      },
      {
        section: "brand-story",
        image: "https://images.unsplash.com/photo-1490623970972-ae8bb3da443e?q=80&w=2000&auto=format&fit=crop"
      }
    ]
  });

  console.log("Complex seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
