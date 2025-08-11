// app/itinerary/[region]/summary/loading.tsx
export default function Loading() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6 font-dm">
      <div className="max-w-4xl mx-auto">
        <div className="h-8 w-72 mx-auto mb-6 bg-neutral-800 rounded animate-pulse" aria-hidden />

        {/* Summary info */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-6 text-center">
          <div className="h-4 w-48 mx-auto bg-neutral-800 rounded animate-pulse" aria-hidden />
          <div className="h-4 w-40 mx-auto mt-2 bg-neutral-800 rounded animate-pulse" aria-hidden />
        </div>

        {/* Day cards */}
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="h-5 w-24 bg-neutral-800 rounded animate-pulse" aria-hidden />
                <div className="h-4 w-28 bg-neutral-800 rounded animate-pulse" aria-hidden />
              </div>

              {/* Map placeholder */}
              <div className="h-56 w-full bg-neutral-800 rounded animate-pulse" aria-hidden />

              {/* Spot list lines */}
              <div className="mt-3 space-y-2">
                <div className="h-4 w-3/4 bg-neutral-800 rounded animate-pulse" aria-hidden />
                <div className="h-4 w-2/3 bg-neutral-800 rounded animate-pulse" aria-hidden />
                <div className="h-4 w-1/2 bg-neutral-800 rounded animate-pulse" aria-hidden />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-center mt-10 gap-4">
          <div className="h-5 w-40 bg-neutral-800 rounded animate-pulse" aria-hidden />
          <div className="h-10 w-64 bg-neutral-800 rounded-xl animate-pulse" aria-hidden />
        </div>
      </div>
    </main>
  );
}
