import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Truck, ShieldCheck, Clock, Globe } from "lucide-react";

export default function ShippingPage() {
  const policies = [
    {
      icon: <Clock className="text-accent" size={32} />,
      title: "Waktu Pemrosesan",
      description: "Setiap pesanan melewati proses kurasi kualitas selama 1-2 hari kerja sebelum diserahkan ke pihak logistik."
    },
    {
      icon: <Truck className="text-accent" size={32} />,
      title: "Kurasi Logistik",
      description: "Kami bekerja sama dengan mitra pengiriman terpercaya untuk memastikan setiap paket sampai dalam kondisi sempurna."
    },
    {
      icon: <ShieldCheck className="text-accent" size={32} />,
      title: "Asuransi Pengiriman",
      description: "Semua pengiriman Scriptum dilindungi oleh asuransi penuh untuk menjamin keamanan investasi Anda."
    },
    {
      icon: <Globe className="text-accent" size={32} />,
      title: "Jangkauan Nasional",
      description: "Kami melayani pengiriman ke seluruh penjuru Nusantara dengan standar pengemasan premium."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-paper">
      <Navbar />
      <main className="flex-grow pt-40 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <span className="text-[10px] uppercase tracking-[0.6em] text-accent mb-4 block">Logistik Terkurasi</span>
            <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6 text-[#2C2C2C]">Pengiriman & Warisan</h1>
            <div className="w-24 h-[1px] bg-accent mx-auto mb-8 opacity-40" />
            <p className="font-playfair italic text-[#666666] text-lg max-w-2xl mx-auto">
              "Memastikan setiap bagian dari tradisi sampai di tangan Anda dengan rasa hormat yang sama seperti saat dibuat."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-32">
            {policies.map((policy, index) => (
              <div key={index} className="p-10 border border-border-custom bg-white relative group hover:shadow-2xl transition-all duration-700">
                <div className="mb-8 transform group-hover:scale-110 transition-transform duration-500">
                  {policy.icon}
                </div>
                <h3 className="font-playfair text-xl text-[#2C2C2C] mb-4 uppercase tracking-wide">
                  {policy.title}
                </h3>
                <p className="text-[#666666] text-[11px] leading-[2] font-light tracking-widest">
                  {policy.description}
                </p>
                <div className="absolute top-0 left-0 w-full h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto border-elegant p-16 bg-white/40 backdrop-blur-md">
            <h2 className="font-playfair text-3xl mb-8 text-center text-[#2C2C2C]">Standar Pengemasan Scriptum</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-[#666666] text-sm leading-relaxed font-light italic">
              <p>
                Kami menggunakan material pengemasan yang ramah lingkungan namun tetap mempertahankan estetika premium. 
                Setiap kotak dilapisi dengan pelindung ganda untuk mencegah benturan selama perjalanan.
              </p>
              <p>
                Di dalam setiap paket, Anda akan menemukan sertifikat keaslian dan instruksi perawatan yang dicetak di atas 
                kertas bertekstur khusus, menambah nilai pengalaman pembukaan kemasan Anda.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
