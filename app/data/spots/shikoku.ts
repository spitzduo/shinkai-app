// app/data/spots/shikoku.ts
export type Spot = {
  name: string;
  city: string;
  tags: string[];
  lat?: number;
  lng?: number;
  image?: string;
  regionZone?: string; // use prefecture for clustering
};

export const shikokuSpots: Spot[] = [
  // — Tokushima Prefecture
  {
    name: "Naruto Whirlpools",
    city: "Naruto",
    tags: ["Nature","Iconic","Unique"],
    lat: 34.2472, lng: 134.6361,
    image: "/images/shikoku/naruto-whirlpools.jpg",
    regionZone: "Tokushima",
  },
  {
    name: "Ōtsuka Museum of Art",
    city: "Naruto",
    tags: ["Cultural","Unique"],
    lat: 34.2466, lng: 134.6537,
    image: "/images/shikoku/otsuka-museum-of-art.jpg",
    regionZone: "Tokushima",
  },
  {
    name: "Iya Valley Kazurabashi (Vine Bridge)",
    city: "Miyoshi",
    tags: ["Nature","Adventure","Scenic"],
    lat: 33.8847, lng: 133.8345,
    image: "/images/shikoku/iya-kazurabashi.jpg",
    regionZone: "Tokushima",
  },
  {
    name: "Oboke Gorge",
    city: "Miyoshi",
    tags: ["Nature","Scenic"],
    lat: 33.8894, lng: 133.7832,
    image: "/images/shikoku/oboke-gorge.jpg",
    regionZone: "Tokushima",
  },

  // — Kagawa Prefecture
  {
    name: "Ritsurin Garden",
    city: "Takamatsu",
    tags: ["Nature","Iconic","Scenic"],
    lat: 34.3249, lng: 134.0434,
    image: "/images/shikoku/ritsurin-garden.jpg",
    regionZone: "Kagawa",
  },
  {
    name: "Kotohira-gu (Konpira-san)",
    city: "Kotohira",
    tags: ["Cultural","Historic"],
    lat: 34.1956, lng: 133.8063,
    image: "/images/shikoku/kotohira-gu.jpg",
    regionZone: "Kagawa",
  },
  {
    name: "Kankakei Gorge (Shōdoshima)",
    city: "Shōdoshima",
    tags: ["Nature","Scenic"],
    lat: 34.4851, lng: 134.2330,
    image: "/images/shikoku/kankakei-gorge.jpg",
    regionZone: "Kagawa",
  },

  // — Ehime Prefecture
  {
    name: "Dōgo Onsen Honkan",
    city: "Matsuyama",
    tags: ["Cultural","Iconic","Relax"],
    lat: 33.8519, lng: 132.7867,
    image: "/images/shikoku/dogo-onsen.jpg",
    regionZone: "Ehime",
  },
  {
    name: "Matsuyama Castle",
    city: "Matsuyama",
    tags: ["Cultural","Historic","Scenic"],
    lat: 33.8390, lng: 132.7654,
    image: "/images/shikoku/matsuyama-castle.jpg",
    regionZone: "Ehime",
  },
  {
    name: "Shimanami Kaidō Cycling (Imabari Start)",
    city: "Imabari",
    tags: ["Adventure","Scenic","Iconic"],
    lat: 34.0663, lng: 133.0044,
    image: "/images/shikoku/shimanami-kaido.jpg",
    regionZone: "Ehime",
  },
  {
    name: "Uchiko Old Town",
    city: "Uchiko",
    tags: ["Cultural","Historic","Scenic"],
    lat: 33.5382, lng: 132.6562,
    image: "/images/shikoku/uchiko-old-town.jpg",
    regionZone: "Ehime",
  },

  // — Kochi Prefecture
  {
    name: "Kōchi Castle",
    city: "Kōchi",
    tags: ["Cultural","Historic"],
    lat: 33.5587, lng: 133.5311,
    image: "/images/shikoku/kochi-castle.jpg",
    regionZone: "Kochi",
  },
  {
    name: "Katsurahama Beach",
    city: "Kōchi",
    tags: ["Nature","Scenic"],
    lat: 33.4987, lng: 133.5758,
    image: "/images/shikoku/katsurahama.jpg",
    regionZone: "Kochi",
  },
  {
    name: "Cape Muroto (Muroto Misaki)",
    city: "Muroto",
    tags: ["Nature","Scenic","Unique"],
    lat: 33.2834, lng: 134.1670,
    image: "/images/shikoku/cape-muroto.jpg",
    regionZone: "Kochi",
  },
  {
  name: "Cape Ashizuri (Ashizuri Misaki)",
  city: "Tosashimizu",
  tags: ["Nature","Scenic","Iconic"],
  lat: 32.7333,
  lng: 133.017,
  image: "/images/shikoku/cape-ashizuri.jpg",
  regionZone: "Kōchi",
},

];
