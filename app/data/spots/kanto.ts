// ===============================
// app/data/spots/kanto.ts
// ===============================
export type Spot = {
  name: string;
  city: string;
  tags: string[];
  lat?: number;
  lng?: number;
  image?: string;
  regionZone?: string;
};

export const kantoSpots: Spot[] = [
  // --- Tokyo Core ---
  { name: "Tokyo Skytree", city: "Sumida", tags: ["Iconic","Viewpoint"], lat: 35.7101, lng: 139.8107, image: "/images/kanto/tokyo-skytree.jpg" },
  { name: "Sensō-ji (Sensoji)", city: "Asakusa", tags: ["Cultural","Iconic","Shopping"], lat: 35.7148, lng: 139.7967, image: "/images/kanto/senso-ji-sensoji.jpg" },
  { name: "Nakamise Shopping Street", city: "Asakusa", tags: ["Shopping","Food"], lat: 35.7129, lng: 139.7966, image: "/images/kanto/nakamise.jpg" },
  { name: "Ueno Park & Museums", city: "Ueno", tags: ["Cultural","Nature"], lat: 35.7156, lng: 139.7730, image: "/images/kanto/ueno-park.jpg" },
  { name: "Meiji Jingu Shrine", city: "Shibuya", tags: ["Cultural","Nature"], lat: 35.6764, lng: 139.6993, image: "/images/kanto/meiji-jingu.jpg" },
  { name: "Takeshita Street (Harajuku)", city: "Shibuya", tags: ["Shopping","Fashion"], lat: 35.6717, lng: 139.7036, image: "/images/kanto/takeshita-street.jpg" },
  { name: "Shibuya Crossing & Scramble Square", city: "Shibuya", tags: ["Iconic","Viewpoint","Shopping"], lat: 35.6595, lng: 139.7005, image: "/images/kanto/shibuya-crossing.jpg" },
  { name: "teamLab (Digital Art Museum)", city: "Tokyo", tags: ["Family","Iconic"], lat: 35.6511, lng: 139.7966, image: "/images/kanto/teamlab.jpg" },
  { name: "Odaiba Seaside Park", city: "Odaiba", tags: ["Scenic","Viewpoint"], lat: 35.6303, lng: 139.7742, image: "/images/kanto/odaiba.jpg" },
  { name: "Tsukiji Outer Market", city: "Chūō", tags: ["Food","Shopping"], lat: 35.6655, lng: 139.7708, image: "/images/kanto/tsukiji-market.jpg" },
  { name: "Imperial Palace East Gardens", city: "Chiyoda", tags: ["Cultural","Nature"], lat: 35.6852, lng: 139.7528, image: "/images/kanto/imperial-palace-east-gardens.jpg" },
  { name: "Akihabara Electric Town", city: "Chiyoda", tags: ["Shopping","Pop Culture"], lat: 35.6986, lng: 139.7731, image: "/images/kanto/akihabara.jpg" },
  { name: "Shinjuku Gyoen National Garden", city: "Shinjuku", tags: ["Nature","Scenic"], lat: 35.6852, lng: 139.7100, image: "/images/kanto/shinjuku-gyoen.jpg" },

  // --- Theme Park option (1 full day) ---
  { name: "Tokyo DisneySea", city: "Urayasu", tags: ["Theme Park","Family","Iconic"], lat: 35.6263, lng: 139.8836, image: "/images/kanto/tokyo-disneysea.jpg" },

  // --- Day trips / Nearby ---
  { name: "Yokohama Minato Mirai", city: "Yokohama", tags: ["Scenic","Shopping"], lat: 35.4576, lng: 139.6350, image: "/images/kanto/minato-mirai.jpg" },
  { name: "Yokohama Chinatown", city: "Yokohama", tags: ["Food","Shopping"], lat: 35.4390, lng: 139.6510, image: "/images/kanto/yokohama-chinatown.jpg" },
  { name: "Kamakura Great Buddha (Kōtoku-in)", city: "Kamakura", tags: ["Cultural","Iconic"], lat: 35.3167, lng: 139.5353, image: "/images/kanto/kamakura-daibutsu.jpg" },
  { name: "Enoshima Island", city: "Fujisawa", tags: ["Nature","Scenic"], lat: 35.2992, lng: 139.4800, image: "/images/kanto/enoshima.jpg" },
  { name: "Nikkō Tōshōgū Shrine", city: "Nikkō", tags: ["UNESCO","Cultural","Iconic"], lat: 36.7575, lng: 139.5986, image: "/images/kanto/nikko-toshogu.jpg" },
];