'use client';

import { useState } from 'react';
import Link from 'next/link';
import { regionMap, type RegionKey } from '@/data/regionMap';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

const RECS: Record<Season, { regions: RegionKey[]; blurb: string }> = {
  spring: {
    regions: ['kansai', 'kanto', 'chubu'], // Tōhoku blooms a bit later (late Apr–May)
    blurb: 'Blossoms + mild temps: Kyoto/Nara, Tokyo+Nikkō, and Japan Alps; Tōhoku peaks late Apr–May.',
  },
  summer: {
    regions: ['hokkaido', 'okinawa', 'tohoku'],
    blurb: 'Cooler north + beach south: Hokkaidō festivals, Okinawa beaches/snorkel, and Tōhoku matsuri.',
  },
  autumn: {
    regions: ['kansai', 'tohoku', 'chugoku'],
    blurb: 'Maple season: Kyoto temples, Tōhoku color, and Chūgoku gorges/temples (e.g., Kankakei, Miyajima).',
  },
  winter: {
    regions: ['hokkaido', 'tohoku', 'kyushu'],
    blurb: 'Powder + onsen: Hokkaidō & Tōhoku for snow, Kyūshū for warm baths; Okinawa is a mild escape.',
  },
};

export default function SeasonRecommender() {
  const [season, setSeason] = useState<Season | null>(null);

  return (
    <div className="mb-8">
      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {(['spring','summer','autumn','winter'] as Season[]).map((s) => {
          const active = season === s;
          return (
            <button
              key={s}
              onClick={() => setSeason(s)}
              className={`px-3 py-1.5 rounded-full border text-sm transition
                ${active ? 'bg-pink-600 border-pink-400 text-white' : 'bg-neutral-900 border-neutral-700 hover:border-white'}`}
              aria-pressed={active}
            >
              {s[0].toUpperCase() + s.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Recommendation line */}
      {season && (
        <div className="mt-4 text-center">
          <div className="text-sm text-neutral-200">
            <span className="opacity-80">This season’s picks: </span>
            {RECS[season].regions.map((key, i) => (
              <span key={key}>
                <Link href={`/itinerary/${key}`} className="underline hover:text-white">
                  {regionMap[key].label}
                </Link>
                {i < RECS[season].regions.length - 1 ? <span>, </span> : null}
              </span>
            ))}
          </div>
          <div className="text-xs text-neutral-400 mt-1">
            {RECS[season].blurb}
          </div>
        </div>
      )}
    </div>
  );
}
