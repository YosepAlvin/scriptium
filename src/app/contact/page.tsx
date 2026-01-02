import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-paper">
      <Navbar />
      <main className="flex-grow pt-40 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <span className="text-[10px] uppercase tracking-[0.6em] text-accent mb-4 block">Terhubung dengan Kami</span>
            <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6 text-[#2C2C2C]">Hubungi Scriptum</h1>
            <div className="w-24 h-[1px] bg-accent mx-auto mb-8 opacity-40" />
            <p className="font-playfair italic text-[#666666] text-lg max-w-2xl mx-auto">
              "Suara Anda adalah inspirasi bagi setiap karya kami."
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Contact Form */}
            <div className="bg-white p-12 border border-border-custom relative">
              <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-accent/30" />
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-accent font-semibold">Nama Lengkap</label>
                    <input type="text" className="w-full bg-[#FDFCFB] border-b border-border-custom py-3 focus:outline-none focus:border-accent transition-colors font-light text-sm" placeholder="Tulis nama Anda..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-accent font-semibold">Alamat Email</label>
                    <input type="email" className="w-full bg-[#FDFCFB] border-b border-border-custom py-3 focus:outline-none focus:border-accent transition-colors font-light text-sm" placeholder="email@contoh.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] text-accent font-semibold">Subjek</label>
                  <input type="text" className="w-full bg-[#FDFCFB] border-b border-border-custom py-3 focus:outline-none focus:border-accent transition-colors font-light text-sm" placeholder="Apa yang ingin Anda bicarakan?" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] text-accent font-semibold">Pesan</label>
                  <textarea rows={4} className="w-full bg-[#FDFCFB] border-b border-border-custom py-3 focus:outline-none focus:border-accent transition-colors font-light text-sm resize-none" placeholder="Tulis pesan Anda di sini..."></textarea>
                </div>
                <button className="w-full py-5 bg-wood text-white text-[10px] uppercase tracking-[0.4em] hover:bg-accent transition-all duration-700 shadow-xl">
                  Kirim Pesan
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-16 py-8">
              <div className="space-y-12">
                <div className="flex items-start space-x-8 group">
                  <div className="p-4 border border-border-custom group-hover:bg-accent group-hover:text-white transition-all duration-500">
                    <Mail size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mb-3">Email Korespondensi</h4>
                    <p className="text-[#2C2C2C] font-playfair text-xl italic">concierge@scriptum.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-8 group">
                  <div className="p-4 border border-border-custom group-hover:bg-accent group-hover:text-white transition-all duration-500">
                    <Phone size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mb-3">Layanan Suara</h4>
                    <p className="text-[#2C2C2C] font-playfair text-xl italic">+62 21 555 0123</p>
                  </div>
                </div>

                <div className="flex items-start space-x-8 group">
                  <div className="p-4 border border-border-custom group-hover:bg-accent group-hover:text-white transition-all duration-500">
                    <MapPin size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mb-3">Atelier Kami</h4>
                    <p className="text-[#666666] font-light leading-relaxed max-w-xs text-sm">
                      Jl. Warisan Budaya No. 12, <br />
                      Jakarta Selatan, Indonesia 12190
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-12 border-t border-border-custom">
                <h4 className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold mb-8 text-center lg:text-left">Kanal Sosial</h4>
                <div className="flex justify-center lg:justify-start space-x-10">
                  <a href="#" className="text-[#999999] hover:text-accent transition-colors flex items-center space-x-3 group">
                    <Instagram size={18} />
                    <span className="text-[10px] uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">@scriptum_heritage</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
