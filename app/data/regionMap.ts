// app/data/regionMap.ts
import { kansaiSpots } from "./spots/kansai";
import { hokkaidoSpots } from "./spots/hokkaido";
import { kantoSpots } from "./spots/kanto";
import { chubuSpots } from "./spots/chubu";
import { tohokuSpots } from "./spots/tohoku";
import { chugokuSpots } from "./spots/chugoku";
import { shikokuSpots } from "./spots/shikoku"; // ⬅️ NEW
import { kyushuSpots } from "./spots/kyushu";
import { okinawaSpots } from "./spots/okinawa";



export type RegionInfo = {
  label: string;
  defaultDays: number;
  spots: {
    name: string;
    city: string;
    tags: string[];
    lat?: number;
    lng?: number;
    image?: string;
    regionZone?: string;
  }[];
};

export const regionMap = {
  kansai:   { label: "Kansai",   defaultDays: 5, spots: kansaiSpots },
  hokkaido: { label: "Hokkaidō", defaultDays: 5, spots: hokkaidoSpots },
  kanto:    { label: "Kantō",    defaultDays: 5, spots: kantoSpots },
  chubu:    { label: "Chūbu",    defaultDays: 5, spots: chubuSpots },
  tohoku:   { label: "Tōhoku",   defaultDays: 5, spots: tohokuSpots },
  chugoku:  { label: "Chūgoku",  defaultDays: 5, spots: chugokuSpots },
  shikoku:  { label: "Shikoku",  defaultDays: 5, spots: shikokuSpots }, // ⬅️ NEW
  kyushu:  { label: "Kyūshū",  defaultDays: 6, spots: kyushuSpots },
  okinawa:  { label: "Okinawa",  defaultDays: 5, spots: okinawaSpots },
} as const satisfies Record<string, RegionInfo>;

export type RegionKey = keyof typeof regionMap;
