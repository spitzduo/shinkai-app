// app/data/spots/kyushu.ts
export type Spot = {
  name: string;
  city: string;
  tags: string[];
  lat?: number;
  lng?: number;
  image?: string;
  regionZone?: string; // prefecture for clustering
};

export const kyushuSpots: Spot[] = [
  // — Fukuoka Prefecture
  {
    name: "Dazaifu Tenmangū",
    city: "Dazaifu",
    tags: ["Cultural","Iconic"],
    lat: 33.5206, lng: 130.5361,
    image: "/images/kyushu/dazaifu-tenmangu.jpg",
    regionZone: "Fukuoka",
  },
  {
    name: "Canal City Hakata",
    city: "Fukuoka",
    tags: ["Shopping","Entertainment"],
    lat: 33.5903, lng: 130.4124,
    image: "/images/kyushu/canal-city.jpg",
    regionZone: "Fukuoka",
  },
  {
    name: "Yanagawa Canal Cruise",
    city: "Yanagawa",
    tags: ["Scenic","Cultural"],
    lat: 33.1632, lng: 130.4081,
    image: "/images/kyushu/yanagawa-canal.jpg",
    regionZone: "Fukuoka",
  },

  // — Saga Prefecture
  {
    name: "Yoshinogari Historical Park",
    city: "Yoshinogari",
    tags: ["Cultural","Historic"],
    lat: 33.3301, lng: 130.3890,
    image: "/images/kyushu/yoshinogari.jpg",
    regionZone: "Saga",
  },
  {
    name: "Mifuneyama Rakuen",
    city: "Takeo",
    tags: ["Nature","Scenic"],
    lat: 33.1894, lng: 130.0203,
    image: "/images/kyushu/mifuneyama-rakuen.jpg",
    regionZone: "Saga",
  },

  // — Nagasaki Prefecture
  {
    name: "Huis Ten Bosch",
    city: "Sasebo",
    tags: ["Theme Park","Iconic"],
    lat: 33.0896, lng: 129.7863,
    image: "/images/kyushu/huis-ten-bosch.jpg",
    regionZone: "Nagasaki",
  },
  {
    name: "Glover Garden",
    city: "Nagasaki",
    tags: ["Cultural","Historic","Scenic"],
    lat: 32.7345, lng: 129.8680,
    image: "/images/kyushu/glover-garden.jpg",
    regionZone: "Nagasaki",
  },
  {
    name: "Hashima Island (Gunkanjima)",
    city: "Nagasaki",
    tags: ["Historic","Unique"],
    lat: 32.6278, lng: 129.7386,
    image: "/images/kyushu/hashima-island.jpg",
    regionZone: "Nagasaki",
  },

  // — Kumamoto Prefecture
  {
    name: "Kumamoto Castle",
    city: "Kumamoto",
    tags: ["Cultural","Historic","Iconic"],
    lat: 32.8031, lng: 130.7079,
    image: "/images/kyushu/kumamoto-castle.jpg",
    regionZone: "Kumamoto",
  },
  {
    name: "Mount Aso",
    city: "Aso",
    tags: ["Nature","Iconic"],
    lat: 32.8840, lng: 131.1042,
    image: "/images/kyushu/mount-aso.jpg",
    regionZone: "Kumamoto",
  },
  {
    name: "Kurokawa Onsen",
    city: "Minamioguni",
    tags: ["Relax","Scenic","Cultural"],
    lat: 33.0582, lng: 131.1457,
    image: "/images/kyushu/kurokawa-onsen.jpg",
    regionZone: "Kumamoto",
  },

  // — Ōita Prefecture
  {
    name: "Beppu Jigoku (Hell Tour)",
    city: "Beppu",
    tags: ["Nature","Unique"],
    lat: 33.2846, lng: 131.4911,
    image: "/images/kyushu/beppu-jigoku.jpg",
    regionZone: "Oita",
  },
  {
    name: "Yufuin Onsen",
    city: "Yufu",
    tags: ["Relax","Scenic","Cultural"],
    lat: 33.2656, lng: 131.3534,
    image: "/images/kyushu/yufuin-onsen.jpg",
    regionZone: "Oita",
  },

  // — Miyazaki Prefecture
  {
    name: "Takachiho Gorge",
    city: "Takachiho",
    tags: ["Nature","Iconic","Scenic"],
    lat: 32.7118, lng: 131.3076,
    image: "/images/kyushu/takachiho-gorge.jpg",
    regionZone: "Miyazaki",
  },
  {
    name: "Udo Shrine",
    city: "Nichinan",
    tags: ["Cultural","Scenic","Unique"],
    lat: 31.5414, lng: 131.3887,
    image: "/images/kyushu/udo-shrine.jpg",
    regionZone: "Miyazaki",
  },

  // — Kagoshima Prefecture
  {
    name: "Sakurajima",
    city: "Kagoshima",
    tags: ["Nature","Iconic"],
    lat: 31.5933, lng: 130.6573,
    image: "/images/kyushu/sakurajima.jpg",
    regionZone: "Kagoshima",
  },
  {
    name: "Sengan-en Garden",
    city: "Kagoshima",
    tags: ["Nature","Cultural","Scenic"],
    lat: 31.6385, lng: 130.6014,
    image: "/images/kyushu/sengan-en.jpg",
    regionZone: "Kagoshima",
  },
];
