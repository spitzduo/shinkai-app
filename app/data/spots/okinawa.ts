// app/data/spots/okinawa.ts
export type Spot = {
  name: string;
  city: string;
  tags: string[];
  lat?: number;
  lng?: number;
  image?: string;
  regionZone?: string; // island group for clustering
};

export const okinawaSpots: Spot[] = [
  // — Okinawa Main Island
  {
    name: "Shurijo Castle (Shuri-jō)",
    city: "Naha",
    tags: ["Cultural","Historic","Iconic"],
    lat: 26.2173, lng: 127.7190,
    image: "/images/okinawa/shurijo-castle.jpg",
    regionZone: "Okinawa Main Island",
  },
  {
    name: "Okinawa Churaumi Aquarium",
    city: "Motobu",
    tags: ["Family","Iconic","Unique"],
    lat: 26.6945, lng: 127.8776,
    image: "/images/okinawa/churaumi-aquarium.jpg",
    regionZone: "Okinawa Main Island",
  },
  {
    name: "Kouri Bridge",
    city: "Nago",
    tags: ["Scenic","Iconic"],
    lat: 26.6958, lng: 128.0172,
    image: "/images/okinawa/kouri-bridge.jpg",
    regionZone: "Okinawa Main Island",
  },
  {
    name: "Cape Manzamo",
    city: "Onna",
    tags: ["Nature","Scenic","Iconic"],
    lat: 26.5030, lng: 127.8522,
    image: "/images/okinawa/cape-manzamo.jpg",
    regionZone: "Okinawa Main Island",
  },
  {
    name: "Blue Cave (Cape Maeda)",
    city: "Onna",
    tags: ["Nature","Adventure","Unique"],
    lat: 26.4350, lng: 127.8580,
    image: "/images/okinawa/blue-cave-cape-maeda.jpg",
    regionZone: "Okinawa Main Island",
  },
  {
    name: "Cape Zanpa",
    city: "Yomitan",
    tags: ["Nature","Scenic"],
    lat: 26.4448, lng: 127.7038,
    image: "/images/okinawa/cape-zanpa.jpg",
    regionZone: "Okinawa Main Island",
  },
  {
    name: "Sefa Utaki",
    city: "Nanjo",
    tags: ["Cultural","Historic","Scenic"],
    lat: 26.1446, lng: 127.8288,
    image: "/images/okinawa/sefa-utaki.jpg",
    regionZone: "Okinawa Main Island",
  },
  {
    name: "Gyokusendo Cave (Okinawa World)",
    city: "Nanjo",
    tags: ["Nature","Unique"],
    lat: 26.1236, lng: 127.7559,
    image: "/images/okinawa/gyokusendo-cave.jpg",
    regionZone: "Okinawa Main Island",
  },
  {
    name: "Nakagusuku Castle Ruins",
    city: "Kitanakagusuku",
    tags: ["Cultural","Historic","Scenic"],
    lat: 26.2798, lng: 127.7788,
    image: "/images/okinawa/nakagusuku-castle-ruins.jpg",
    regionZone: "Okinawa Main Island",
  },
  {
    name: "Katsuren Castle Ruins",
    city: "Uruma",
    tags: ["Cultural","Historic","Scenic"],
    lat: 26.3494, lng: 127.8678,
    image: "/images/okinawa/katsuren-castle-ruins.jpg",
    regionZone: "Okinawa Main Island",
  },

  // — Miyako Islands
  {
    name: "Yonaha Maehama Beach",
    city: "Miyakojima",
    tags: ["Nature","Scenic","Relax","Iconic"],
    lat: 24.7307, lng: 125.2709,
    image: "/images/okinawa/yonaha-maehama-beach.jpg",
    regionZone: "Miyako Islands",
  },
  {
    name: "Irabu Ohashi Bridge",
    city: "Miyakojima",
    tags: ["Scenic","Iconic"],
    lat: 24.7936, lng: 125.2050,
    image: "/images/okinawa/irabu-ohashi-bridge.jpg",
    regionZone: "Miyako Islands",
  },
  {
    name: "Higashi-Hennazaki (Cape)",
    city: "Miyakojima",
    tags: ["Nature","Scenic"],
    lat: 24.7356, lng: 125.5322,
    image: "/images/okinawa/higashi-hennazaki-cape.jpg",
    regionZone: "Miyako Islands",
  },

  // — Yaeyama Islands (Ishigaki / Taketomi / Iriomote)
  {
    name: "Kabira Bay",
    city: "Ishigaki",
    tags: ["Nature","Scenic","Iconic"],
    lat: 24.4545, lng: 124.1417,
    image: "/images/okinawa/kabira-bay.jpg",
    regionZone: "Yaeyama Islands",
  },
  {
    name: "Taketomi Village",
    city: "Taketomi",
    tags: ["Cultural","Historic","Scenic"],
    lat: 24.3284, lng: 124.0808,
    image: "/images/okinawa/taketomi-village.jpg",
    regionZone: "Yaeyama Islands",
  },
  {
    name: "Kondoi Beach (Taketomi)",
    city: "Taketomi",
    tags: ["Nature","Relax","Scenic"],
    lat: 24.3236, lng: 124.0678,
    image: "/images/okinawa/kondoi-beach.jpg",
    regionZone: "Yaeyama Islands",
  },
  {
    name: "Kaiji Beach (Star Sand)",
    city: "Taketomi",
    tags: ["Nature","Unique","Scenic"],
    lat: 24.3199, lng: 124.0615,
    image: "/images/okinawa/kaiji-beach-star-sand.jpg",
    regionZone: "Yaeyama Islands",
  },
  {
    name: "Pinaisara Falls (Iriomote)",
    city: "Taketomi (Iriomote)",
    tags: ["Nature","Adventure","Scenic"],
    lat: 24.3847, lng: 123.8090,
    image: "/images/okinawa/pinaisara-falls.jpg",
    regionZone: "Yaeyama Islands",
  },
];
