import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#FDFCFB] border-t border-border-custom pt-32 pb-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F9F7F5] rounded-full translate-x-1/2 -translate-y-1/2 opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-playfair text-3xl font-bold mb-8 tracking-[0.1em]">SCRIPTUM</h3>
            <p className="text-[#666666] max-w-sm leading-[1.8] text-sm font-playfair italic">
              "Scriptum adalah harmoni antara tradisi yang diwariskan dan modernitas yang fungsional. 
              Kami merayakan keindahan dalam setiap goresan dan kualitas yang melampaui waktu."
            </p>
          </div>
          <div>
            <h4 className="uppercase text-[10px] tracking-[0.4em] font-semibold mb-8 text-accent">Navigasi</h4>
            <ul className="space-y-5 text-[10px] tracking-[0.3em] text-[#666666] uppercase">
              <li><Link href="/shop" className="hover:text-accent transition-all duration-300">Koleksi Lengkap</Link></li>
              <li><Link href="/categories" className="hover:text-accent transition-all duration-300">Kategori</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-all duration-300">Tentang Kami</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="uppercase text-[10px] tracking-[0.4em] font-semibold mb-8 text-accent">Dukungan</h4>
            <ul className="space-y-5 text-[10px] tracking-[0.3em] text-[#666666] uppercase">
              <li><Link href="/faq" className="hover:text-accent transition-all duration-300">Tanya Jawab</Link></li>
              <li><Link href="/shipping" className="hover:text-accent transition-all duration-300">Logistik & Kurasi</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-all duration-300">Hubungi Kami</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-border-custom pt-12 text-[9px] uppercase tracking-[0.4em] text-[#999999]">
          <p>&copy; {new Date().getFullYear()} Scriptum. Menjaga Tradisi, Merayakan Modernitas.</p>
          <div className="flex space-x-12 mt-6 md:mt-0">
            <Link href="/privacy" className="hover:text-accent transition-colors">Privasi</Link>
            <Link href="/terms" className="hover:text-accent transition-colors">Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
