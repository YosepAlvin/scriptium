import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-24">
            <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Kisah Scriptum
            </h1>
            <div className="w-12 h-[1px] bg-[#1A1A1A] mx-auto mb-10" />
            <p className="max-w-2xl mx-auto text-[#666666] leading-relaxed text-sm md:text-base">
              Lahir dari apresiasi terhadap keindahan yang tenang dan desain yang bermakna. 
              Kami percaya bahwa apa yang kita kenakan harus mencerminkan nilai-nilai yang kita pegang.
            </p>
          </div>

          {/* Philosophy Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
            <div className="relative h-[600px] bg-[#F5F5F5]">
              <Image
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop"
                alt="Studio Minimalis"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-8">
              <span className="text-[10px] uppercase tracking-[0.5em] text-[#8B7E74]">Filosofi Desain</span>
              <h2 className="font-playfair text-3xl font-bold leading-tight">
                Kesederhanaan adalah kecanggihan tertinggi.
              </h2>
              <p className="text-[#666666] leading-relaxed">
                Di Scriptum, kami tidak mengejar tren yang cepat berlalu. Sebaliknya, kami fokus pada pembuatan 
                barang-barang esensial yang tahan lama, baik dari segi kualitas bahan maupun estetika desain. 
                Setiap detail dipikirkan dengan matang, setiap bahan dipilih dengan hati-hati.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3">Bahan Premium</h4>
                  <p className="text-xs text-[#999999] leading-relaxed">
                    Hanya menggunakan serat alami dan bahan berkualitas tinggi yang ramah lingkungan.
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold mb-3">Produksi Etis</h4>
                  <p className="text-xs text-[#999999] leading-relaxed">
                    Bekerja sama dengan pengrajin lokal untuk memastikan setiap potongan dibuat dengan adil.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Commitment Section */}
          <div className="bg-[#F7F3F0] p-12 md:p-24 text-center">
            <h2 className="font-playfair text-3xl font-bold mb-10">Komitmen Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="text-2xl font-playfair italic text-[#8B7E74]">01</div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">Kualitas Tanpa Kompromi</h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Kami menguji setiap produk untuk memastikan daya tahan jangka panjang bagi penggunanya.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-2xl font-playfair italic text-[#8B7E74]">02</div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">Transparansi Penuh</h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Jujur tentang asal bahan dan proses pembuatan di balik setiap koleksi kami.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-2xl font-playfair italic text-[#8B7E74]">03</div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold">Minimalisme Modern</h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Membantu Anda membangun lemari pakaian yang lebih efisien namun tetap elegan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
