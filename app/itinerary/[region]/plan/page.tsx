"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getDescriptionFor, looksGenericDesc } from "@/data/descriptions";

// ===== Helpers (top-level, stable) =====
const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Generic reader with no `any`
function readJSON<T = unknown>(key: string | null): T | null {
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

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
  description?: string;
};

type ItineraryDay = {
  day: number;
  title?: string;
  notes?: string;
  spots: Spot[];
};

type ItinerarySave = {
  region: string;
  totalDays: number;
  themeDayReserved: boolean;
  themeParkName?: string;
  days: ItineraryDay[];
};

// ===== Storage Keys =====
const PLAN_KEY = (region: string | string[]) => `se_itinerary_${region}_plan_v1`;
const SUMMARY_KEY = (region: string | string[]) => `se_itinerary_${region}_summary_v1`;

// Legacy keys (kept in case older saves exist)
const LEGACY_PLAN_KEY = (region: string | string[]) => `se_itinerary_${region}_plan_v1`;
const LEGACY_SUMMARY_KEY = (region: string | string[]) => `se_itinerary_${region}_summary_v1`;

function loadFromStorage(currentRegion: string): ItinerarySave | null {
  // 1) Normalized keys first
  let data =
    readJSON<ItinerarySave>(PLAN_KEY(currentRegion)) ||
    readJSON<ItinerarySave>(SUMMARY_KEY(currentRegion));

  // 2) Legacy
  if (!data) {
    data =
      readJSON<ItinerarySave>(LEGACY_PLAN_KEY(currentRegion)) ||
      readJSON<ItinerarySave>(LEGACY_SUMMARY_KEY(currentRegion));
  }

  // 3) Last resort: scan for any summary with region prefix (handles casing drift)
  if (!data) {
    try {
      const prefixA = `se_itinerary_${slug(currentRegion)}`;
      const prefixB = `se_itinerary_${currentRegion}`;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i) || "";
        if ((k.startsWith(prefixA) || k.startsWith(prefixB)) && k.endsWith("_summary_v1")) {
          data = readJSON<ItinerarySave>(k);
          if (data) break;
        }
      }
    } catch {}
  }

  if (data) {
    data.days = (data.days || []).map((d, idx) => ({
      ...d,
      day: idx + 1,
      spots: d.spots || [],
    }));
  }
  return data || null;
}

function fallbackStockImage(spot: Spot, region: string) {
  const q = encodeURIComponent(`${spot.name} ${spot.city || region} Japan`);
  return `https://source.unsplash.com/1200x800/?${q}`;
}

function formatDaySubtitle(day: ItineraryDay, region: string) {
  const title = day.title || day.spots[0]?.city || (region ?? "");
  const topSpots = day.spots.slice(0, 3).map((s) => s.name).join(", ");
  return `${title}${topSpots ? " — " + topSpots : ""}`;
}

