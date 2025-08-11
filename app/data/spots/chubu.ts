// app/data/spots/chubu.ts
export type Spot = {
  name: string;
  city: string;
  tags: string[];
  lat?: number;
  lng?: number;
  image?: string;
  regionZone?: string;
};

export const chubuSpots: Spot[] = [
  // — Fuji Five Lakes (Yamanashi)
  { name: "Lake Kawaguchi", city: "Fujikawaguchiko", tags: ["Scenic","Iconic"], lat: 35.517, lng: 138.759, image: "/images/chubu/lake-kawaguchi.jpg" },
  { name: "Chureito Pagoda", city: "Fujiyoshida", tags: ["Viewpoint","Iconic","Cultural"], lat: 35.501, lng: 138.808, image: "/images/chubu/chureito-pagoda.jpg" },
  { name: "Oshino Hakkai", city: "Oshino", tags: ["Nature","Scenic"], lat: 35.460, lng: 138.843, image: "/images/chubu/oshino-hakkai.jpg" },
  { name: "Fuji-Q Highland", city: "Fujiyoshida", tags: ["Theme Park","Family","Iconic"], lat: 35.488, lng: 138.780, image: "/images/chubu/fuji-q-highland.jpg" },

  // — Nagano / Alps
  { name: "Matsumoto Castle", city: "Matsumoto", tags: ["Cultural","Iconic"], lat: 36.238, lng: 137.969, image: "/images/chubu/matsumoto-castle.jpg" },
  { name: "Kamikōchi", city: "Matsumoto", tags: ["Nature","Scenic"], lat: 36.245, lng: 137.633, image: "/images/chubu/kamikochi.jpg" },
  { name: "Jigokudani Snow Monkey Park", city: "Yamanouchi", tags: ["Nature","Family"], lat: 36.733, lng: 138.463, image: "/images/chubu/jigokudani-monkeys.jpg" },

  // — Gifu
  { name: "Takayama Old Town", city: "Takayama", tags: ["Cultural","Historic"], lat: 36.143, lng: 137.255, image: "/images/chubu/takayama-old-town.jpg" },
  { name: "Hida Folk Village", city: "Takayama", tags: ["Cultural","Open-air Museum"], lat: 36.141, lng: 137.236, image: "/images/chubu/hida-folk-village.jpg" },
  { name: "Shirakawa-go Gassho Village", city: "Shirakawa", tags: ["UNESCO","Cultural","Scenic"], lat: 36.260, lng: 136.909, image: "/images/chubu/shirakawa-go.jpg" },

  // — Ishikawa / Toyama
  { name: "Kenrokuen Garden", city: "Kanazawa", tags: ["Cultural","Nature","Iconic"], lat: 36.562, lng: 136.662, image: "/images/chubu/kenrokuen.jpg" },
  { name: "Ōmichō Market", city: "Kanazawa", tags: ["Food","Shopping"], lat: 36.574, lng: 136.653, image: "/images/chubu/omicho-market.jpg" },
  { name: "Kurobe Dam (Tateyama Kurobe)", city: "Tateyama/Kurobe", tags: ["Viewpoint","Scenic"], lat: 36.561, lng: 137.667, image: "/images/chubu/kurobe-dam.jpg" },

  // — Aichi / Nagoya
  { name: "Nagoya Castle", city: "Nagoya", tags: ["Cultural","Iconic"], lat: 35.185, lng: 136.899, image: "/images/chubu/nagoya-castle.jpg" },
  { name: "Toyota Commemorative Museum", city: "Nagoya", tags: ["Cultural","Museum"], lat: 35.177, lng: 136.882, image: "/images/chubu/toyota-commemorative-museum.jpg" },

  // — Kiso Valley (Nakasendō)
  { name: "Magome-juku", city: "Nakatsugawa", tags: ["Historic","Scenic"], lat: 35.530, lng: 137.607, image: "/images/chubu/magome-juku.jpg" },
  { name: "Tsumago-juku", city: "Nagiso", tags: ["Historic","Scenic"], lat: 35.586, lng: 137.595, image: "/images/chubu/tsumago-juku.jpg" },
];
