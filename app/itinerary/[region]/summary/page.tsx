'use client';

import { useSearchParams, useParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { regionMap } from '@/data/regionMap';
import DayMap from '@/components/DayMap';

// ===== Types =====
type Spot = {
  name: string;
  city: string;
  tags: string[];
  image?: string;
  lat?: number;
  lng?: number;
  // regionZone?: string; // present on data, not required here
};

type ItineraryDay = { day: number; spots: (Spot & { duration: string })[] };
type ItineraryResult = { days: ItineraryDay[]; overflow: (Spot & { duration: string })[] };

const enc = (s: string) => encodeURIComponent(s);

// ===== Google Maps helpers =====
function mapSearchLink(spot: Spot) {
  if (spot.lat !== undefined && spot.lng !== undefined) {
    return `https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`;
  }
  const query = [spot.name, spot.city].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${enc(query)}`;
}

function dayRouteLink(spots: Spot[]) {
  if (!spots.length) return '#';
  const hasLL = (s: Spot) => s.lat !== undefined && s.lng !== undefined;
  const toQ = (s: Spot) => (hasLL(s) ? `${s.lat},${s.lng}` : [s.name, s.city].filter(Boolean).join(', '));
  const origin = toQ(spots[0]);
  const destination = toQ(spots[spots.length - 1]);
  const waypoints = spots.slice(1, -1).map(toQ).join('|');
  const base = `https://www.google.com/maps/dir/?api=1`;
  const parts = [
    `origin=${enc(origin)}`,
    `destination=${enc(destination)}`,
    waypoints ? `waypoints=${enc(waypoints)}` : null,
    `travelmode=driving`,
  ].filter(Boolean);
  return `${base}&${parts.join('&')}`;
}

// ===== Itinerary logic =====
function generateItinerary(spots: Spot[], days: number, includeThemePark: boolean): ItineraryResult {
  const tagPriority = ['Iconic', 'Cultural', 'Nature', 'Viewpoint', 'UNESCO', 'Scenic', 'Family', 'Food', 'Shopping'];
  const maxHoursPerDay = 10;

  const themeParks = includeThemePark ? spots.filter(s => s.tags.includes('Theme Park')) : [];
  const nonThemeSpots = spots.filter(s => !s.tags.includes('Theme Park'));

  let dayOffset = 0;
  const finalDays: ItineraryDay[] = [];

  if (themeParks.length > 0 && days > 0) {
    finalDays.push({ day: 1, spots: themeParks.slice(0, 1).map(s => ({ ...s, duration: '4–6 hrs' })) });
    dayOffset = 1;
  }

  // Group by zone → city
  const groupedByZone: Record<string, Record<string, Spot[]>> = {};
  for (const spot of nonThemeSpots) {
    const zone = (spot as any).regionZone || spot.city || 'unknown';
    const city = spot.city || 'unknown';
    (groupedByZone[zone] ||= {});
    (groupedByZone[zone][city] ||= []).push(spot);
  }

  type DayBundle = {
    city: string;
    spots: (Spot & { duration: string })[];
    hours: number;
    centroid?: { lat: number; lng: number };
  };

  const asHours = (s: Spot) => (s.tags.includes('Iconic') || s.tags.includes('Cultural')) ? 3 : 2;
  const asLabel = (s: Spot) => (s.tags.includes('Iconic') || s.tags.includes('Cultural')) ? '2–3 hrs' : '1–2 hrs';

  // Haversine
  const distKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
    const toRad = (x: number) => x * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat), lat2 = toRad(b.lat);
    const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };
  const travelHours = (a?: { lat: number; lng: number }, b?: { lat: number; lng: number }) => {
    if (!a || !b) return 1; // no coords -> assume 1h
    const km = distKm(a, b);
    return km / 60 + 0.5; // ~60km/h + buffer
  };

  const dailyBundles: DayBundle[] = [];

  for (const zone of Object.values(groupedByZone)) {
    for (const citySpots of Object.values(zone)) {
      const sorted = citySpots.sort((a, b) => {
        const score = (sp: Spot) => sp.tags.reduce((acc, tag) => acc + ((tagPriority.indexOf(tag) + 1) || 99), 0);
        return score(a) - score(b);
      });

      let cur: (Spot & { duration: string })[] = [];
      let hours = 0;

      for (const s of sorted) {
        const h = asHours(s);
        const lbl = asLabel(s);
        if (hours + h <= maxHoursPerDay) {
          cur.push({ ...s, duration: lbl });
          hours += h;
        } else {
          const pts = cur.filter(x => typeof x.lat === 'number' && typeof x.lng === 'number') as Required<Spot>[];
          const centroid = pts.length
            ? { lat: pts.reduce((a, p) => a + (p.lat as number), 0) / pts.length,
                lng: pts.reduce((a, p) => a + (p.lng as number), 0) / pts.length }
            : undefined;
          dailyBundles.push({ city: cur[0]?.city || 'unknown', spots: cur, hours, centroid });
          cur = [{ ...s, duration: lbl }];
          hours = h;
        }
      }

      if (cur.length) {
        const pts = cur.filter(x => typeof x.lat === 'number' && typeof x.lng === 'number') as Required<Spot>[];
        const centroid = pts.length
          ? { lat: pts.reduce((a, p) => a + (p.lat as number), 0) / pts.length,
              lng: pts.reduce((a, p) => a + (p.lng as number), 0) / pts.length }
          : undefined;
        dailyBundles.push({ city: cur[0]?.city || 'unknown', spots: cur, hours, centroid });
      }
    }
  }

  // Merge adjacent light bundles
  const merged: DayBundle[] = [];
  for (let i = 0; i < dailyBundles.length; i++) {
    const A = dailyBundles[i];
    const B = dailyBundles[i + 1];
    if (!B) { merged.push(A); break; }
    const travel = travelHours(A.centroid, B.centroid);
    if (A.hours + travel + B.hours <= maxHoursPerDay) {
      const spots = [...A.spots, ...B.spots];
      const hours = A.hours + B.hours + travel;
      const pts = spots.filter(x => typeof x.lat === 'number' && typeof x.lng === 'number') as Required<Spot>[];
      const centroid = pts.length
        ? { lat: pts.reduce((a, p) => a + (p.lat as number), 0) / pts.length,
            lng: pts.reduce((a, p) => a + (p.lng as number), 0) / pts.length }
        : A.centroid || B.centroid;
      merged.push({ city: `${A.city} + ${B.city}`, spots, hours, centroid });
      i++; // skip B
    } else {
      merged.push(A);
    }
  }

  const dailySpots = merged.map(b => b.spots);

  // Schedule within available days
  const capacity = Math.max(0, days - dayOffset);
  const scheduled = dailySpots.slice(0, capacity);
  const overflowSpots = dailySpots.slice(capacity).flat();

  for (let i = 0; i < scheduled.length; i++) {
    finalDays.push({ day: i + 1 + dayOffset, spots: scheduled[i] });
  }

  return { days: finalDays, overflow: overflowSpots };
}

