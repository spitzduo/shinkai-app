'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
// If you have a path alias, prefer this:
import { regionMap } from '@/data/regionMap';
// If not, your original '../../data/regionMap' is fine.

export default function RegionPage() {
  const { region } = useParams<{ region: string }>();
  const router = useRouter();

  // Normalize & type the region key
  const regionKey = (region?.toLowerCase() ?? '') as keyof typeof regionMap;
  const regionInfo = regionMap[regionKey];

  // Defaults from region
  const [days, setDays] = useState<number>(regionInfo?.defaultDays ?? 5);
  const [includeThemePark, setIncludeThemePark] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);

  const allSpots = regionInfo?.spots ?? [];

  // Apply theme-park filter
  const spots = useMemo(
    () => allSpots.filter(s => includeThemePark || !s.tags.includes('Theme Park')),
    [allSpots, includeThemePark]
  );

  // Keep selections valid when filter hides items
  useEffect(() => {
    setSelected(prev => prev.filter(name => spots.some(s => s.name === name)));
  }, [spots]);

  // Optional: guard invalid region
  useEffect(() => {
    if (!regionInfo) router.replace('/itinerary');
  }, [regionInfo, router]);

  const handleContinue = () => {
    const visiblePicks = selected.filter(n => spots.some(s => s.name === n));
    const params = new URLSearchParams();
    params.set('region', regionKey);
    params.set('days', String(days));
    params.set('theme', includeThemePark ? '1' : '0');
    params.set('spots', visiblePicks.join(','));
    router.push(`/itinerary/${regionKey}/summary?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6 font-dm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            📍 Spots in {regionInfo?.label ?? region?.toUpperCase()}
          </h1>
          <p className="text-neutral-400">Tap the places you'd love to visit!</p>
        </div>

        {/* Spot Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {spots.map((spot) => {
            const isSelected = selected.includes(spot.name);
            return (
              <button
                key={spot.name}
                aria-pressed={isSelected}
                onClick={() =>
                  setSelected(prev =>
                    isSelected ? prev.filter(s => s !== spot.name) : [...prev, spot.name]
                  )
                }
                className={`rounded-2xl overflow-hidden text-left border transition-all duration-200 shadow-md hover:scale-[1.015] hover:shadow-xl ${
                  isSelected
                    ? 'bg-pink-600 text-white border-pink-400'
                    : 'bg-neutral-900 border-neutral-700 hover:border-white'
                }`}
              >
                {spot.image && (
                  <div className="relative h-40 w-full">
                    <Image
                      src={spot.image}
                      alt={spot.name}
                      fill
                      className="object-cover"
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="text-lg font-semibold mb-1">{spot.name}</div>
                  <div className="text-sm text-neutral-300">{spot.city}</div>
                  <div className="text-xs text-neutral-400 mt-2">
                    {spot.tags.join(', ')}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Trip Config */}
        <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 mt-6 mb-10 text-white max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <label htmlFor="days" className="font-medium text-base">🗓️ Number of Days</label>
            <input
              type="number" id="days" min={1} max={10} value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-16 p-1 text-center rounded bg-neutral-800 border border-neutral-600 text-white"
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="themeToggle" className="font-medium text-base flex items-center gap-2">
              🎢 Include Theme Parks?
            </label>
            <label className="inline-flex items-center cursor-pointer scale-110">
              <input
                type="checkbox" id="themeToggle" checked={includeThemePark}
                onChange={() => setIncludeThemePark(!includeThemePark)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-neutral-700 rounded-full peer-checked:bg-pink-500 transition-colors duration-300 relative">
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-6 shadow-md" />
              </div>
            </label>
          </div>
        </div>

        {/* Summary */}
        {selected.length > 0 && (
          <div className="bg-neutral-800 rounded-xl p-5 mb-10 border border-neutral-700 max-w-xl mx-auto">
            <h2 className="text-lg font-semibold text-white mb-2">✨ Your Picks</h2>
            <ul className="text-neutral-300 list-disc list-inside space-y-1">
              {selected.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-center gap-6">
          <Link href="/itinerary" className="text-sm underline hover:text-white text-neutral-400">
            ← Back to Region Picker
          </Link>
          <button
            onClick={handleContinue}
            className="bg-blue-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl text-base font-semibold shadow-md transition-all duration-200 active:scale-95"
          >
            🛫 Generate Itinerary
          </button>
        </div>
      </div>
    </main>
  );
}
