'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { regionMap, type RegionKey } from '@/data/regionMap';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

const RECS: Record<
  Season,
  { regions: RegionKey[]; blurb: string; long: string; bestMonths: string }
> = {
  spring: {
    regions: ['kansai', 'kanto', 'chubu'],
    blurb:
      'Blossoms + mild temps: Kyoto/Nara, Tokyo+Nikkō, and Japan Alps; Tōhoku blooms late Apr–May.',
    long:
      'Cherry blossoms and soft light—perfect for slow temple walks, canal-side cafés, and mountain day hikes. Expect cool mornings, picnic-ready afternoons, and golden-hour photos. Kyoto and Tokyo shine now; the Alps add snow-capped backdrops.',
    bestMonths: 'Late Mar – mid Apr (Tōhoku: late Apr – early May)',
  },
  summer: {
    regions: ['hokkaido', 'okinawa', 'tohoku'],
    blurb:
      'Cooler north + beach south: Hokkaidō festivals, Okinawa snorkeling, Tōhoku matsuri.',
    long:
      'Two vibes: breezy Hokkaidō fields and festival nights up north, or tropical blues and reef snorkeling in Okinawa. Long daylight, fireworks, street food, and island time—pick cool air or warm seas.',
    bestMonths: 'Jul – Sep (Okinawa beaches peak Jun – Sep)',
  },
  autumn: {
    regions: ['kansai', 'tohoku', 'chugoku'],
    blurb:
      'Maple season: Kyoto temples, Tōhoku color, and Chūgoku’s gorges/temples (Kankakei, Miyajima).',
    long:
      'Crimson maples, crisp mornings, and lantern-lit evenings. Kyoto lanes glow, Tōhoku valleys burn with color, and coastal trails in Chūgoku feel storybook. Onsen steam and comfort food everywhere.',
    bestMonths: 'Late Oct – late Nov (north turns earlier)',
  },
  winter: {
    regions: ['hokkaido', 'tohoku', 'kyushu'],
    blurb:
      'Powder + onsen: Hokkaidō & Tōhoku for snow, Kyūshū for warm baths; Okinawa is a mild escape.',
    long:
      'Snow-country magic up north—powder stashes, hot springs under falling snow, and cozy towns at blue hour. Or slide south to Kyūshū for milder days and steamy rotenburo. Illuminations and calm sights abound.',
    bestMonths: 'Dec – Feb (best powder: Jan – Feb)',
  },
};

const regions = [
  'Hokkaido',
  'Tohoku',
  'Kanto',
  'Chubu',
  'Kansai',
  'Chugoku',
  'Shikoku',
  'Kyushu',
  'Okinawa',
];

const seasons = ['Spring 🌸', 'Summer ☀️', 'Autumn 🍁', 'Winter ❄️'];

// "Summer ☀️" -> "summer"
const toSeasonKey = (label: string): Season | null => {
  const m = label.toLowerCase().match(/spring|summer|autumn|winter/);
  return (m?.[0] as Season) ?? null;
};

