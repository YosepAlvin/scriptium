import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FAQPage() {
  const faqs = [
    {
      question: "Bagaimana filosofi produk Scriptum?",
      answer: "Scriptum mengusung filosofi 'Dibuat dengan Niat'. Setiap produk kami melalui proses kurasi yang ketat untuk memastikan keseimbangan antara estetika tradisional dan fungsionalitas modern."
    },
    {
      question: "Apakah produk Scriptum diproduksi secara massal?",
      answer: "Tidak. Kami memprioritaskan kualitas di atas kuantitas. Banyak dari koleksi kami diproduksi dalam jumlah terbatas untuk menjaga eksklusivitas dan standar keahlian yang tinggi."
    },
    {
      question: "Bagaimana cara merawat produk Scriptum?",
      answer: "Kami menyertakan panduan perawatan khusus untuk setiap bahan (kertas, kain, atau material tumbler) dalam setiap kemasan untuk memastikan produk Anda bertahan sebagai warisan."
    },
    {
      question: "Dapatkah saya membatalkan pesanan saya?",
      answer: "Pembatalan dapat dilakukan dalam waktu 2 jam setelah pesanan dibuat. Setelah proses kurasi logistik dimulai, pesanan tidak dapat dibatalkan."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-paper">
      <Navbar />
      <main className="flex-grow pt-40 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-20">
            <span className="text-[10px] uppercase tracking-[0.6em] text-accent mb-4 block">Bantuan & Informasi</span>
            <h1 className="font-playfair text-5xl font-bold mb-6 text-[#2C2C2C]">Tanya Jawab</h1>
            <div className="w-16 h-[1px] bg-accent mx-auto mb-8 opacity-40" />
            <p className="font-playfair italic text-[#666666] text-lg">
              "Menjawab setiap keraguan dengan kejelasan."
            </p>
          </div>

          <div className="space-y-12">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-border-custom pb-10 group">
                <h3 className="font-playfair text-xl text-[#2C2C2C] mb-4 group-hover:text-accent transition-colors duration-300">
                  {faq.question}
                </h3>
                <p className="text-[#666666] text-sm leading-[1.8] font-light tracking-wide">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 p-12 border-elegant bg-white/50 text-center">
            <h4 className="font-playfair text-xl mb-4">Masih memiliki pertanyaan?</h4>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#666666] mb-8">Tim kurator kami siap membantu Anda.</p>
            <a href="/contact" className="inline-block px-10 py-4 bg-wood text-white text-[10px] uppercase tracking-[0.4em] hover:bg-accent transition-all duration-700">
              Hubungi Kami
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
