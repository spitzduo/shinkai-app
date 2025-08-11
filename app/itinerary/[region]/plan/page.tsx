"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DESCRIPTIONS } from "../../../data/descriptions";

// ===== Types =====
type Spot = {
  id?: string;
  name: string;
  city: string;
  duration?: string;
  lat?: number;
  lng?: number;
  tags?: string[];
  image?: string;
};

type PlanItem = Spot & {
  day: number; // 1..N
  order: number; // order within day
  duration: string; // '1–2 hrs' | '2–3 hrs'
};

type Plan = {
  region: string;
  days: number;
  includeThemePark?: boolean;
  items: PlanItem[];
  updatedAt: string; // ISO
};

type SummaryPayload = {
  region: string;
  days: number;
  includeThemePark?: boolean;
  clusters: { day: number; spots: (Spot & { duration: string })[] }[];
};

// ===== Storage Keys =====
const PLAN_KEY = (region: string | string[]) => `se_itinerary_${region}_plan_v1`;
const SUMMARY_KEY = (region: string | string[]) => `se_itinerary_${region}_summary_v1`;

// ===== Safe localStorage helpers (typed, no any) =====
const readJSON = <T,>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const writeJSON = <T,>(key: string, value: T) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("localStorage write failed", e);
  }
};

// ===== Component =====
export default function PlanPage() {
  const params = useParams();
  const router = useRouter();

  const region = (params?.region as string) ?? "kansai";
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<"" | "copied" | "shared">("");

  // pull summary (from previous step) for fallbacks
  const summary = useMemo(() => readJSON<SummaryPayload>(SUMMARY_KEY(region)), [region]);

  useEffect(() => {
    // Load existing plan or create from summary once
    const existing = readJSON<Plan>(PLAN_KEY(region));
    if (existing) {
      setPlan(existing);
      setLoading(false);
      return;
    }

    if (summary) {
      const items: PlanItem[] = [];
      for (const cluster of summary.clusters) {
        cluster.spots.forEach((s, idx) => {
          items.push({
            ...s,
            day: cluster.day,
            order: idx + 1,
            duration: s.duration ?? (s.tags?.some(t => t === "Iconic" || t === "Cultural") ? "2–3 hrs" : "1–2 hrs"),
          });
        });
      }

      const fresh: Plan = {
        region: summary.region,
        days: summary.days,
        includeThemePark: summary.includeThemePark,
        items,
        updatedAt: new Date().toISOString(),
      };

      setPlan(fresh);
      writeJSON(PLAN_KEY(region), fresh);
    }

    setLoading(false);
  }, [region, summary]);

  // Reorder helpers
  const moveItem = (day: number, index: number, dir: -1 | 1) => {
    if (!plan) return;
    const items = [...plan.items];
    const dayItems = items.filter(it => it.day === day).sort((a, b) => a.order - b.order);
    const src = dayItems[index];
    const dst = dayItems[index + dir];
    if (!src || !dst) return;

    const srcGlobal = items.findIndex(it => it.day === day && it.order === src.order);
    const dstGlobal = items.findIndex(it => it.day === day && it.order === dst.order);

    // swap orders
    items[srcGlobal] = { ...items[srcGlobal], order: dst.order };
    items[dstGlobal] = { ...items[dstGlobal], order: src.order };

    // normalize sort
    const normalized = items.sort((a, b) => (a.day === b.day ? a.order - b.order : a.day - b.day));

    const updated: Plan = { ...plan, items: normalized, updatedAt: new Date().toISOString() };
    setPlan(updated);
    writeJSON(PLAN_KEY(region), updated);
  };

  // Save
  const savePlan = () => {
    if (!plan) return;
    const updated: Plan = { ...plan, updatedAt: new Date().toISOString() };
    setPlan(updated);
    writeJSON(PLAN_KEY(region), updated);
  };

  // Export / Share
  const exportPDF = () => {
    if (typeof window !== "undefined") window.print();
  };

  const shareLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ url, title: `Shinkai Plan — ${region}` });
        setCopied("shared");
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied("copied");
      setTimeout(() => setCopied(""), 1500);
    } catch (e) {
      console.error("Share/Clipboard failed:", e);
      alert(url);
    }
  };

  if (loading) return <div className="p-6 text-white">Loading…</div>;
  if (!plan)
    return (
      <div className="p-6 text-white space-y-3">
        <div className="text-xl font-semibold">No saved itinerary found.</div>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl"
          onClick={() => router.push(`/itinerary/${region}/summary`)}
        >{"Build Summary"}</button>
      </div>
    );

  // Group items by day
  const byDay: Record<number, PlanItem[]> = {};
  for (const it of plan.items) {
    (byDay[it.day] ||= []).push(it);
  }
  Object.keys(byDay).forEach(k => byDay[+k].sort((a, b) => a.order - b.order));

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-semibold">{region.toUpperCase()} Itinerary Plan</h1>
          <div className="text-sm text-white/60">Last updated {new Date(plan.updatedAt).toLocaleString()}</div>
        </div>

        {/* Days */}
        <div className="mt-6 space-y-8 print:space-y-4">
          {Array.from({ length: plan.days }).map((_, idx) => {
            const day = idx + 1;
            const items = byDay[day] ?? [];
            return (
              <section key={day} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 shadow">
                <h2 className="text-lg font-semibold mb-3">Day {day}</h2>
                {items.length === 0 ? (
                  <div className="text-white/70">No spots for this day. Use the Summary step to add clustered spots.</div>
                ) : (
                  <ol className="space-y-3">
                    {items.map((it) => (
                      <li key={`${it.name}-${it.order}`} className="flex items-center gap-3">
                        <div className="text-white/60 w-6 text-right">{it.order}.</div>
                        <div className="flex-1">
                          <div className="font-medium">{it.name}</div>
                          <div className="text-sm text-white/70">{it.city} • {it.duration}</div>
                          {DESCRIPTIONS[it.name] && (
                            <div className="text-xs text-white/60 mt-1">{DESCRIPTIONS[it.name]}</div>
                          )}
                        </div>
                        <div className="flex gap-1 no-print">
                          <button
                            className="px-2 py-1 rounded-md bg-neutral-700 hover:bg-neutral-600"
                            onClick={() => moveItem(day, it.order - 1, -1)}
                            aria-label="Move up"
                          >↑</button>
                          <button
                            className="px-2 py-1 rounded-md bg-neutral-700 hover:bg-neutral-600"
                            onClick={() => moveItem(day, it.order - 1, 1)}
                            aria-label="Move down"
                          >↓</button>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-8 no-print">
          <button
            onClick={() => router.push(`/itinerary/${region}/summary`)}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
          >{"← Back to Summary"}</button>
          <div className="flex gap-2">
            <button onClick={exportPDF} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700">Export PDF</button>
            <button onClick={shareLink} className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700">
              {copied === "copied" ? "Copied!" : copied === "shared" ? "Shared!" : "Share Link"}
            </button>
            <button onClick={savePlan} className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700">Save Changes</button>
          </div>
        </div>
      </div>
    </main>
  );
}
