// app/data/descriptions.ts
// (moved out of the route file)
export const DESCRIPTIONS: Record<string, string> = { /* ...existing content... */ };
export const ALIASES: Record<string, string> = { /* ...existing content... */ };
export const normalize = (s: string) =>
  s.toLowerCase()
   .normalize("NFD")
   .replace(/[\u0300-\u036f]/g, "")
   .replace(/[^a-z0-9]+/g, " ")
   .trim();
