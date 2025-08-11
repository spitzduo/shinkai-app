// app/data/descriptions.ts
// Central library for place blurbs + alias resolution used across itinerary pages.
// Exported items:
//  - DESCRIPTIONS: canonical name -> short description
//  - ALIASES: common variants -> canonical name (must match keys in DESCRIPTIONS)
//  - normalize(s): helper to strip accents/symbols for fuzzy matching
//  - resolveAlias(name): returns canonical name if a known alias exists; else returns input

export type DescriptionMap = Record<string, string>;
export type AliasMap = Record<string, string>;

export const normalize = (s: string): string =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^a-z0-9]+/g, " ") // non-alphanumerics -> spaces
    .replace(/\s{2,}/g, " ") // collapse whitespace
    .trim();

export const DESCRIPTIONS: DescriptionMap = {
  // ==== Kansai (Kyoto, Osaka, Nara, Kobe) ====
  "Fushimi Inari Taisha": "Thousands of vermilion torii gates climbing Mt. Inari. Best at dawn or late afternoon for softer light.",
  "Kinkaku-ji (Golden Pavilion)": "Kyoto’s gilded Zen temple mirrored in a pond; a short scenic loop path with classic views.",
  "Kiyomizu-dera": "Temple on wooden stilts with sweeping Kyoto views. Approach via Sannenzaka stone lanes for atmosphere.",
  "Arashiyama Bamboo Grove": "Otherworldly bamboo forest walk. Go early, pair with Tenryu-ji gardens and the riverside.",
  "Gion Stroll": "Historic geisha district of wooden machiya, tea houses, and narrow lanes—magical at dusk.",
  "Osaka Castle": "Iconic white-and-gold keep set in vast parklands. Museum inside; views from the top floor.",
  "Dotonbori": "Neon, canals, and street eats. Try takoyaki or okonomiyaki and snap the Glico running man.",
  "Umeda Sky Building": "Twin-tower observatory with a floating garden deck; 360° Osaka skyline at sunset.",
  "Nara Park & Deer": "Bow to meet friendly deer amid lawns and temples. Buy special crackers—watch your maps and tickets!",
  "Tōdai-ji Daibutsuden": "Vast wooden hall housing the Great Buddha. Awe-inspiring architecture in every season.",
  "Kasuga Taisha": "Lantern-lined shrine paths through a primeval forest; stone and bronze lanterns glow during festivals.",

  // ==== Kanto (Tokyo, Hakone, Nikko) ====
  "Senso-ji (Asakusa)": "Tokyo’s oldest temple with Kaminarimon gate and Nakamise shopping street.",
  "Meiji Jingu": "Serene shrine within a forested park near Harajuku—oasis from the city rush.",
  "Shibuya Crossing": "World-famous scramble. Best viewed from nearby terraces after a lap through Center Gai.",
  "Tokyo Skytree": "Japan’s tallest tower with expansive views; pair with Solamachi shops and Sumida riverside.",
  "teamLab Planets": "Immersive digital art you wade through barefoot. Book timed tickets early.",
  "Nikko Toshogu": "Lavishly carved shrine complex set in cedar forests; UNESCO World Heritage.",
  "Hakone Open-Air Museum": "Sculpture park blending art and mountains; great with the Hakone loop.",
  "Lake Ashi (Hakone)": "Scenic lake cruises and torii-on-the-water views; glimpse Mt. Fuji on clear days.",

  // ==== Chubu (Alps, Takayama, Shirakawa-go) ====
  "Shirakawa-go": "Gassho-zukuri thatched farmhouses in a valley village; postcard-perfect in snow.",
  "Takayama Old Town": "Edo-era streets, sake breweries, and morning markets—slow, charming strolls.",
  "Kamikochi": "Crystal-clear river and alpine meadows beneath soaring peaks—prime day-hike base.",
  "Tateyama Kurobe Alpine Route": "Epic mountain transit with snow walls in spring and panoramic ropeways in summer-autumn.",

  // ==== Chugoku / Hiroshima ====
  "Itsukushima Shrine (Miyajima)": "Floating torii and shrine over the tide; deer roam, hike up to Mt. Misen for views.",
  "Hiroshima Peace Memorial Park": "Reflective park, museum, and A-Bomb Dome—solemn, essential history.",

  // ==== Shikoku ====
  "Ritsurin Garden": "Masterpiece of daimyo landscaping—tea houses, ponds, and pine-covered hills.",

  // ==== Kyushu ====
  "Kumamoto Castle": "Formidable black castle with distinctive curved stone walls; ongoing restoration.",
  "Mount Aso": "Vast caldera landscapes and steaming craters; check safety closures before visiting.",
  "Beppu Hells": "Colorful hot spring pools and steamy streets—quirky, photogenic geothermal stop.",

  // ==== Tohoku ====
  "Hirosaki Castle & Park": "Moat-ringed castle famed for cherry blossoms and autumn leaves.",
  "Oirase Gorge": "Mossy riverside trail with cascades between Yakeyama and Lake Towada.",
  "Lake Towada": "Caldera lake with scenic cruises and lakeside walks; brilliant foliage in fall.",
  "Ginzan Onsen": "Taisho-era ryokan town, gas lamps over a stream—storybook winter snow scene.",
  "Zao Fox Village": "Hillside sanctuary with playful foxes; combine with Zao Onsen or Shiroishi.",
  "Yamadera (Risshaku-ji)": "Clifftop temple reached via 1,000 steps—sweeping valley views at the summit.",

  // ==== Hokkaido ====
  "Otaru Canal": "Stone warehouses and lanterns along a romantic canal; great for evening strolls.",
  "Sapporo Odori Park": "Central green axis with festivals year-round; nearby TV Tower views.",
  "Blue Pond (Biei)": "Unnatural cobalt waters framed by larches; most vivid on still days.",
  "Biei Patchwork Road": "Rolling farm vistas and viewpoints—best by car or e-bike in summer.",
  "Farm Tomita (Furano)": "Lavender and flower fields—peak color mid-July; cafe and scent shops on-site.",
  "Niseko": "Powder capital in winter; summer brings rafting, cycling, and clear Mt. Yotei views.",

  // ==== Okinawa ====
  "Shurijo Castle": "Rebuilt Ryukyu royal palace with red lacquer halls and island history exhibits.",
  "Churaumi Aquarium": "One of Japan’s best aquariums—massive tank with whale sharks and manta rays.",
  "Kouri Bridge": "Turquoise seas on both sides of a scenic drive to Kouri Island.",

  // ==== Theme Parks ====
  "Tokyo DisneySea": "Uniquely themed ports, world-class shows, and seasonal events; reserve Premier Access.",
};