export default function ItineraryPage() {
  const router = useRouter();
  const [region, setRegion] = useState('');
  const [days, setDays] = useState(5);                 // ← now used
  const [startDate, setStartDate] = useState('');      // ← now used
  const [selectedSeason, setSelectedSeason] = useState('');
  const [includeThemePark, setIncludeThemePark] = useState(false);

  const seasonKey = useMemo(
    () => toSeasonKey(selectedSeason || ''),
    [selectedSeason]
  );

  const handleProceed = () => {
    if (!region) return;
    const key = region.toLowerCase(); // e.g. "Kyushu" -> "kyushu"
    const params = new URLSearchParams();
    params.set('theme', includeThemePark ? '1' : '0');
    if (days) params.set('days', String(days));
    if (startDate) params.set('start', startDate);
    router.push(`/itinerary/${key}?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6 font-sans">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">🧭 Build Your Itinerary</h1>
        <p className="text-neutral-400 mb-8">
          Choose your region, season, and trip duration to begin planning.
        </p>

        {/* Season buttons */}
        <div
          role="radiogroup"
          aria-label="Choose a season"
          className="flex flex-wrap justify-center gap-3 mb-5"
        >
          {seasons.map((s) => {
            const key = (s.toLowerCase().match(/spring|summer|autumn|winter/)?.[0] ||
              'spring') as 'spring' | 'summer' | 'autumn' | 'winter';

            const active = selectedSeason === s;
            const labelOnly = s.replace(/\s[^\s]+$/, ''); // "Summer ☀️" -> "Summer"

            const EMOJI: Record<typeof key, string> = {
              spring: '🌸',
              summer: '☀️',
              autumn: '🍁',
              winter: '❄️',
            };

            return (
              <button
                key={s}
                role="radio"
                aria-checked={active}
                onClick={() => setSelectedSeason(s)}
                className={`season-pill season-${key} ${active ? 'is-active' : ''}`}
              >
                <span className="bg" aria-hidden />
                <span className="glow" aria-hidden />
                <span className="content">
                  <span className="emoji">{EMOJI[key]}</span>
                  <span className="label">{labelOnly}</span>
                </span>
                <span className="underline" aria-hidden />
              </button>
            );
          })}
        </div>

        <style jsx>{`
          .season-pill {
            position: relative;
            overflow: hidden;
            border-radius: 9999px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 0.9rem 1.25rem;
            font-size: 1.05rem;
            font-weight: 700;
            color: #fff;
            transition: transform 150ms ease, border-color 200ms ease;
            outline: none;
          }
          .season-pill:hover {
            transform: translateY(-1px);
            border-color: #fff;
          }
          .season-pill:active {
            transform: translateY(0);
          }

          .season-pill:focus-visible {
            box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.35);
          }

          .season-pill .bg {
            position: absolute;
            inset: 0;
            border-radius: 9999px;
            background-size: 200% 200%;
            opacity: 0;
            transition: opacity 200ms ease;
            animation: shimmer 7s linear infinite;
          }
          .season-pill:hover .bg {
            opacity: 0.85;
          }
          .season-pill.is-active .bg {
            opacity: 1;
          }

          .season-pill .glow {
            position: absolute;
            inset: 0;
            border-radius: 9999px;
            filter: blur(16px);
            opacity: 0;
            transition: opacity 250ms ease;
          }
          .season-pill.is-active .glow {
            opacity: 0.35;
          }

          .season-pill .content {
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            z-index: 1;
          }
          .season-pill .emoji {
            display: inline-block;
            font-size: 1.25rem;
            transform: translateY(-1px);
            transition: transform 160ms ease;
          }
          .season-pill:hover .emoji {
            transform: translateY(-2px) scale(1.08);
          }
          .season-pill.is-active .emoji {
            animation: pop 260ms ease;
          }

          .season-pill .underline {
            position: absolute;
            left: 50%;
            bottom: 3px;
            height: 3px;
            transform: translateX(-50%);
            border-radius: 9999px;
            width: 0;
            opacity: 0;
            transition: width 220ms ease, opacity 200ms ease;
          }
          .season-pill.is-active .underline {
            width: 2.5rem;
            opacity: 1;
          }

          /* Gradients per season */
          .season-spring .bg,
          .season-spring .glow,
          .season-spring .underline {
            background-image: linear-gradient(90deg, #ec4899, #f43f5e, #ec4899);
          }

          .season-summer .bg,
          .season-summer .glow,
          .season-summer .underline {
            background-image: linear-gradient(90deg, #fde047, #fb923c, #fde047);
          }

          .season-autumn .bg,
          .season-autumn .glow,
          .season-autumn .underline {
            background-image: linear-gradient(90deg, #f59e0b, #ef4444, #f59e0b);
          }

          .season-winter .bg,
          .season-winter .glow,
          .season-winter .underline {
            background-image: linear-gradient(90deg, #22d3ee, #6366f1, #22d3ee);
          }

          @keyframes shimmer {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          @keyframes pop {
            0% {
              transform: translateY(-1px) scale(1);
            }
            40% {
              transform: translateY(-4px) scale(1.15);
            }
            100% {
              transform: translateY(-1px) scale(1);
            }
          }
        `}</style>

        {/* Season banner */}
        {seasonKey && (
          <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 mb-8">
            <div
              className={`absolute inset-0 bg-gradient-to-r blur-2xl opacity-20 animate-pulse ${
                seasonKey === 'spring'
                  ? 'from-pink-500 to-rose-500'
                  : seasonKey === 'summer'
                  ? 'from-yellow-400 to-orange-500'
                  : seasonKey === 'autumn'
                  ? 'from-amber-600 to-rose-700'
                  : 'from-cyan-400 to-indigo-600'
              }`}
              aria-hidden
            />
            <div className="relative max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-1 rounded-full border border-neutral-700 text-neutral-300">
                  Best: {RECS[seasonKey].bestMonths}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Plan a{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">
                  {seasonKey === 'spring'
                    ? 'Spring'
                    : seasonKey === 'summer'
                    ? 'Summer'
                    : seasonKey === 'autumn'
                    ? 'Autumn'
                    : 'Winter'}
                </span>{' '}
                escape you’ll love
              </h2>

              <p className="mt-3 text-base sm:text-lg leading-relaxed text-neutral-200">
                {RECS[seasonKey].long}
              </p>

              {/* CTA region chips */}
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {RECS[seasonKey].regions.map((key) => (
                  <Link
                    key={key}
                    href={`/itinerary/${key}`}
                    className="px-4 py-2 rounded-full border border-neutral-700 hover:border-white hover:bg-white hover:text-neutral-900 transition"
                  >
                    Start in {regionMap[key].label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REGION TILE PICKER */}
        <div className="mt-6">
          <p className="text-neutral-300 mb-2">Choose a region:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {regions.map((r) => {
              const active = region === r;
              return (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  aria-pressed={active}
                  className={`rounded-2xl px-6 py-5 text-base font-semibold transition-all duration-200 border ${
                    active
                      ? 'bg-white text-neutral-900 shadow-lg'
                      : 'border-white text-white hover:bg-white hover:text-neutral-900'
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* TRIP SETTINGS */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="flex items-center justify-between gap-4 bg-neutral-900/60 border border-neutral-800 rounded-xl px-4 py-3 text-left">
            <span className="text-neutral-300 font-medium">
              Trip length (days)
            </span>
            <input
              type="number"
              min={1}
              max={21}
              value={days}
              onChange={(e) => setDays(Math.max(1, Math.min(21, Number(e.target.value || 0))))}
              className="w-24 rounded-lg bg-neutral-800/80 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-white/60 text-right"
            />
          </label>

          <label className="flex items-center justify-between gap-4 bg-neutral-900/60 border border-neutral-800 rounded-xl px-4 py-3 text-left">
            <span className="text-neutral-300 font-medium">Start date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-lg bg-neutral-800/80 text-white px-3 py-2 outline-none focus:ring-2 focus:ring-white/60"
            />
          </label>
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
            <span className="text-pink-400 font-semibold text-base">
              🎟️🎢 Include a Theme Park Day (if available)
            </span>
          </label>
        </div>

        {/* PROCEED BUTTON */}
        <div className="mt-10">
          <button
            onClick={handleProceed}
            disabled={!region}
            className={`px-6 py-3 rounded-xl text-lg font-semibold shadow transition ${
              region
                ? 'bg-white text-neutral-900 hover:bg-neutral-200'
                : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
            }`}
          >
            🎯 Activities Selection →
          </button>
        </div>

        <div className="mt-10 text-sm text-neutral-500">
          <Link href="/" className="underline hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
