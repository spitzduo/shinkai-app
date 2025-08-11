// app/data/spots/chugoku.ts
export type Spot = {
  name: string;
  city: string;
  tags: string[];
  lat?: number;
  lng?: number;
  image?: string;
  regionZone?: string;
};

export const chugokuSpots: Spot[] = [
  // — Hiroshima Prefecture
  { name: "Itsukushima Shrine", city: "Miyajima", tags: ["Cultural","Iconic"], lat: 34.2956, lng: 132.3199, image: "/images/chugoku/itsukushima-shrine.jpg" },
  { name: "Hiroshima Peace Memorial Park", city: "Hiroshima", tags: ["Cultural","Historic"], lat: 34.3955, lng: 132.4536, image: "/images/chugoku/hiroshima-peace-park.jpg" },
  { name: "Shukkeien Garden", city: "Hiroshima", tags: ["Nature","Scenic"], lat: 34.4014, lng: 132.4678, image: "/images/chugoku/shukkeien-garden.jpg" },

  // — Okayama Prefecture
  { name: "Okayama Korakuen Garden", city: "Okayama", tags: ["Nature","Iconic"], lat: 34.6690, lng: 133.9343, image: "/images/chugoku/okayama-korakuen.jpg" },
  { name: "Okayama Castle", city: "Okayama", tags: ["Cultural","Historic"], lat: 34.6686, lng: 133.9350, image: "/images/chugoku/okayama-castle.jpg" },
  { name: "Kurashiki Bikan Historical Quarter", city: "Kurashiki", tags: ["Cultural","Scenic"], lat: 34.5956, lng: 133.7711, image: "/images/chugoku/kurashiki-bikan.jpg" },

  // — Shimane Prefecture
  { name: "Matsue Castle", city: "Matsue", tags: ["Cultural","Historic"], lat: 35.4753, lng: 133.0500, image: "/images/chugoku/matsue-castle.jpg" },
  { name: "Adachi Museum of Art", city: "Yasugi", tags: ["Cultural","Scenic"], lat: 35.3731, lng: 133.2501, image: "/images/chugoku/adachi-museum.jpg" },
  { name: "Izumo Taisha Shrine", city: "Izumo", tags: ["Cultural","Iconic"], lat: 35.3994, lng: 132.6853, image: "/images/chugoku/izumo-taisha.jpg" },

  // — Tottori Prefecture
  { name: "Tottori Sand Dunes", city: "Tottori", tags: ["Nature","Iconic"], lat: 35.5404, lng: 134.2207, image: "/images/chugoku/tottori-sand-dunes.jpg" },
  { name: "Sand Museum", city: "Tottori", tags: ["Cultural","Unique"], lat: 35.5364, lng: 134.2250, image: "/images/chugoku/sand-museum.jpg" },
  { name: "Mount Daisen", city: "Daisen", tags: ["Nature","Scenic"], lat: 35.3717, lng: 133.5461, image: "/images/chugoku/mount-daisen.jpg" },

  // — Yamaguchi Prefecture
  { name: "Kintaikyo Bridge", city: "Iwakuni", tags: ["Cultural","Scenic"], lat: 34.1667, lng: 132.1789, image: "/images/chugoku/kintaikyo-bridge.jpg" },
  { name: "Akiyoshido Cave", city: "Mine", tags: ["Nature","Unique"], lat: 34.2406, lng: 131.3344, image: "/images/chugoku/akiyoshido-cave.jpg" },
  { name: "Tsuwano Old Town", city: "Tsuwano", tags: ["Cultural","Historic"], lat: 34.4526, lng: 131.7723, image: "/images/chugoku/tsuwano-old-town.jpg" }
];
