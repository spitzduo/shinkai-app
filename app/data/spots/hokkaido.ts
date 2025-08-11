// app/data/spots/hokkaido.ts
export type Spot = {
  name: string;
  city: string;
  tags: string[];
  lat?: number;
  lng?: number;
  image?: string;
  regionZone?: string;
};

export const hokkaidoSpots: Spot[] = [
  // Sapporo
  { name: "Odori Park", city: "Sapporo", tags: ["Iconic","Scenic"], lat: 43.0615, lng: 141.356, image: "/images/hokkaido/odori-park.jpg" },
  { name: "Sapporo Clock Tower", city: "Sapporo", tags: ["Cultural","Iconic"], lat: 43.0621, lng: 141.353, image: "/images/hokkaido/sapporo-clock-tower.jpg" },
  { name: "Sapporo Beer Museum", city: "Sapporo", tags: ["Cultural","Food"], lat: 43.0739, lng: 141.3644, image: "/images/hokkaido/sapporo-beer-museum.jpg" },
  { name: "Shiroi Koibito Park", city: "Sapporo", tags: ["Family","Food"], lat: 43.0911, lng: 141.2723, image: "/images/hokkaido/shiroi-koibito-park.jpg" },

  // Otaru / Yoichi
  { name: "Otaru Canal", city: "Otaru", tags: ["Scenic","Iconic"], lat: 43.1991, lng: 141.0027, image: "/images/hokkaido/otaru-canal.jpg" },
  { name: "Nikka Whisky Yoichi Distillery", city: "Yoichi", tags: ["Cultural","Food"], lat: 43.1968, lng: 140.7796, image: "/images/hokkaido/yoichi-nikka.jpg" },

  // Asahikawa / Furano / Biei
  { name: "Asahiyama Zoo", city: "Asahikawa", tags: ["Family","Iconic"], lat: 43.7683, lng: 142.4766, image: "/images/hokkaido/asahiyama-zoo.jpg" },
  { name: "Blue Pond (Aoiike)", city: "Biei", tags: ["Nature","Scenic"], lat: 43.4931, lng: 142.6149, image: "/images/hokkaido/blue-pond-aoiike.jpg" },
  { name: "Shikisai-no-Oka", city: "Biei", tags: ["Nature","Scenic"], lat: 43.58, lng: 142.4656, image: "/images/hokkaido/shikisai-no-oka.jpg" },
  { name: "Farm Tomita", city: "Furano", tags: ["Nature","Scenic"], lat: 43.416, lng: 142.4656, image: "/images/hokkaido/farm-tomita.jpg" },

  // Noboribetsu / Lake Toya
  { name: "Noboribetsu Hell Valley", city: "Noboribetsu", tags: ["Nature","Viewpoint"], lat: 42.492, lng: 141.1472, image: "/images/hokkaido/noboribetsu-hell-valley.jpg" },
  { name: "Lake Toya", city: "Toyako", tags: ["Nature","Scenic"], lat: 42.6069, lng: 140.8267, image: "/images/hokkaido/lake-toya.jpg" },

  // Hakodate
  { name: "Mount Hakodate Night View", city: "Hakodate", tags: ["Viewpoint","Iconic"], lat: 41.7551, lng: 140.7025, image: "/images/hokkaido/mount-hakodate-night.jpg" },
  { name: "Hakodate Morning Market", city: "Hakodate", tags: ["Food","Shopping"], lat: 41.7731, lng: 140.7261, image: "/images/hokkaido/hakodate-morning-market.jpg" },

  // Niseko
  { name: "Niseko Grand Hirafu", city: "Kutchan / Niseko", tags: ["Nature","Scenic","Family"], lat: 42.8666, lng: 140.7041, image: "/images/hokkaido/niseko-grand-hirafu.jpg" },
];