export default function PlanPage() {
  const { region } = useParams<{ region: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [plan, setPlan] = useState<ItinerarySave | null>(null);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [copied, setCopied] = useState<"" | "copied" | "shared">("");
  const [useStock, setUseStock] = useState<boolean>(true);

  // ===== Load from localStorage or URL (?data=...)
  useEffect(() => {
    const r = region ? decodeURIComponent(region) : "";
    if (!r) {
      setLoading(false);
      return;
    }
    try {
      const query = searchParams?.get("data");
      if (query) {
        const fromQuery = JSON.parse(decodeURIComponent(query)) as ItinerarySave;
        fromQuery.days = (fromQuery.days || []).map((d, i) => ({
          ...d,
          day: i + 1,
          spots: d.spots || [],
        }));
        localStorage.setItem(PLAN_KEY(r), JSON.stringify(fromQuery));
        setPlan(fromQuery);
        setLoading(false);
        return;
      }

      const data = loadFromStorage(r);
      if (data) setPlan(data);
    } catch (e) {
      console.error("Failed to parse plan:", e);
    } finally {
      setLoading(false);
    }
  }, [region, searchParams]);

  // ===== Helpers =====
  const canSave = useMemo(() => !!plan && dirty, [plan, dirty]);

  function persist(next: ItinerarySave) {
    const r = region ? decodeURIComponent(region) : "";
    if (!r) return;
    localStorage.setItem(PLAN_KEY(r), JSON.stringify(next));
  }

  function markDirty(updater: (prev: ItinerarySave) => ItinerarySave) {
    setPlan((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      setDirty(true);
      return next;
    });
  }

  // ===== Mutations =====
  function moveDay(index: number, direction: "up" | "down") {
    markDirty((prev) => {
      const days = [...prev.days];
      const swapWith = direction === "up" ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= days.length) return prev;
      [days[index], days[swapWith]] = [days[swapWith], days[index]];
      const relabeled = days.map((d, i) => ({ ...d, day: i + 1 }));
      const next = { ...prev, days: relabeled };
      persist(next);
      return next;
    });
  }

  function moveSpot(dayIdx: number, spotIdx: number, direction: "up" | "down") {
    markDirty((prev) => {
      const days = prev.days.map((d) => ({ ...d, spots: [...d.spots] }));
      const spots = days[dayIdx].spots;
      const swapWith = direction === "up" ? spotIdx - 1 : spotIdx + 1;
      if (swapWith < 0 || swapWith >= spots.length) return prev;
      [spots[spotIdx], spots[swapWith]] = [spots[swapWith], spots[spotIdx]];
      const next = { ...prev, days };
      persist(next);
      return next;
    });
  }

  function moveSpotToDay(fromDayIdx: number, spotIdx: number, toDayIdx: number) {
    if (toDayIdx === fromDayIdx) return;
    markDirty((prev) => {
      const days = prev.days.map((d) => ({ ...d, spots: [...d.spots] }));
      const [sp] = days[fromDayIdx].spots.splice(spotIdx, 1);
      if (sp) days[toDayIdx].spots.push(sp);
      const next = { ...prev, days };
      persist(next);
      return next;
    });
  }

  function removeSpot(dayIdx: number, spotIdx: number) {
    markDirty((prev) => {
      const days = prev.days.map((d) => ({ ...d, spots: [...d.spots] }));
      days[dayIdx].spots.splice(spotIdx, 1);
      const next = { ...prev, days };
      persist(next);
      return next;
    });
  }

  function updateDayTitle(index: number, title: string) {
    markDirty((prev) => {
      const days = [...prev.days];
      days[index] = { ...days[index], title };
      const next = { ...prev, days };
      persist(next);
      return next;
    });
  }

  function updateDayNotes(index: number, notes: string) {
    markDirty((prev) => {
      const days = [...prev.days];
      days[index] = { ...days[index], notes };
      const next = { ...prev, days };
      persist(next);
      return next;
    });
  }

  function updateSpotImage(dayIdx: number, spotIdx: number, image: string) {
    markDirty((prev) => {
      const days = prev.days.map((d) => ({ ...d, spots: d.spots.map((s) => ({ ...s })) }));
      days[dayIdx].spots[spotIdx].image = image;
      const next = { ...prev, days };
      persist(next);
      return next;
    });
  }

  function updateSpotDescription(dayIdx: number, spotIdx: number, description: string) {
    markDirty((prev) => {
      const days = prev.days.map((d) => ({ ...d, spots: d.spots.map((s) => ({ ...s })) }));
      days[dayIdx].spots[spotIdx].description = description;
      const next = { ...prev, days };
      persist(next);
      return next;
    });
  }

  // Prefer curated descriptions; overwrite generic ones when detected
  function autofillDescriptions() {
    if (!plan) return;
    markDirty((prev) => {
      const days = prev.days.map((d) => ({
        ...d,
        spots: d.spots.map((s) => {
          const current = s.description?.trim() ?? "";
          const curated = getDescriptionFor(s, prev.region);
          const nextDesc = current && !looksGenericDesc(current) ? current : curated;
          return { ...s, description: nextDesc };
        }),
      }));
      const next = { ...prev, days };
      persist(next);
      return next;
    });
  }

  function applyStockImages() {
    if (!plan) return;
    markDirty((prev) => {
      const days = prev.days.map((d) => ({
        ...d,
        spots: d.spots.map((s) => ({
          ...s,
          image:
            s.image && s.image.trim().length > 0 ? s.image : fallbackStockImage(s, prev.region),
        })),
      }));
      const next = { ...prev, days };
      persist(next);
      return next;
    });
  }

  function savePlan() {
    if (!plan) return;
    const relabeled = { ...plan, days: plan.days.map((d, i) => ({ ...d, day: i + 1 })) };
    persist(relabeled);
    setPlan(relabeled);
    setDirty(false);
  }

  function resetFromSummary() {
    const r = region ? decodeURIComponent(region) : "";
    if (!r) return;
    // Read ONLY from the summary key to truly reset to pre-edit layout
    const summary = readJSON<ItinerarySave>(SUMMARY_KEY(r));
    if (!summary) return;
    summary.days = (summary.days || []).map((d, i) => ({ ...d, day: i + 1, spots: d.spots || [] }));
    localStorage.setItem(PLAN_KEY(r), JSON.stringify(summary));
    setPlan(summary);
    setDirty(false);
  }

  // ===== Export & Share =====
  function exportPDF() {
    window.print();
  }

  async function shareLink() {
    if (!plan || !region) return;
    const data = encodeURIComponent(JSON.stringify(plan));
    const url = `${window.location.origin}/itinerary/${region}/plan?data=${data}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: `Trip plan: ${String(region).toUpperCase()}`, url });
        setCopied("shared");
        setTimeout(() => setCopied(""), 1500);
        return;
      }
    } catch {}

    try {
      await navigator.clipboard.writeText(url);
      setCopied("copied");
      setTimeout(() => setCopied(""), 1500);
    } catch (e) {
      console.error("Clipboard failed:", e);
      alert(url);
    }
  }

  // ===== UI =====
  const btnBlue = "px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white";

  if (loading) return <div className="p-6 text-neutral-900">Loading…</div>;
  if (!plan)
    return (
      <div className="p-6 text-white space-y-3">
        <div className="text-xl font-semibold">No saved itinerary found.</div>
        <button className={btnBlue} onClick={() => router.push(`/itinerary/${region}/summary`)}>
          ← Back to Summary
        </button>
      </div>
    );

  return (
    <main className="min-h-screen bg-[#F7F7F5] text-neutral-900 p-6 font-dm">
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 16mm;
          }
          html,
          body {
            width: 210mm;
          }
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          :root {
            font-size: 11pt;
          }
          .max-w-6xl {
            max-width: 100% !important;
          }
          .print-container {
            color: #000;
            padding: 0 !important;
            margin: 0 !important;
          }
          .cover-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 6mm !important;
          }
          .spot-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 6mm !important;
          }
          .print-card {
            break-inside: avoid;
            page-break-inside: avoid;
            border: 0.2mm solid #ddd !important;
            background: #fff !important;
            padding: 6mm !important;
          }
          .print-hero {
            height: 55mm !important;
            object-fit: cover !important;
          }
          img {
            page-break-inside: avoid;
          }
          h1,
          h2,
          h3 {
            break-after: avoid-page;
          }
          .no-print {
            display: none !important;
          }
          .print-cover {
            page-break-after: always;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto print-container">
        {/* Cover page */}
        <section className="rounded-3xl bg-[#F7F7F5] p-8 text-neutral-900 shadow-xl border border-neutral-200 print-card print-cover">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {String(region).toUpperCase()} – Professional Itinerary
          </h1>
          <p className="mt-2 text-neutral-600">
            {plan.totalDays} days • {plan.themeDayReserved ? "includes theme park" : "no theme park day"}
          </p>
          <div className="cover-grid mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plan.days.slice(0, 6).map((d, i) => {
              const hero =
                d.spots.find((s) => s.image)?.image ||
                (useStock && d.spots[0] ? fallbackStockImage(d.spots[0], plan.region) : undefined);
              return (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden bg-white border border-neutral-200 shadow-sm"
                >
                  {hero && (
                    <Image
                      src={hero}
                      alt={`Day ${d.day} cover`}
                      width={1200}
                      height={400}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-3">
                    <div className="text-sm text-neutral-500">Day {d.day}</div>
                    <div className="font-semibold text-neutral-900">
                      {d.title || d.spots[0]?.city || "Day Plan"}
                    </div>
                    <div className="text-xs text-neutral-500 mt-1">
                      {formatDaySubtitle(d, plan.region)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Toolbar */}
        <div className="flex items-start justify-between gap-4 flex-wrap no-print mt-6">
          <div>
            <h2 className="text-2xl font-bold">Planner</h2>
            <p className="text-sm text-neutral-500 mt-1">Add images & descriptions for a Canva-style export.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setUseStock((v) => !v)} className={btnBlue}>
              Stock images: {useStock ? "On" : "Off"}
            </button>
            <button onClick={applyStockImages} className={btnBlue}>
              Auto-fill Images
            </button>
            <button onClick={autofillDescriptions} className={btnBlue}>
              Auto-fill Descriptions
            </button>
            <button onClick={resetFromSummary} className={btnBlue} title="Reload the original summary layout">
              Reset
            </button>
            <button
              disabled={!canSave}
              onClick={savePlan}
              className={`${btnBlue} ${!canSave ? "opacity-50 cursor-not-allowed" : ""}`}
              title={canSave ? "Save your latest edits" : "No changes to save"}
            >
              Save
            </button>
            <button onClick={exportPDF} className={btnBlue} title="Export to PDF via browser print">
              Export PDF
            </button>
            <button onClick={shareLink} className={btnBlue} title="Copy or share a link to this plan">
              {copied === "copied" ? "Copied!" : copied === "shared" ? "Shared!" : "Share Link"}
            </button>
          </div>
        </div>

        {/* Days (editable + print-ready) */}
        <div className="mt-6 space-y-8">
          {plan.days.map((day, i) => (
            <section key={i} className="rounded-3xl border border-neutral-200 bg-white p-5 print-card">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-[240px]">
                  <div className="text-sm text-neutral-500">Day {i + 1}</div>
                  <input
                    value={day.title ?? ""}
                    onChange={(e) => updateDayTitle(i, e.target.value)}
                    placeholder="Add a title (e.g., Kyoto Icons)"
                    className="mt-1 w-full rounded-lg bg-white border border-neutral-300 px-3 py-2 text-neutral-900 placeholder-neutral-400"
                  />
                </div>
                <div className="flex gap-2 no-print">
                  <button
                    onClick={() => moveDay(i, "up")}
                    className="px-3 py-2 rounded-lg bg-neutral-100 border border-neutral-300 hover:bg-neutral-200"
                  >
                    ↑ Day
                  </button>
                  <button
                    onClick={() => moveDay(i, "down")}
                    className="px-3 py-2 rounded-lg bg-neutral-100 border border-neutral-300 hover:bg-neutral-200"
                  >
                    ↓ Day
                  </button>
                </div>
              </div>

              <textarea
                value={day.notes ?? ""}
                onChange={(e) => updateDayNotes(i, e.target.value)}
                placeholder="Notes for this day… lunch plans, parking, weather backups, etc."
                className="mt-3 w-full rounded-lg bg-white border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400"
              />

              {/* Spots — image + description */}
              <ul className="spot-grid mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {day.spots.map((s, j) => {
                  const hero = s.image || (useStock ? fallbackStockImage(s, plan.region) : undefined);
                  const desc = s.description ?? "";
                  const curated = getDescriptionFor(s, plan.region);
                  const displayDesc = desc && !looksGenericDesc(desc) ? desc : curated;
                  return (
                    <li
                      key={`${s.name}-${j}`}
                      className="rounded-2xl bg-white border border-neutral-200 overflow-hidden"
                    >
                      {hero && (
                        <Image
                          src={hero}
                          alt={s.name}
                          width={1200}
                          height={480}
                          className="w-full h-48 object-cover print-hero"
                        />
                      )}
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="min-w-[220px]">
                            <div className="font-semibold text-neutral-900">{s.name}</div>
                            <div className="text-xs text-neutral-500">
                              {s.city}
                              {s.duration ? ` • ${s.duration}` : ""}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 no-print">
                            <button className="px-2 py-1 rounded-lg border border-neutral-300 bg-neutral-100 hover:bg-neutral-200 text-sm"
                              onClick={() => moveSpot(i, j, "up")}>↑</button>
                            <button className="px-2 py-1 rounded-lg border border-neutral-300 bg-neutral-100 hover:bg-neutral-200 text-sm"
                              onClick={() => moveSpot(i, j, "down")}>↓</button>
                            <select
                              className="px-2 py-1 rounded-lg border border-neutral-300 bg-white text-sm"
                              value={i}
                              onChange={(e) => moveSpotToDay(i, j, parseInt(e.target.value, 10))}
                              title="Move to day"
                            >
                              {plan.days.map((_, idx) => (
                                <option value={idx} key={`dopt-${idx}`}>
                                  Day {idx + 1}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => removeSpot(i, j)}
                              className="px-2 py-1 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-sm text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Editable controls (screen only) */}
                        <div className="no-print mt-3 space-y-2">
                          <input
                            value={s.image ?? ""}
                            onChange={(e) => updateSpotImage(i, j, e.target.value)}
                            placeholder="Paste image URL (JPG/PNG)"
                            className="w-full rounded-lg bg-white border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400"
                          />
                          <textarea
                            value={desc}
                            onChange={(e) => updateSpotDescription(i, j, e.target.value)}
                            placeholder={curated}
                            className="w-full rounded-lg bg-white border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400"
                          />
                        </div>

                        {/* Print description */}
                        {displayDesc && <p className="mt-3 text-sm text-neutral-700">{displayDesc}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-8 no-print">
          <button
            onClick={() => router.push(`/itinerary/${region}/summary`)}
            className="text-sm underline text-neutral-600 hover:text-neutral-900"
          >
            ← Back to Summary
          </button>
          <div className="flex gap-2">
            <button onClick={exportPDF} className={btnBlue}>
              Export PDF
            </button>
            <button onClick={shareLink} className={btnBlue}>
              {copied === "copied" ? "Copied!" : copied === "shared" ? "Shared!" : "Share Link"}
            </button>
            <button
              disabled={!canSave}
              onClick={savePlan}
              className={`${btnBlue} ${!canSave ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
