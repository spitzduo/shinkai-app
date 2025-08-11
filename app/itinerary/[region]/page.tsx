'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { regionMap } from '../../data/regionMap';
import { DESCRIPTIONS, normalize } from '../../data/descriptions';

type Spot = {
  name: string;
  city: string;
  tags: string[];
  duration?: string;
  image?: string;
  lat?: number;
  lng?: number;
  regionZone?: string;
};

export default function RegionPage() {
  const params = useParams();
  const router = useRouter();
  const regionKey = (params?.region as string)?.toLowerCase() as keyof typeof regionMap;
  const regionInfo = regionMap[regionKey];

  // guard bad slug
  useEffect(() => {
    if (!regionInfo) router.replace('/itinerary');
  }, [regionInfo, router]);

  const [q, setQ] = useState('');
  const [days, setDays] = useState<number>(regionInfo?.defaultDays ?? 5);
  const [includeThemePark, setIncludeThemePark] = useState<boolean>(true);
  const [selected, setSelected] = useState<string[]>([]);

  const baseSpots: Spot[] = useMemo(() => regionInfo?.spots ?? [], [regionKey]);

  const filtered = useMemo(() => {
    const nq = normalize(q);
    const themeFiltered = baseSpots.filter(
      s => includeThemePark || !s.tags?.includes('Theme Park')
    );
    if (!nq) return themeFiltered;
    return themeFiltered.filter(
      s => normalize(s.name).includes(nq) || normalize(s.city).includes(nq)
    );
  }, [baseSpots, includeThemePark, q]);

  useEffect(() => {
    setSelected(prev => prev.filter(name => filtered.some(s => s.name === name)));
  }, [filtered]);

  const toggle = (name: string) =>
    setSelected(prev => (prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]));

  const handleContinue = () => {
    const params = new URLSearchParams();
    params.set('region', String(regionKey));
    params.set('days', String(days));
    params.set('theme', includeThemePark ? '1' : '0');
    params.set('spots', selected.join(','));
    router.push(`/itinerary/${regionKey}/summary?${params.toString()}`);
  };

  if (!regionInfo) return null;

  const regionLabel = regionInfo.label;

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold">{regionLabel} Spots</h1>
            <p className="text-white/70">
              {`Pick places you love for Japan\u2019s ${regionLabel} region.`}
            </p>
            <p className="text-neutral-400">
              {'Tap the places you\u2019d love to visit!'}
            </p>
          </div>
          <div className="mt-3 sm:mt-0">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or city"
              className="w-full sm:w-72 rounded-xl bg-neutral-800/80 text-white placeholder:text-white/50 px-4 py-2 outline-none focus:ring-2 focus:ring-white/60"
            />
          </div>
        </header>

        {/* CLICKABLE CARDS */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {filtered.map((spot) => {
            const isSelected = selected.includes(spot.name);
            return (
              <button
                type="button"
                key={spot.name}
                aria-pressed={isSelected}
                onClick={() => toggle(spot.name)}
                className={`group rounded-2xl overflow-hidden text-left border transition-all duration-200 shadow-md hover:scale-[1.015] hover:shadow-xl ${
                  isSelected
                    ? 'bg-pink-600 text-white border-pink-400'
                    : 'bg-neutral-900 border-neutral-700 hover:border-white'
                }`}
              >
                <div className="relative h-40 w-full">
                  {spot.image ? (
                    <Image
                      src={spot.image}
                      alt={spot.name}
                      fill
                      className="object-cover"
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    />
                  ) : (
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-700" />
                  )}
                  {isSelected && <div className="absolute inset-0 bg-pink-600/30 mix-blend-multiply" />}
                </div>
                <div className="p-4">
                  <div className="text-lg font-semibold mb-1">{spot.name}</div>
                  <div className="text-sm text-neutral-300">{spot.city}</div>
                  {DESCRIPTIONS[spot.name] && (
                    <p className="text-xs text-neutral-400 mt-2">{DESCRIPTIONS[spot.name]}</p>
                  )}
                  {spot.tags?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {spot.tags.map((t) => (
                        <span
                          key={t}
                          className={`text-[11px] px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-pink-500/70' : 'bg-neutral-700/70'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </button>
            );
          })}
        </section>

        {/* TRIP CONFIG */}
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

        {/* PICKS SUMMARY */}
        {selected.length > 0 && (
          <div className="bg-neutral-800 rounded-xl p-5 mb-10 border border-neutral-700 max-w-xl mx-auto">
            <h2 className="text-lg font-semibold text-white mb-2">✨ Your Picks</h2>
            <ul className="text-neutral-300 list-disc list-inside space-y-1">
              {selected.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="flex justify-center gap-6">
          <Link href="/itinerary" className="text-sm underline hover:text-white text-neutral-400">
            ← Back to Region Picker
          </Link>
          <button
            type="button"
            onClick={handleContinue}
            disabled={selected.length === 0}
            className={`px-6 py-3 rounded-xl text-base font-semibold shadow-md transition-all duration-200 active:scale-95 ${
              selected.length
                ? 'bg-blue-500 hover:bg-pink-600 text-white'
                : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
            }`}
          >
            🛫 Generate Itinerary
          </button>
        </div>
      </div>
    </main>
  );
}