// Common alternate spellings and short forms
export const ALIASES: AliasMap = {
  // Kansai
  "fushimi": "Fushimi Inari Taisha",
  "fushimi inari": "Fushimi Inari Taisha",
  "kinkakuji": "Kinkaku-ji (Golden Pavilion)",
  "golden pavilion": "Kinkaku-ji (Golden Pavilion)",
  "kiyomizudera": "Kiyomizu-dera",
  "arashiyama bamboo": "Arashiyama Bamboo Grove",
  "gion": "Gion Stroll",
  "osaka castle": "Osaka Castle",
  "dotonbori": "Dotonbori",
  "umeda sky": "Umeda Sky Building",
  "nara deer": "Nara Park & Deer",
  "todai ji": "Tōdai-ji Daibutsuden",
  "kasuga": "Kasuga Taisha",

  // Kanto
  "sensoji": "Senso-ji (Asakusa)",
  "asakusa temple": "Senso-ji (Asakusa)",
  "meiji shrine": "Meiji Jingu",
  "shibuya": "Shibuya Crossing",
  "skytree": "Tokyo Skytree",
  "teamlab": "teamLab Planets",
  "teamlab planets": "teamLab Planets",
  "nikko toshogu": "Nikko Toshogu",
  "hakone open air": "Hakone Open-Air Museum",
  "lake ashi": "Lake Ashi (Hakone)",

  // Chubu
  "shirakawago": "Shirakawa-go",
  "takayama old town": "Takayama Old Town",
  "kamikouchi": "Kamikochi",
  "alpine route": "Tateyama Kurobe Alpine Route",

  // Chugoku / Hiroshima
  "miyajima": "Itsukushima Shrine (Miyajima)",
  "itsukushima shrine": "Itsukushima Shrine (Miyajima)",
  "hiroshima peace park": "Hiroshima Peace Memorial Park",

  // Shikoku
  "ritsurin": "Ritsurin Garden",

  // Kyushu
  "kumamoto": "Kumamoto Castle",
  "mt aso": "Mount Aso",
  "beppu": "Beppu Hells",

  // Tohoku
  "hirosaki castle": "Hirosaki Castle & Park",
  "oirase": "Oirase Gorge",
  "towada": "Lake Towada",
  "ginzan": "Ginzan Onsen",
  "fox village": "Zao Fox Village",
  "yamadera": "Yamadera (Risshaku-ji)",

  // Hokkaido
  "otaru": "Otaru Canal",
  "sapporo odori": "Sapporo Odori Park",
  "blue pond": "Blue Pond (Biei)",
  "biei": "Biei Patchwork Road",
  "farm tomita": "Farm Tomita (Furano)",
  "niseko": "Niseko",

  // Okinawa
  "shuri castle": "Shurijo Castle",
  "churaumi": "Churaumi Aquarium",
  "kouri": "Kouri Bridge",

  // Theme Parks
  "disneysea": "Tokyo DisneySea",
  "tokyo disney sea": "Tokyo DisneySea",
};

// Resolve an input string to a canonical name if an alias exists
export const resolveAlias = (input: string, aliases: AliasMap = ALIASES): string => {
  const n = normalize(input);
  // Try direct key hit
  if (DESCRIPTIONS[input]) return input;

  // Try normalized alias map by building a normalized lookup
  const normalizedMap: Record<string, string> = {};
  for (const [k, v] of Object.entries(aliases)) {
    normalizedMap[normalize(k)] = v;
  }
  return normalizedMap[n] ?? input;
};
