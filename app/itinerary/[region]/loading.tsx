// app/itinerary/[region]/loading.tsx
export default function Loading() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6 font-dm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="h-8 w-64 mx-auto bg-neutral-800 rounded animate-pulse" aria-hidden />
          <div className="h-4 w-80 mx-auto mt-3 bg-neutral-800 rounded animate-pulse" aria-hidden />
        </div>

        {/* Spot Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
              <div className="h-40 w-full bg-neutral-800 animate-pulse" aria-hidden />
              <div className="p-4 space-y-2">
                <div className="h-5 w-3/4 bg-neutral-800 rounded animate-pulse" aria-hidden />
                <div className="h-4 w-1/2 bg-neutral-800 rounded animate-pulse" aria-hidden />
                <div className="h-3 w-full bg-neutral-800 rounded animate-pulse" aria-hidden />
              </div>
            </div>
          ))}
        </div>

        {/* Trip Config skeleton */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mt-6 mb-10 max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 w-40 bg-neutral-800 rounded animate-pulse" aria-hidden />
            <div className="h-8 w-16 bg-neutral-800 rounded animate-pulse" aria-hidden />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-5 w-52 bg-neutral-800 rounded animate-pulse" aria-hidden />
            <div className="h-6 w-12 bg-neutral-800 rounded-full animate-pulse" aria-hidden />
          </div>
        </div>

        {/* Footer skeleton */}
        <div className="flex justify-center gap-6">
          <div className="h-5 w-40 bg-neutral-800 rounded animate-pulse" aria-hidden />
          <div className="h-10 w-56 bg-neutral-800 rounded-xl animate-pulse" aria-hidden />
        </div>
      </div>
    </main>
  );
}
