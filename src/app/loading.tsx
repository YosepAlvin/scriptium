export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-2 border-[#1A1A1A] border-t-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 animate-pulse rounded-full bg-[#1A1A1A]/5" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-playfair text-xl font-bold tracking-[0.2em] text-[#1A1A1A]">SCRIPTUM</span>
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#999999] animate-pulse">Memuat Pengalaman...</span>
        </div>
      </div>
    </div>
  );
}
