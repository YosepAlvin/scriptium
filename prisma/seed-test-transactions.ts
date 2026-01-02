import { PrismaClient } from "@prisma/client";
import Database from "better-sqlite3";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const db = new Database(dbPath);
const adapter = new PrismaBetterSqlite3({ url: dbPath });

const prisma = new PrismaClient({ adapter });

const indonesianNames = [
  "Budi Santoso", "Siti Aminah", "Joko Widodo", "Lestari Putri", "Andi Wijaya",
  "Rina Pratama", "Agus Setiawan", "Maya Indah", "Hendra Kusuma", "Dewi Lestari",
  "Rizky Ramadhan", "Siska Amelia", "Taufik Hidayat", "Novi Sari", "Eko Prasetyo",
  "Wati Sulastri", "Dedi Kurniawan", "Ani Rahayu", "Fajar Nugraha", "Yanti Susanti",
  "Bambang Heru", "Ratna Sari", "Adi Saputra", "Mira Kurnia", "Indra Jaya",
  "Lina Marlina", "Guntur Pratama", "Santi Wijaya", "Rudi Hartono", "Mega Utami",
  "Surya Kencana", "Yuni Shara", "Aris Munandar", "Dian Sastro", "Doni Tata",
  "Inul Daratista", "Ahmad Dhani", "Krisdayanti", "Anang Hermansyah", "Ashanty",
  "Raffi Ahmad", "Nagita Slavina", "Baim Wong", "Paula Verhoeven", "Atta Halilintar",
  "Aurel Hermansyah", "Deddy Corbuzier", "Ivan Gunawan", "Soimah", "Sule",
  "Andre Taulany", "Nunung", "Azis Gagap", "Parto Patrio", "Denny Cagur",
  "Wendy Cagur", "Narji", "Tukul Arwana", "Vega Darwanti", "Peppy",
  "Raditya Dika", "Pandji Pragiwaksono", "Ernest Prakasa", "Arie Kriting", "Abdur Arsyad",
  "Dodit Mulyanto", "Marshel Widianto", "Kiky Saputri", "Bintang Emon", "Dzawin Nur",
  "Irfan Hakim", "Ramzi", "Gilang Dirga", "Rina Nose", "Ruben Onsu",
  "Sarwendah", "Betrand Peto", "Jordi Onsu", "Thalia Onsu", "Thania Onsu",
  "Prilly Latuconsina", "Reza Rahadian", "Iko Uwais", "Joe Taslim", "Yayan Ruhian",
  "Chelsea Islan", "Pevita Pearce", "Nicholas Saputra", "Vino G Bastian", "Marsha Timothy",
  "Adipati Dolken", "Jefri Nichol", "Angga Yunanda", "Syifa Hadju", "Tissa Biani",
  "Dul Jaelani", "El Rumi", "Al Ghazali", "Maia Estianty", "Mulan Jameela"
];

const indonesianReviews = [
  "Barangnya bagus banget, kualitas premium!",
  "Sesuai ekspektasi, pengiriman cepat.",
  "Bahan sangat nyaman dipakai, mantap.",
  "Desainnya keren dan eksklusif, suka sekali.",
  "Packaging rapi dan aman, terima kasih Scriptum.",
  "Produk berkualitas tinggi, worth it harganya.",
  "Pelayanan admin ramah dan membantu.",
  "Sudah langganan di sini, nggak pernah kecewa.",
  "Ukuran pas banget di badan, detailnya rapi.",
  "Warna sesuai dengan foto, sangat memuaskan."
];

async function main() {
  console.log("Memulai simulasi 100 transaksi...");

  // 1. Ambil semua produk yang ada
  const products = await prisma.product.findMany({
    include: {
      sizes: true,
      category: true,
    }
  });

  if (products.length === 0) {
    console.error("Tidak ada produk di database. Silakan tambah produk dulu.");
    return;
  }

  for (let i = 0; i < 100; i++) {
    const randomName = indonesianNames[i % indonesianNames.length];
    const email = `buyer${i + 1}@example.com`;
    
    // 2. Cari atau buat User
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: randomName,
          email: email,
          role: "BUYER",
        }
      });
    }

    // 3. Pilih produk acak (1-3 produk per transaksi)
    const numItems = Math.floor(Math.random() * 3) + 1;
    const selectedItems = [];
    let orderTotal = 0;

    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      
      // Pilih size acak yang punya stok
      const availableSizes = product.sizes.filter(s => s.stock > 0);
      if (availableSizes.length === 0) continue;
      
      const size = availableSizes[Math.floor(Math.random() * availableSizes.length)];
      const quantity = 1; // 1 unit per item biar nggak langsung habis

      selectedItems.push({
        productId: product.id,
        quantity,
        price: product.price,
        size: size.name,
        color: size.color,
        sizeId: size.id // Simpan untuk update stok nanti
      });

      orderTotal += product.price;
    }

    if (selectedItems.length === 0) continue;

    // 4. Buat Order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: orderTotal,
        status: "COMPLETED",
        shippingAddress: "Jl. Sudirman No. " + (i + 1) + ", Jakarta",
        items: {
          create: selectedItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          }))
        }
      }
    });

    // 5. Update Stok Produk dan Size + Tambah soldCount
    for (const item of selectedItems) {
      // Update Product total stock dan soldCount
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          soldCount: { increment: item.quantity }
        }
      });

      // Update ProductSize stock
      await prisma.productSize.update({
        where: { id: item.sizeId },
        data: {
          stock: { decrement: item.quantity }
        }
      });

      // 6. Buat Review (50% kemungkinan per item)
      if (Math.random() > 0.5) {
        try {
          await prisma.review.create({
            data: {
              userId: user.id,
              productId: item.productId,
              rating: Math.floor(Math.random() * 2) + 4, // Rating 4-5
              comment: indonesianReviews[Math.floor(Math.random() * indonesianReviews.length)]
            }
          });
        } catch (e) {
          // Review mungkin sudah ada karena @@unique([userId, productId])
        }
      }
    }

    if ((i + 1) % 10 === 0) {
      console.log(`Berhasil memproses ${i + 1} transaksi...`);
    }
  }

  console.log("Simulasi selesai. 100 transaksi telah dibuat.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