export default function SummaryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { region } = useParams<{ region: string }>();

  const regionKey = (region ?? '').toLowerCase() as keyof typeof regionMap;
  const regionInfo = regionMap[regionKey];

  const [spots, setSpots] = useState<Spot[]>([]);
  const [days, setDays] = useState<number>(regionInfo?.defaultDays ?? 3);
  const [includeThemePark, setIncludeThemePark] = useState<boolean>(false);

  // derive itinerary + overflow whenever inputs change
  const { itinerary, overflow } = useMemo(() => {
    const res = generateItinerary(spots, days, includeThemePark);
    return { itinerary: res.days, overflow: res.overflow };
  }, [spots, days, includeThemePark]);

  // Load from query string when page/URL changes
  useEffect(() => {
    if (!regionInfo) {
      router.replace('/itinerary');
      return;
    }

    const regionSpots = regionInfo.spots || [];
    const rawNames = searchParams.get('spots') || '';
    const spotNames = rawNames.split(',').map(s => s.trim()).filter(Boolean);

    // if user didn't select any, we could default to all; keep your current behavior (selected only)
    const selectedSpots = regionSpots.filter((s: Spot) => spotNames.includes(s.name));

    // clamp days to sensible bounds; default to region defaultDays
    const defaultDays = regionInfo.defaultDays ?? 3;
    const parsed = Number(searchParams.get('days'));
    const clampedDays = Number.isFinite(parsed) ? Math.min(10, Math.max(1, parsed)) : defaultDays;

    const themeToggle = searchParams.get('theme') === '1';

    setSpots(selectedSpots);
    setDays(clampedDays);
    setIncludeThemePark(themeToggle);
  }, [regionInfo, router, searchParams]);

  const addOneDay = () => setDays(d => Math.min(10, d + 1));
