import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center flex flex-col items-center">
            <div className="h-12 w-64 bg-[#F6F4EF] animate-pulse rounded-md mb-4" />
            <div className="w-12 h-[1px] bg-[#1A1A1A] mb-6" />
            <div className="h-4 w-96 bg-[#F6F4EF] animate-pulse rounded-md mb-10" />
            
            <div className="flex flex-wrap justify-center gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 w-16 bg-[#F6F4EF] animate-pulse rounded-md" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
