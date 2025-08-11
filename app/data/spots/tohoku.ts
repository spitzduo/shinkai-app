// app/data/spots/tohoku.ts
export type Spot = {
  name: string;
  city: string;
  tags: string[];
  lat?: number;
  lng?: number;
  image?: string;
  regionZone?: string;
};

export const tohokuSpots: Spot[] = [
  // — Aomori
  { name: "Nebuta Museum WA-RASSE", city: "Aomori", tags: ["Cultural","Iconic"], image: "/images/tohoku/nebuta-museum.jpg", lat: 40.830599, lng: 140.734116 }, // :contentReference[oaicite:0]{index=0}
  { name: "Hirosaki Castle & Park", city: "Hirosaki", tags: ["Cultural","Scenic"], image: "/images/tohoku/hirosaki-castle.jpg", lat: 40.60694, lng: 140.46444 }, // :contentReference[oaicite:1]{index=1}
  // Oirase is a 14km stream walk; anchor at Nenokuchi gate (trailhead)
  { name: "Oirase Gorge", city: "Towada", tags: ["Nature","Scenic"], image: "/images/tohoku/oirase-gorge.jpg", lat: 40.4667, lng: 140.9330 }, // Nenokuchi trailhead :contentReference[oaicite:2]{index=2}
  { name: "Lake Towada", city: "Towada", tags: ["Nature","Scenic"], image: "/images/tohoku/lake-towada.jpg", lat: 40.4672, lng: 140.8860 }, // :contentReference[oaicite:3]{index=3}

  // — Akita
  { name: "Kakunodate Samurai District", city: "Semboku", tags: ["Historic","Cultural","Scenic"], image: "/images/tohoku/kakunodate-samurai-district.jpg", lat: 39.58806, lng: 140.58194 }, // 
  { name: "Nyuto Onsen (Tsurunoyu)", city: "Semboku", tags: ["Onsen","Relaxation","Nature"], image: "/images/tohoku/nyuto-onsen.jpg", lat: 39.773729, lng: 140.799300 }, // 
  { name: "Lake Tazawa", city: "Semboku", tags: ["Nature","Scenic"], image: "/images/tohoku/lake-tazawa.jpg", lat: 39.706389, lng: 140.676111 }, // 

  // — Iwate
  { name: "Chūson-ji (Konjikidō)", city: "Hiraizumi", tags: ["UNESCO","Cultural","Iconic"], image: "/images/tohoku/chusonji-konjikido.jpg", lat: 39.00111, lng: 141.10778 }, // UNESCO/Hiraizumi listing :contentReference[oaicite:7]{index=7}
  // Use Geibikei Station (closest rail/entrance) as the map anchor
  { name: "Geibikei Gorge", city: "Ichinoseki", tags: ["Nature","Scenic"], image: "/images/tohoku/geibikei-gorge.jpg", lat: 38.9892, lng: 141.2533 }, // station coords :contentReference[oaicite:8]{index=8}
  { name: "Jōdogahama Beach", city: "Miyako", tags: ["Nature","Scenic"], image: "/images/tohoku/jodogahama-beach.jpg", lat: 39.650278, lng: 141.985278 }, // :contentReference[oaicite:9]{index=9}

  // — Miyagi
  { name: "Matsushima Bay", city: "Matsushima", tags: ["Scenic","Iconic"], image: "/images/tohoku/matsushima-bay.jpg", lat: 38.366667, lng: 141.083333 }, // 
  { name: "Zuigan-ji Temple", city: "Matsushima", tags: ["Cultural","Historic"], image: "/images/tohoku/zuiganji.jpg", lat: 38.372178, lng: 141.059597 }, // :contentReference[oaicite:11]{index=11}
  { name: "Zuihōden Mausoleum", city: "Sendai", tags: ["Cultural","Historic"], image: "/images/tohoku/zuihoden.jpg", lat: 38.250806, lng: 140.865694 }, // :contentReference[oaicite:12]{index=12}
  { name: "Aoba Castle Ruins (Sendai Castle)", city: "Sendai", tags: ["Historic","Viewpoint"], image: "/images/tohoku/aoba-castle-ruins.jpg", lat: 38.25205, lng: 140.85586 }, // 

  // — Yamagata
  { name: "Yamadera (Risshaku-ji)", city: "Yamagata", tags: ["Cultural","Viewpoint","Scenic"], image: "/images/tohoku/yamadera.jpg", lat: 38.312556, lng: 140.437389 }, // :contentReference[oaicite:14]{index=14}
  { name: "Ginzan Onsen", city: "Obanazawa", tags: ["Onsen","Historic","Scenic"], image: "/images/tohoku/ginzan-onsen.jpg", lat: 38.5672, lng: 140.5260 }, // :contentReference[oaicite:15]{index=15}
  { name: "Zao Okama Crater", city: "Zao", tags: ["Nature","Viewpoint"], image: "/images/tohoku/zao-okama-crater.jpg", lat: 38.13639, lng: 140.44944 }, // 

  // — Fukushima
  { name: "Ōuchi-juku", city: "Shimogō", tags: ["Historic","Scenic"], image: "/images/tohoku/ouchi-juku.jpg", lat: 37.2592, lng: 139.8475 }, // :contentReference[oaicite:17]{index=17}
  { name: "Tsuruga Castle (Aizu-Wakamatsu Castle)", city: "Aizu-Wakamatsu", tags: ["Cultural","Iconic"], image: "/images/tohoku/tsuruga-castle.jpg", lat: 37.486899, lng: 139.929235 }, // :contentReference[oaicite:18]{index=18}
  { name: "Goshikinuma (Five Colored Ponds)", city: "Kitashiobara", tags: ["Nature","Scenic"], image: "/images/tohoku/goshikinuma.jpg", lat: 37.738889, lng: 140.076111 }, // :contentReference[oaicite:19]{index=19}
];