const subOneDay = () => setDays(d => Math.max(1, d - 1));
;

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6 font-dm">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">🗺️ {regionInfo?.label ?? region?.toUpperCase()} Trip Summary</h1>

        <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 mb-6 text-white text-center space-y-2">
          <p>📍 <strong>{spots.length}</strong> spots selected</p>
          <p>🗓️ <strong>{days}</strong> day trip {includeThemePark && <span className="text-xs text-neutral-400">(includes 1 theme-park day)</span>}</p>
        </div>

        {/* Empty state */}
        {itinerary.length === 0 && (
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 mb-6 text-center text-neutral-300">
            No days scheduled yet. Go back and pick a few spots 🙂
          </div>
        )}

        {/* Overflow Banner */}
        {overflow.length > 0 && (
          <div className="bg-amber-100 border border-amber-300 text-amber-900 rounded-xl p-4 mb-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  Heads up — {overflow.length} spot{overflow.length > 1 ? 's' : ''} didn’t fit into {days} day{days > 1 ? 's' : ''}.
                </p>
                <p className="text-sm opacity-80">
                  We prioritized by tags and city clusters. Add a day or adjust your selection.
                </p>
              </div>
              <button
                onClick={addOneDay}
                className="text-sm px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
              >
                + Add 1 Day
              </button>
            </div>

            <ul className="mt-3 grid gap-1 sm:grid-cols-2 text-sm">
              {overflow.slice(0, 6).map((s) => (
                <li key={`${s.name}-${s.city}`} className="truncate">
                  • {s.name} <span className="opacity-60">({s.city}, {s.duration})</span>
                </li>
              ))}
            </ul>
            {overflow.length > 6 && (
              <div className="text-xs opacity-60 mt-1">…and {overflow.length - 6} more</div>
            )}
          </div>
        )}

        {/* Itinerary List */}
        <div className="space-y-6">
          {itinerary.map(({ day, spots }) => (
            <div key={day} className="bg-neutral-900 border border-neutral-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Day {day}</h3>
                <a
                  href={dayRouteLink(spots)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline text-blue-400 hover:text-blue-300"
                >
                  View Day Route ↗
                </a>
              </div>

              <DayMap spots={spots} />

              <ul className="list-disc list-inside text-neutral-300 space-y-1 mt-3">
                {spots.map((spot) => (
                  <li key={spot.name} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{spot.name}</span>
                      <span className="text-sm text-neutral-400"> — {spot.city}, {spot.duration}</span>
                    </div>
                    <a
                      href={mapSearchLink(spot)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs underline text-blue-400 hover:text-blue-300 ml-2"
                    >
                      Open in Google Maps ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10 gap-4">
          <Link href="/itinerary" className="text-sm underline text-neutral-400 hover:text-white">
            ← Back to Region Picker
          </Link>
          <button
            onClick={() => alert('Next step: generate detailed plan or export!')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl text-base font-semibold shadow-md transition-all duration-200 active:scale-95"
          >
            ✅ Confirm & Start Planning
          </button>
        </div>
      </div>
    </main>
  );
}
