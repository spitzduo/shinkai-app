// /data/itinerary/descriptions.ts
export type SpotLite = {
  name: string;
  city?: string;
  tags?: string[];
};

export const DESCRIPTIONS: Record<string, string> = {
  // ... (same curated text as before)
};

export const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

export const ALIASES: Record<string, string> = {
  // ... (same aliases as before)
};

export const looksGenericDesc = (t?: string) => {
  if (!t) return true;
  const s = t.trim();
  return s.length < 30 || /expect a comfortable pace/i.test(s);
};

function genericDescribe(spot: SpotLite, region: string) {
  const parts: string[] = [];
  parts.push(`${spot.name} in ${spot.city || region}`);
  if (spot.tags?.length) parts.push(`— ${spot.tags.slice(0, 3).join(" / ")}`);
  parts.push("Expect a comfortable pace (1–3 hrs). Consider booking ahead if needed.");
  return parts.join(" ");
}

export function getDescriptionFor(spot: SpotLite, region: string) {
  if (DESCRIPTIONS[spot.name]) return DESCRIPTIONS[spot.name];
  const aliasKey = ALIASES[normalize(spot.name)];
  if (aliasKey && DESCRIPTIONS[aliasKey]) return DESCRIPTIONS[aliasKey];
  return genericDescribe(spot, region);
}
