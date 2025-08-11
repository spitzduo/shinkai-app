
// File: app/itinerary/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const regions = ['Hokkaido', 'Tohoku', 'Kanto', 'Chubu', 'Kansai', 'Chugoku', 'Shikoku', 'Kyushu'];
const seasons = ['Spring 🌸', 'Summer ☀️', 'Autumn 🍁', 'Winter ❄️'];

export default function ItineraryPage() {
  const [region, setRegion] = useState('');
  const [days, setDays] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [includeThemePark, setIncludeThemePark] = useState(false);
  const router = useRouter();

  const handleContinue = () => {
    if (region) {
      const queryParams = new URLSearchParams({
        days: days.toString(),
        startDate,
        season: selectedSeason,
        themePark: includeThemePark.toString(),
      }).toString();
      router.push(`/itinerary/${region.toLowerCase()}?${queryParams}`);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6 font-dm">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">🧭 Build Your Itinerary</h1>
        <p className="text-neutral-400 mb-8">
          Choose your region, season, and trip duration to begin planning.
        </p>

        {/* REGION TILE PICKER */}
        <div className="mt-6">
          <p className="text-neutral-300 mb-2">Choose a region:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={\`
                  rounded-2xl px-6 py-5 text-base font-semibold transition-all duration-200 border
                  \${region === r ? 'bg-white text-neutral-900 shadow-lg' : 'border-white text-white hover:bg-white hover:text-neutral-900'}
                \`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* DURATION + START DATE */}
        <div className="grid gap-4 text-left mt-8">
          <label>
            <span className="text-sm text-neutral-300">Trip Length (days)</span>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full p-2 mt-1 rounded bg-neutral-800 text-white"
              min={1}
              max={30}
            />
          </label>

          <label>
            <span className="text-sm text-neutral-300">Start Date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 mt-1 rounded bg-neutral-800 text-white"
            />
          </label>
        </div>

        {/* SEASON PICKER */}
        <div className="mt-8">
          <p className="text-neutral-300 mb-2">Or choose a season:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {seasons.map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={\`
                  px-4 py-2 rounded-full border transition-all duration-200
                  \${selectedSeason === season ? 'bg-white text-neutral-900' : 'border-white text-white hover:bg-white hover:text-neutral-900'}
                \`}
              >
                {season}
              </button>
            ))}
          </div>
        </div>

        {/* THEME PARK TOGGLE */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeThemePark}
              onChange={() => setIncludeThemePark(!includeThemePark)}
              className="accent-pink-500 w-5 h-5"
            />
            <span className="text-pink-400 font-semibold text-base animate-bounce">
              🎢 Include a Theme Park Day (if available)
            </span>
          </label>
        </div>

        {/* CONTINUE BUTTON */}
        <div className="mt-8">
          <button
            onClick={handleContinue}
            className="bg-white text-neutral-900 px-6 py-2 rounded-xl text-lg font-semibold shadow hover:bg-neutral-200 transition"
            disabled={!region}
          >
            🗺️ Activities Selection
          </button>
        </div>

        {/* BACK TO HOME */}
        <div className="mt-10 text-sm text-neutral-500">
          <Link href="/" className="underline hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
