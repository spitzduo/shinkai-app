"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

// ===== Types =====
type Spot = {
  id?: string;
  name: string;
  city: string;
  duration?: string;
  lat?: number;
  lng?: number;
  tags?: string[];
  image?: string;         // photo URL (user-provided or stock)
  description?: string;   // printable description
};

type ItineraryDay = {
  day: number; // 1-based label, we will renumber on save
  title?: string;
  notes?: string;
  spots: Spot[];
};

type ItinerarySave = {
  region: string;
  totalDays: number;
  themeDayReserved: boolean;
  themeParkName?: string;
  days: ItineraryDay[];
};

// ===== Storage Keys =====
const PLAN_KEY = (region: string | string[]) => `se_itinerary_${region}_plan_v1`;
const SUMMARY_KEY = (region: string | string[]) => `se_itinerary_${region}_summary_v1`;

// ===== Light description library & helpers =====
// Expand this map over time; keys must exactly match spot names (s.name)
// app/data/descriptions.ts

// Curated one-liners used across cards, modals, and tooltips
const DESCRIPTIONS: Record<string, string> = {
  // --- Kansai ---
  "Fushimi Inari Taisha": "Walk through thousands of vermilion torii gates snaking up Mt. Inari. Best early morning or late afternoon for softer light and fewer crowds.",
  "Kinkaku-ji (Golden Pavilion)": "Kyoto’s shimmering Zen temple reflected in a mirror-still pond. Photos are best from the outer garden loop.",
  "Gion Stroll": "Historic geisha district lined with wooden machiya houses, tea rooms, and narrow lanes—perfect for an evening wander.",
  "Nara Park & Deer": "Meet Nara’s friendly bowing deer. Bring a pack of senbei crackers and keep an eye on your maps and pockets!",
  "Tōdai-ji Daibutsuden": "Home to the Great Buddha. The vast wooden hall and temple grounds are awe-inspiring in any season.",
  "Kasuga Taisha": "An ancient Shinto shrine famous for its stone and bronze lanterns tucked into a mystical cedar forest.",
  "Universal Studios Japan": "A full day of rides and worlds—from Super Nintendo World to the Wizarding World—plan timed entries for popular zones.",
  "Dotonbori": "Neon-lit canal district known for takoyaki, okonomiyaki, and iconic signs like the Glico Running Man.",
  "Osaka Castle": "A restored hilltop keep with a museum inside and cherry-ringed park outside—great for wide city views.",
  "Kobe Harborland": "Waterfront promenade with shops, Ferris wheel, and night views across the bay.",
  "Kobe Beef Dinner": "Indulge in melt-in-your-mouth wagyu at a certified teppanyaki house—reserve ahead for the top cuts.",
  "Arashiyama Bamboo Grove": "Lose yourself in towering bamboo, a soft green tunnel perfect at dawn before crowds build. Pair with nearby Tenryu-ji or the river walk.",
  "Philosopher's Path": "A gentle canal-side stroll under hundreds of cherry trees linking Ginkaku-ji to Nanzen-ji—best in spring and with cozy cafés along the way.",

  // --- Hokkaido ---
  "Odori Park": "Sapporo’s green spine—seasonal festivals, snow sculptures in winter, beer gardens in summer. Easy stroll between TV Tower and the park blocks.",
  "Sapporo Clock Tower": "A Meiji-era icon and quick photo stop; small museum inside tells the city’s pioneer story.",
  "Sapporo Beer Museum": "Explore Hokkaido’s brewing heritage, then sample a tasting flight. Pair with Genghis Khan BBQ next door.",
  "Shiroi Koibito Park": "Playful chocolate factory, whimsical façades, and a glass-roofed courtyard café—fun for families and sweet tooths.",
  "Otaru Canal": "Stone warehouses and gas lamps along a romantic canal—best at dusk. Combine with sushi streets and glass workshops nearby.",
  "Nikka Whisky Yoichi Distillery": "Atmospheric brick campus where Nikka began. Book a guided tour and finish with a peat-kissed tasting.",
  "Asahiyama Zoo": "Famous for immersive enclosures—don’t miss the winter penguin parade and underwater viewing tunnels.",
  "Blue Pond (Aoiike)": "Surreal, milky-blue water dotted with larches; most photogenic in early morning calm. Combine with nearby waterfalls.",
  "Shikisai-no-Oka": "Undulating flower fields like patchwork quilts—tractor rides and viewpoints for wide countryside vistas.",
  "Farm Tomita": "Lavender rows peak mid-July; cafés serve fragrant soft-serve and seasonal desserts.",
  "Noboribetsu Hell Valley": "Steaming vents and sulfur pools on short boardwalks—dramatic geology with easy access from onsen town.",
  "Lake Toya": "Serene caldera lake with cruises and lakeside walks; clear days reveal Mt. Usu and the cone of Mt. Yotei.",
  "Mount Hakodate Night View": "One of Japan’s ‘three great night views’—ropeway to the summit for the glittering hourglass cityscape.",
  "Hakodate Morning Market": "Lively seafood stalls from dawn—try a build-your-own kaisendon and browse local produce.",
  "Niseko Grand Hirafu": "Legendary light powder in winter; in green season enjoy hiking, rafting, and Mt. Yotei vistas.",

  // --- Kanto ---
  "Tokyo Skytree": "Sky-high views over the metropolis—book sunset slots for golden hour and twilight.",
  "Sensō-ji (Sensoji)": "Tokyo’s oldest temple; approach via Nakamise’s snack stalls and souvenir shops, then step into incense-swirled grounds.",
  "Nakamise Shopping Street": "Century-old arcade of traditional snacks and crafts—perfect for gifts and quick bites before/after Sensō-ji.",
  "Ueno Park & Museums": "A cultural hub with major museums and spring cherry blossoms; easy to mix and match based on interests.",
  "Meiji Jingu Shrine": "Serene cedar-lined approach leads to a grand Shinto shrine—calm oasis beside Harajuku’s buzz.",
  "Takeshita Street (Harajuku)": "Trendy teen fashion, crepes, and character cafés—short but lively strip right by JR Harajuku.",
  "Shibuya Crossing & Scramble Square": "Iconic crosswalk views from street level or rooftop; explore backstreets for cafés and records.",
  "teamLab (Digital Art Museum)": "Immersive, camera-loving light installations—reserve timed tickets; dark floors, comfy shoes.",
  "Odaiba Seaside Park": "Breezy waterfront with Rainbow Bridge views—pair with museums, malls, and sunset walks.",
  "Tsukiji Outer Market": "Seafood snacks, knives, tea—go early for energy and lighter crowds; cash-friendly stalls.",
  "Imperial Palace East Gardens": "Moats, stone walls, and seasonal gardens—free entry; closed Mondays/Fridays.",
  "Akihabara Electric Town": "Retro game shops, anime merch, and electronics—arcades and themed cafés tucked in the alleys.",
  "Shinjuku Gyoen National Garden": "Formal French/English/Japanese gardens—quiet lawns, greenhouse, and seasonal color.",
  "Tokyo DisneySea": "Unique to Japan; elaborately themed ports and great shows—use the app for standby passes and timings.",
  "Yokohama Minato Mirai": "Harborside promenades, landmark ferris wheel, and shopping—great night views.",
  "Yokohama Chinatown": "One of the world’s largest—dim sum, buns, and neon gates across compact streets.",
  "Kamakura Great Buddha (Kōtoku-in)": "Outdoor bronze Buddha amid temple town vibes—combine with Hase-dera and coastal walks.",
  "Enoshima Island": "Caves, shrine, and lighthouse views—ocean breezes and seafood shacks along the causeway.",
  "Nikkō Tōshōgū Shrine": "Lavish carvings, five-story pagoda, and cedar avenues—allow time for uphill steps.",

  // --- Chūbu ---
  "Lake Kawaguchi": "Classic Fuji views from lakeside promenades and cafés; best light at sunrise or late afternoon.",
  "Chureito Pagoda": "Iconic five-story pagoda framing Mt Fuji—expect steps; sunrise cherry blossom shots are famous.",
  "Oshino Hakkai": "Crystal-clear spring ponds and thatched roofs—short, scenic stroll with snack stalls.",
  "Fuji-Q Highland": "Record-chasing coasters and Fuji backdrops—reserve priority passes for big rides.",
  "Matsumoto Castle": "Striking black-and-white keep with mountain views—one of Japan’s premier original castles.",
  "Kamikōchi": "Alpine valley of turquoise rivers and larch forests—flat boardwalks; bring layers for changeable weather.",
  "Jigokudani Snow Monkey Park": "Wild macaques soaking in hot springs—winter is peak, but trails can be icy.",
  "Takayama Old Town": "Preserved merchant streets, sake breweries, and morning markets—wander at dawn for quiet lanes.",
  "Hida Folk Village": "Open-air museum of gasshō-style farmhouses—hands-on craft corners and lake reflections.",
  "Shirakawa-go Gassho Village": "UNESCO hamlet with steep thatched roofs—viewpoint above the village is a must.",
  "Kenrokuen Garden": "One of Japan’s top three gardens—lanterns, ponds, and seasonal displays; arrive early.",
  "Ōmichō Market": "Bustling seafood and produce market—grab a bowl of kaisen-don for lunch.",
  "Kurobe Dam (Tateyama Kurobe)": "Japan’s tallest dam with dramatic spray and ridge views—alpine route transport is seasonal.",
  "Nagoya Castle": "Rebuilt keep with golden shachihoko ornaments—stroll reconstructed palace rooms.",
  "Toyota Commemorative Museum": "From textile looms to cars—surprisingly hands-on museum in red-brick halls.",
  "Magome-juku": "Stone-paved post town with valley views—start of a classic Nakasendō hike to Tsumago.",
  "Tsumago-juku": "Beautifully preserved Edo-era post town—car-free lanes and wooden inns.",

  // --- Tōhoku ---
  "Nebuta Museum WA-RASSE": "Aomori’s year-round home of the Nebuta Festival—glowing floats up close with music and maker stories.",
  "Hirosaki Castle & Park": "Cherry-blossom famous grounds around a compact castle keep—seasonal moat boat rides and apple treats nearby.",
  "Oirase Gorge": "A riverside trail of cascades and mossy boulders—flat sections make it a gentle, photogenic walk.",
  "Lake Towada": "Caldera lake with glassy water and forested shores—lake cruises and lakeside cafés for slow afternoons.",
  "Kakunodate Samurai District": "Edo-era streets of dark wooden mansions—peonies in spring, fiery maples in autumn.",
  "Nyuto Onsen (Tsurunoyu)": "Thatched-bathhouse onsen with milky waters—rustic rotenburo vibes; cash and towels recommended.",
  "Lake Tazawa": "Japan’s deepest lake—vivid blue with the golden Tatsuko statue; easy scenic loop by car or bike.",
  "Chūson-ji (Konjikidō)": "UNESCO temple with a gold-leaf hall set in cedar woods—museum explains Fujiwara culture of Hiraizumi.",
  "Geibikei Gorge": "Pole-guided boats glide between limestone cliffs—peaceful ride with seasonal foliage reflections.",
  "Jōdogahama Beach": "Pale rock formations and clear coves—short coastal walks and calm summer swims.",
  "Matsushima Bay": "Hundreds of pine-topped islets—classic cruises and island footbridges; one of Japan’s famed views.",
  "Zuigan-ji Temple": "Date clan’s grand Zen temple with rock caves and painted sliding doors—combine with Godaido and the bay.",
  "Zuihōden Mausoleum": "Lavish, lacquered mausoleums of Date Masamune—intricate carvings amid cedar forest.",
  "Aoba Castle Ruins (Sendai Castle)": "Hilltop ruins with wide city views—statue of Date Masamune on horseback is the photo spot.",
  "Yamadera (Risshaku-ji)": "1,000 steps to cliff-perched halls—rewarded by valley panoramas; bring water and good shoes.",
  "Ginzan Onsen": "Taishō-era spa street of wooden inns and gas lamps—magical at dusk and in winter snow.",
  "Zao Okama Crater": "Turquoise crater lake on the Zao range—weather shifts fast; roads are seasonal.",
  "Ōuchi-juku": "Thatched post town on the old Aizu trail—soba noodles topped with negi (green onion) as a spoon.",
  "Tsuruga Castle (Aizu-Wakamatsu Castle)": "White-walled keep rebuilt with a tea room—learn about the Byakkotai and local samurai history.",
  "Goshikinuma (Five Colored Ponds)": "Short forest paths to blue-green ponds tinted by minerals—best on bright days for color pop.",

  // --- Chūgoku ---
  "Itsukushima Shrine": "Floating torii gate and shrine buildings over the tide—magical at high tide and sunset; combine with island strolls and oysters.",
  "Hiroshima Peace Memorial Park": "Memorial cenotaphs, flame of peace, and the A-Bomb Dome—somber but essential visit; museum adds context.",
  "Shukkeien Garden": "Compact landscape garden with carp ponds and arched bridges—best in spring plum or autumn maple seasons.",
  "Okayama Korakuen Garden": "One of Japan’s top three gardens—broad lawns, ponds, and borrowed views of Okayama Castle.",
  "Okayama Castle": "Black ‘Crow Castle’ with museum inside; night illuminations reflect beautifully in the river.",
  "Kurashiki Bikan Historical Quarter": "White-walled storehouses and willow-lined canal—boutique shops and museums in Edo-period streets.",
  "Matsue Castle": "Authentic black-walled castle keep with panoramic views—surrounded by a moat cruise route.",
  "Adachi Museum of Art": "Immaculately framed gardens that change with the seasons—viewed like living paintings from indoors.",
  "Izumo Taisha Shrine": "One of Japan’s oldest and most important Shinto shrines—famous for enormous sacred straw ropes.",
  "Tottori Sand Dunes": "Sweeping desert-like dunes along the coast—camel rides, sandboarding, and sea views.",
  "Sand Museum": "Seasonal sand sculpture exhibits with intricate artistry—right next to the Tottori dunes.",
  "Mount Daisen": "Chūgoku’s sacred peak—lush hiking trails in summer, ski runs in winter; views to the Sea of Japan.",
  "Kintaikyo Bridge": "Five graceful wooden arches over the Nishiki River—best in cherry blossom or autumn color seasons.",
  "Akiyoshido Cave": "One of Japan’s largest limestone caves—dramatic stalactites and vast chambers, cool year-round.",
  "Tsuwano Old Town": "‘Little Kyoto of San’in’—white walls, carp-filled canals, and retro rail station with occasional steam trains.",

  // --- Shikoku (Descriptions) ---
"Naruto Whirlpools": "Powerful tidal swirls under the Ōnaruto Bridge—best seen by cruise or walkway at peak tide.",
"Ōtsuka Museum of Art": "Full-scale ceramic reproductions of world masterpieces—surprisingly impressive curation and scale.",
"Iya Valley Kazurabashi (Vine Bridge)": "Swaying vine bridge over a clear gorge—short but thrilling crossing amid deep-green valley walls.",
"Oboke Gorge": "Steep ravine with emerald river—short cruises and cliffside viewpoints along Route 32.",
"Ritsurin Garden": "Masterpiece of daimyo landscaping—pine-pruned hills, tea pavilions, and boat rides on reflective ponds.",
"Kotohira-gu (Konpira-san)": "785 stone steps to a revered shrine—lantern-lined approach and views over Sanuki plain.",
"Kankakei Gorge (Shōdoshima)": "Ropeway over a dramatic U-shaped valley; fiery maples in autumn, rugged cliffs year-round.",
"Dōgo Onsen Honkan": "One of Japan’s oldest bathhouses—wooden labyrinth, cozy tubs, and Ghibli-esque charm.",
"Matsuyama Castle": "Hilltop keep with sweeping city and sea views—cable car or a leafy hike to the top.",
"Shimanami Kaidō Cycling (Imabari Start)": "Island-hopping cycle route over blue straits—rent in Imabari and ride as far as you like.",
"Uchiko Old Town": "Restored merchant façades and a classic kabuki theater—quiet lanes perfect for a slow stroll.",
"Kōchi Castle": "Rare original hilltop castle—wooden interiors and city panoramas from the main keep.",
"Katsurahama Beach": "Curved bay with rocky outcrops and Ryōma statue—dramatic surf (no swimming) and coastal walks.",
"Cape Muroto (Muroto Misaki)": "Wind-sculpted headland with geosites and a lighthouse—big skies and Pacific swells.",
"Cape Ashizuri (Ashizuri Misaki)": "Clifftop lighthouse views over cobalt seas—azaleas in spring and starry skies at night.",
// --- Kyūshū ---
"Dazaifu Tenmangū": "Shrine to the god of learning—plum trees, vermilion bridges, and a lively approach street for umegae-mochi.",
"Canal City Hakata": "Sculptural mall with a central canal, shows, and ramen stadium—easy rainy‑day anchor in Fukuoka.",
"Yanagawa Canal Cruise": "Flatboats poled through willow-lined canals—relaxed ride with songs and seasonal flowers.",
"Yoshinogari Historical Park": "Expansive Yayoi-period settlement reconstruction—watchtowers, pit dwellings, and hands-on exhibits.",
"Mifuneyama Rakuen": "Mountain-backed garden famous for spring azaleas, autumn maples, and teamLab’s summer light art.",
"Huis Ten Bosch": "Dutch-themed resort town—illumination nights, canals, and seasonal shows; fun with kids or groups.",
"Glover Garden": "Meiji-era merchant villas on a hillside—harbor views and layered Nagasaki history.",
"Hashima Island (Gunkanjima)": "Eerie ‘Battleship Island’ ruins—boat tours circle and land when seas allow; book ahead.",
"Kumamoto Castle": "Powerful stone walls and reconstructed keeps—museum exhibits and panoramic grounds.",
"Mount Aso": "One of the world’s largest calderas—ropeway/bus access when gas levels permit; dramatic grasslands.",
"Kurokawa Onsen": "Atmospheric onsen town—rotenburo hopping with a wooden onsen pass among riverside ryokan.",
"Beppu Jigoku (Hell Tour)": "Steaming hot-spring ‘hells’ in vivid colors—quirky circuit; pair with a real soak elsewhere.",
"Yufuin Onsen": "Walkable onsen village with cafés, art, and Mt. Yufu views—lake Kinrin is lovely at dawn.",
"Takachiho Gorge": "Basalt cliffs and emerald river—rowboats and cliffside walkways; arrive early for rentals.",
"Udo Shrine": "Sea cave shrine perched on a cliff—rope‑ring pebble toss for luck and dramatic coastal views.",
"Sakurajima": "Active volcano across the bay—ferry from Kagoshima, lava trails, and frequent ash plumes.",
"Sengan-en Garden": "Shimazu villa garden with borrowed views of Sakurajima—historic house tour and craft village.",
// --- Okinawa ---
"Shurijo Castle (Shuri-jō)": "Restored Ryukyuan palace on a hill—crimson gates, stone walls, and sweeping city views.",
"Okinawa Churaumi Aquarium": "Home of the massive Kuroshio tank—whale sharks and rays glide past panoramic glass.",
"Kouri Bridge": "Long sea bridge over tropical blues—stop for beach views and local snacks at both ends.",
"Cape Manzamo": "Elephant-trunk cliff over cobalt water—short loop trail with dramatic vistas.",
"Blue Cave (Cape Maeda)": "Glow-blue sea cave reached by boat or swim—calm mornings are best for snorkelers.",
"Cape Zanpa": "Wave-carved limestone cape with a lighthouse—golden sunsets over rugged cliffs.",
"Sefa Utaki": "Sacred Ryukyuan worship site—forest path to stone prayer spaces and coastal lookouts.",
"Gyokusendo Cave (Okinawa World)": "Kilometers of stalactites and cool underground halls—pair with crafts village above.",
"Nakagusuku Castle Ruins": "UNESCO-listed gusuku ruins—curved fortress walls and high ridge panoramas.",
"Katsuren Castle Ruins": "Hilltop coral-stone castle remains—360° views over turquoise bays.",
"Yonaha Maehama Beach": "Powder-white sand and hypnotic gradients of blue—one of Japan’s top beaches.",
"Irabu Ohashi Bridge": "Graceful span linking Miyako and Irabu—scenic pull-offs for photos along the way.",
"Higashi-Hennazaki (Cape)": "Narrow peninsula lighthouse—windy walks with ocean on both sides.",
"Kabira Bay": "Emerald shallows and coral sand—glass-bottom boats; no swimming to protect the reef.",
"Taketomi Village": "Preserved Ryukyuan lanes—red-tile roofs, stone walls, and water buffalo carts.",
"Kondoi Beach (Taketomi)": "Shallow, aquamarine lagoon and white sand—perfect for lazy swims at high tide.",
"Kaiji Beach (Star Sand)": "Famous ‘star sand’ grains—gently sift the shore for tiny star-shaped shells.",
"Pinaisara Falls (Iriomote)": "Okinawa’s tallest waterfall—jungle trek/ kayak combo to a clifftop plunge and pool.",
};

// String normalizer for description/alias lookup
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// Canonicalization map: common variants ➜ curated display names
// (Aliases sorted A→Z within each region block)
const ALIASES: Record<string, string> = {
  // --- Kansai (A→Z) ---
  "arashiyama bamboo forest": "Arashiyama Bamboo Grove",
  "fushimi inari": "Fushimi Inari Taisha",
  "fushimi inari shrine": "Fushimi Inari Taisha",
  "gion": "Gion Stroll",
  "kinkaku ji": "Kinkaku-ji (Golden Pavilion)",
  "kinkaku-ji": "Kinkaku-ji (Golden Pavilion)",
  "kinkakuji": "Kinkaku-ji (Golden Pavilion)",
  "nara park": "Nara Park & Deer",
  "osaka castle park": "Osaka Castle",
  "philosophers path": "Philosopher's Path",
  "todai ji": "Tōdai-ji Daibutsuden",
  "todai-ji": "Tōdai-ji Daibutsuden",
  "universal studios": "Universal Studios Japan",

  // --- Hokkaido (A→Z) ---
  "asahiyama zoo": "Asahiyama Zoo",
  "blue pond": "Blue Pond (Aoiike)",
  "blue pond aoiike": "Blue Pond (Aoiike)",
  "farm tomita": "Farm Tomita",
  "grand hirafu": "Niseko Grand Hirafu",
  "hakodate market": "Hakodate Morning Market",
  "hakodate night view": "Mount Hakodate Night View",
  "hell valley": "Noboribetsu Hell Valley",
  "lake toya": "Lake Toya",
  "mt hakodate": "Mount Hakodate Night View",
  "noboribetsu hell valley": "Noboribetsu Hell Valley",
  "niseko": "Niseko Grand Hirafu",
  "odaori park": "Odori Park", // common typo safety
  "odori park": "Odori Park",
  "otaru canal": "Otaru Canal",
  "sapporo beer museum": "Sapporo Beer Museum",
  "sapporo clock": "Sapporo Clock Tower",
  "sapporo clock tower": "Sapporo Clock Tower",
  "shikisai no oka": "Shikisai-no-Oka",
  "shiroi koibito": "Shiroi Koibito Park",
  "yoichi distillery": "Nikka Whisky Yoichi Distillery",

  // --- Kanto (A→Z) ---
  "akihabara": "Akihabara Electric Town",
  "disneysea": "Tokyo DisneySea",
  "enoshima": "Enoshima Island",
  "imperial palace gardens": "Imperial Palace East Gardens",
  "kamakura daibutsu": "Kamakura Great Buddha (Kōtoku-in)",
  "meiji jingu": "Meiji Jingu Shrine",
  "minato mirai": "Yokohama Minato Mirai",
  "nakamise": "Nakamise Shopping Street",
  "nikko toshogu": "Nikkō Tōshōgū Shrine",
  "odaiba": "Odaiba Seaside Park",
  "scramble square": "Shibuya Crossing & Scramble Square",
  "senso ji": "Sensō-ji (Sensoji)",
  "senso-ji": "Sensō-ji (Sensoji)",
  "sensoji": "Sensō-ji (Sensoji)",
  "shibuya crossing": "Shibuya Crossing & Scramble Square",
  "shinjuku gyoen": "Shinjuku Gyoen National Garden",
  "skytree": "Tokyo Skytree",
  "takeshita street": "Takeshita Street (Harajuku)",
  "teamlab": "teamLab (Digital Art Museum)",
  "tokyo skytree": "Tokyo Skytree",
  "tsukiji market": "Tsukiji Outer Market",
  "ueno park": "Ueno Park & Museums",
  "yokohama chinatown": "Yokohama Chinatown",

  // --- Chūbu (A→Z) ---
  "chureito": "Chureito Pagoda",
  "fuji q": "Fuji-Q Highland",
  "fujiq": "Fuji-Q Highland",
  "hida no sato": "Hida Folk Village",
  "kamikochi": "Kamikōchi",
  "kawaguchiko": "Lake Kawaguchi",
  "kenrokuen": "Kenrokuen Garden",
  "kurobe dam": "Kurobe Dam (Tateyama Kurobe)",
  "lake kawaguchiko": "Lake Kawaguchi",
  "magome": "Magome-juku",
  "matsumoto castle": "Matsumoto Castle",
  "oshino hakkai": "Oshino Hakkai",
  "shirakawago": "Shirakawa-go Gassho Village",
  "snow monkey park": "Jigokudani Snow Monkey Park",
  "toyota museum": "Toyota Commemorative Museum",
  "tsumago": "Tsumago-juku",
  "omicho market": "Ōmichō Market",

  // --- Tōhoku (A→Z) ---
  "aoba castle": "Aoba Castle Ruins (Sendai Castle)",
  "chuson ji": "Chūson-ji (Konjikidō)",
  "chuson-ji": "Chūson-ji (Konjikidō)",
  "chusonji": "Chūson-ji (Konjikidō)",
  "five colored ponds": "Goshikinuma (Five Colored Ponds)",
  "geibikei": "Geibikei Gorge",
  "ginzan onsen": "Ginzan Onsen",
  "goshikinuma": "Goshikinuma (Five Colored Ponds)",
  "hirosaki castle": "Hirosaki Castle & Park",
  "jodogahama": "Jōdogahama Beach",
  "konjikido": "Chūson-ji (Konjikidō)",
  "lake tazawa": "Lake Tazawa",
  "lake towada": "Lake Towada",
  "matsushima": "Matsushima Bay",
  "nebuta museum wa rasse": "Nebuta Museum WA-RASSE",
  "nyuto onsen": "Nyuto Onsen (Tsurunoyu)",
  "okama crater": "Zao Okama Crater",
  "oirase": "Oirase Gorge",
  "ouchi juku": "Ōuchi-juku",
  "sendai castle": "Aoba Castle Ruins (Sendai Castle)",
  "tsurunoyu": "Nyuto Onsen (Tsurunoyu)",
  "tsuruga castle": "Tsuruga Castle (Aizu-Wakamatsu Castle)",
  "wa rasse": "Nebuta Museum WA-RASSE",
  "wa-rasse": "Nebuta Museum WA-RASSE",
  "yamadera": "Yamadera (Risshaku-ji)",
  "zao okama": "Zao Okama Crater",
  "zuihoden": "Zuihōden Mausoleum",
  "zuiganji": "Zuigan-ji Temple",

  // --- Chūgoku (A→Z) ---
  "adachi museum": "Adachi Museum of Art",
  "adachi museum garden": "Adachi Museum of Art",
  "akiyoshido": "Akiyoshido Cave",
  "akiyoshido cave": "Akiyoshido Cave",
  "hiroshima peace memorial": "Hiroshima Peace Memorial Park",
  "hiroshima peace park": "Hiroshima Peace Memorial Park",
  "itsukushima": "Itsukushima Shrine",
  "kintaikyo": "Kintaikyo Bridge",
  "kintaikyo bridge": "Kintaikyo Bridge",
  "korakuen": "Okayama Korakuen Garden",
  "kurashiki": "Kurashiki Bikan Historical Quarter",
  "kurashiki bikan": "Kurashiki Bikan Historical Quarter",
  "matsue castle": "Matsue Castle",
  "miyajima": "Itsukushima Shrine",
  "mount daisen": "Mount Daisen",
  "mt daisen": "Mount Daisen",
  "okayama castle": "Okayama Castle",
  "okayama korakuen": "Okayama Korakuen Garden",
  "sand museum": "Sand Museum",
  "shukkeien": "Shukkeien Garden",
  "tottori dunes": "Tottori Sand Dunes",
  "tottori sand dunes": "Tottori Sand Dunes",
  "tsuwano": "Tsuwano Old Town",
  "tsuwano old town": "Tsuwano Old Town",
  "izumo taisha": "Izumo Taisha Shrine",
// --- Shikoku (ALIASES, A→Z) ---
"ashizuri misaki": "Cape Ashizuri (Ashizuri Misaki)",
"cape ashizuri": "Cape Ashizuri (Ashizuri Misaki)",
"cape muroto": "Cape Muroto (Muroto Misaki)",
"dogo onsen": "Dōgo Onsen Honkan",
"iya kazurabashi": "Iya Valley Kazurabashi (Vine Bridge)",
"iya valley": "Iya Valley Kazurabashi (Vine Bridge)",
"kankakei": "Kankakei Gorge (Shōdoshima)",
"katsurahama": "Katsurahama Beach",
"kochi castle": "Kōchi Castle",
"konpira": "Kotohira-gu (Konpira-san)",
"kotohira gu": "Kotohira-gu (Konpira-san)",
"matsuyama castle": "Matsuyama Castle",
"muroto misaki": "Cape Muroto (Muroto Misaki)",
"naruto whirlpools": "Naruto Whirlpools",
"oboke": "Oboke Gorge",
"otsuka museum": "Ōtsuka Museum of Art",
"otsuka museum of art": "Ōtsuka Museum of Art",
"ritsurin": "Ritsurin Garden",
"shimanami kaido": "Shimanami Kaidō Cycling (Imabari Start)",
"shodoshima": "Kankakei Gorge (Shōdoshima)",
"uchiko": "Uchiko Old Town",
// --- Kyūshū (A→Z) ---
"aso": "Mount Aso",
"beppu hells": "Beppu Jigoku (Hell Tour)",
"beppu jigoku": "Beppu Jigoku (Hell Tour)",
"canal city": "Canal City Hakata",
"dazaifu": "Dazaifu Tenmangū",
"dazaifu tenmangu": "Dazaifu Tenmangū",
"glover garden": "Glover Garden",
"gunkanjima": "Hashima Island (Gunkanjima)",
"hashima island": "Hashima Island (Gunkanjima)",
"huis ten bosch": "Huis Ten Bosch",
"kagoshima senganen": "Sengan-en Garden",
"kumamoto castle": "Kumamoto Castle",
"kurokawa": "Kurokawa Onsen",
"mount aso": "Mount Aso",
"sakurajima": "Sakurajima",
"sengan en": "Sengan-en Garden",
"takachiho": "Takachiho Gorge",
"udo jingu": "Udo Shrine",
"udo shrine": "Udo Shrine",
"yanagawa cruise": "Yanagawa Canal Cruise",
"yoshinogari": "Yoshinogari Historical Park",
"yufuin": "Yufuin Onsen",
// --- Okinawa (A→Z) ---
"blue cave": "Blue Cave (Cape Maeda)",
"cape hennazaki": "Higashi-Hennazaki (Cape)",
"cape maeda": "Blue Cave (Cape Maeda)",
"cape manza": "Cape Manzamo",
"cape manzamo": "Cape Manzamo",
"cape zanpa": "Cape Zanpa",
"churaumi": "Okinawa Churaumi Aquarium",
"hennazaki": "Higashi-Hennazaki (Cape)",
"irabu bridge": "Irabu Ohashi Bridge",
"kaiji beach": "Kaiji Beach (Star Sand)",
"kabira": "Kabira Bay",
"katsuren castle": "Katsuren Castle Ruins",
"kondoi": "Kondoi Beach (Taketomi)",
"kouri bashi": "Kouri Bridge",
"kouri ohashi": "Kouri Bridge",
"kouri bridge": "Kouri Bridge",
"maehama beach": "Yonaha Maehama Beach",
"nakagusuku castle": "Nakagusuku Castle Ruins",
"okinawa world": "Gyokusendo Cave (Okinawa World)",
"pinaisara": "Pinaisara Falls (Iriomote)",
"sefa utaki": "Sefa Utaki",
"shuri castle": "Shurijo Castle (Shuri-jō)",
"shurijo": "Shurijo Castle (Shuri-jō)",
"taketomi": "Taketomi Village",
};

export { DESCRIPTIONS, ALIASES, normalize };


function fallbackStockImage(spot: Spot, region: string) {
  const q = encodeURIComponent(`${spot.name} ${spot.city || region} Japan`);
  // Unsplash source for quick stock preview (replace with your CDN later if preferred)
  return `https://source.unsplash.com/1200x800/?${q}`;
}

function genericDescribe(spot: Spot, region: string) {
  const parts: string[] = [];
  parts.push(`${spot.name} in ${spot.city || region}`);
  if (spot.tags?.length) parts.push(`— ${spot.tags.slice(0, 3).join(" / ")}`);
  parts.push("Expect a comfortable pace (1–3 hrs). Consider booking ahead if needed.");
  return parts.join(" ");
}

function getDescriptionFor(spot: Spot, region: string) {
  // Exact key
  if (DESCRIPTIONS[spot.name]) return DESCRIPTIONS[spot.name];
  // Alias lookup on normalized name
  const norm = normalize(spot.name);
  const aliasKey = ALIASES[norm];
  if (aliasKey && DESCRIPTIONS[aliasKey]) return DESCRIPTIONS[aliasKey];
  // Fallback
  return genericDescribe(spot, region);
}

// Heuristic to detect generic fallback so we can prefer curated text at render time
const looksGenericDesc = (t?: string) => {
  if (!t) return true;
  const s = t.trim();
  return s.length < 30 || /expect a comfortable pace/i.test(s);
};

export default function PlanPage() {
  const { region } = useParams<{ region: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [plan, setPlan] = useState<ItinerarySave | null>(null);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [copied, setCopied] = useState<"" | "copied" | "shared">("");
  const [useStock, setUseStock] = useState<boolean>(true);

  // ===== Load from localStorage or URL (?data=...)
  useEffect(() => {
    if (!region) return;
    try {
      const query = searchParams?.get("data");
      if (query) {
        const fromQuery = JSON.parse(decodeURIComponent(query)) as ItinerarySave;
        fromQuery.days = fromQuery.days.map((d, i) => ({ ...d, day: i + 1 }));
        localStorage.setItem(PLAN_KEY(region), JSON.stringify(fromQuery));
        setPlan(fromQuery);
        setLoading(false);
        return;
      }

      const raw = localStorage.getItem(PLAN_KEY(region));
      const fall = localStorage.getItem(SUMMARY_KEY(region));
      const data: ItinerarySave | null = raw ? JSON.parse(raw) : fall ? JSON.parse(fall) : null;
      if (data) {
        data.days = data.days.map((d, idx) => ({ ...d, day: idx + 1 }));
        setPlan(data);
      }
    } catch (e) {
      console.error("Failed to parse plan:", e);
    } finally {
      setLoading(false);
    }
  }, [region, searchParams]);

  // ===== Helpers =====
  const canSave = useMemo(() => !!plan && dirty, [plan, dirty]);

  function persist(next: ItinerarySave) {
    if (!region) return;
    localStorage.setItem(PLAN_KEY(region), JSON.stringify(next));
  }

  function markDirty(updater: (prev: ItinerarySave) => ItinerarySave) {
    setPlan(prev => {
      if (!prev) return prev;
      const next = updater(prev);
      setDirty(true);
      return next;
    });
  }

  // ===== Mutations =====
  function moveDay(index: number, direction: "up" | "down") {
    markDirty(prev => {
      const days = [...prev.days];
      const swapWith = direction === "up" ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= days.length) return prev;
      [days[index], days[swapWith]] = [days[swapWith], days[index]];
      const relabeled = days.map((d, i) => ({ ...d, day: i + 1 }));
      const next = { ...prev, days: relabeled };
      persist(next);
      return next;
    });
  }

  function moveSpot(dayIdx: number, spotIdx: number, direction: "up" | "down") {
    markDirty(prev => {
      const days = prev.days.map(d => ({ ...d, spots: [...d.spots] }));
      const spots = days[dayIdx].spots;
      const swapWith = direction === "up" ? spotIdx - 1 : spotIdx + 1;
      if (swapWith < 0 || swapWith >= spots.length) return prev;
      [spots[spotIdx], spots[swapWith]] = [spots[swapWith], spots[spotIdx]];
      const next = { ...prev, days };
      persist(next);
      return next;
    });
  }

  function moveSpotToDay(fromDayIdx: number, spotIdx: number, toDayIdx: number) {
    if (toDayIdx === fromDayIdx) return;
    markDirty(prev => {
      const days = prev.days.map(d => ({ ...d, spots: [...d.spots] }));
      const [sp] = days[fromDayIdx].spots.splice(spotIdx, 1);
      days[toDayIdx].spots.push(sp);
      const next = { ...prev, days };
      persist(next);
      return next;
    });
  }

  function removeSpot(dayIdx: number, spotIdx: number) {
    markDirty(prev => {
      const days = prev.days.map(d => ({ ...d, spots: [...d.spots] }));
      days[dayIdx].spots.splice(spotIdx, 1);
      const next = { ...prev, days };
      persist(next);
      return next;
    });
  }

  function updateDayTitle(index: number, title: string) {
    markDirty(prev => {
      const days = [...prev.days];
      days[index] = { ...days[index], title };
      const next = { ...prev, days };
      persist(next);
      return next;
    });
  }

  function updateDayNotes(index: number, notes: string) {
    markDirty(prev => {
      const days = [...prev.days];
      days[index] = { ...days[index], notes };
      const next = { ...prev, days };
      persist(next);
      return next;
    });
  }

  function updateSpotImage(dayIdx: number, spotIdx: number, image: string) {
    markDirty(prev => {
      const days = prev.days.map(d => ({ ...d, spots: d.spots.map(s => ({ ...s })) }));
      days[dayIdx].spots[spotIdx].image = image;
      const next = { ...prev, days };
      persist(next);
      return next;
    });
  }

  function updateSpotDescription(dayIdx: number, spotIdx: number, description: string) {
    markDirty(prev => {
      const days = prev.days.map(d => ({ ...d, spots: d.spots.map(s => ({ ...s })) }));
      days[dayIdx].spots[spotIdx].description = description;
      const next = { ...prev, days };
      persist(next);
      return next;
    });
  }

  // Prefer curated descriptions; overwrite generic ones when detected
  function autofillDescriptions() {
    if (!plan || !region) return;
    markDirty(prev => {
      const days = prev.days.map(d => ({
        ...d,
        spots: d.spots.map(s => {
          const current = s.description?.trim() ?? "";
          const looksGeneric = /Expect a comfortable pace/.test(current) || current.length < 30;
          const curated = getDescriptionFor(s, prev.region);
          const nextDesc = current && !looksGeneric ? current : curated;
          return { ...s, description: nextDesc };
        })
      }));
      const next = { ...prev, days };
      persist(next);
      return next;
    });
  }

  function applyStockImages() {
    if (!plan || !region) return;
    markDirty(prev => {
      const days = prev.days.map(d => ({
        ...d,
        spots: d.spots.map(s => ({
          ...s,
          image: s.image && s.image.trim().length > 0 ? s.image : fallbackStockImage(s, prev.region)
        }))
      }));
      const next = { ...prev, days };
      persist(next);
      return next;
    });
  }

  function savePlan() {
    if (!plan || !region) return;
    const relabeled = { ...plan, days: plan.days.map((d, i) => ({ ...d, day: i + 1 })) };
    persist(relabeled);
    setPlan(relabeled);
    setDirty(false);
  }

  function resetFromSummary() {
    if (!region) return;
    const summaryRaw = localStorage.getItem(SUMMARY_KEY(region));
    if (!summaryRaw) return;
    const base = JSON.parse(summaryRaw) as ItinerarySave;
    base.days = base.days.map((d, i) => ({ ...d, day: i + 1 }));
    localStorage.setItem(PLAN_KEY(region), JSON.stringify(base));
    setPlan(base);
    setDirty(false);
  }

  // ===== Export & Share =====
  function exportPDF() {
    window.print(); // Print-to-PDF with clean print styles below
  }

  async function shareLink() {
    if (!plan || !region) return;
    const data = encodeURIComponent(JSON.stringify(plan));
    const url = `${window.location.origin}/itinerary/${region}/plan?data=${data}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: `Trip plan: ${String(region).toUpperCase()}`, url });
        setCopied("shared");
        setTimeout(() => setCopied(""), 1500);
        return;
      }
    } catch (_) {}

    try {
      await navigator.clipboard.writeText(url);
      setCopied("copied");
      setTimeout(() => setCopied(""), 1500);
    } catch (e) {
      console.error("Clipboard failed:", e);
      alert(url); // fallback
    }
  }

  if (loading) return <div className="p-6 text-white">Loading…</div>;
  if (!plan) return (
    <div className="p-6 text-white space-y-3">
      <div className="text-xl font-semibold">No saved itinerary found.</div>
      <button
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl"
        onClick={() => router.push(`/itinerary/${region}/summary`)}
      >
        ← Back to Summary
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6 font-dm">
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          /* A4 page setup with standard margins */
          @page { size: A4 portrait; margin: 16mm; }
          html, body { width: 210mm; }

          /* Ensure colors and backgrounds render in print */
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;

          /* Layout tightening for A4 */
          :root { font-size: 11pt; }
          .max-w-6xl { max-width: 100% !important; }
          .print-container { color: #000; padding: 0 !important; margin: 0 !important; }
          .cover-grid { grid-template-columns: 1fr 1fr !important; gap: 6mm !important; }
          .spot-grid { grid-template-columns: 1fr 1fr !important; gap: 6mm !important; }

          /* Cards/images keep together, compact spacing */
          .print-card { break-inside: avoid; page-break-inside: avoid; border: 0.2mm solid #ddd !important; background: #fff !important; padding: 6mm !important; }
          .print-hero { height: 55mm !important; object-fit: cover !important; }
          img { page-break-inside: avoid; }
          h1, h2, h3 { break-after: avoid-page; }

          /* Hide UI controls */
          .no-print { display: none !important; }
          .print-cover { page-break-after: always; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto print-container">
        {/* Cover page */}
        <section className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-white shadow-xl print-card print-cover">
          <h1 className="text-4xl font-extrabold tracking-tight">{String(region).toUpperCase()} – Professional Itinerary</h1>
          <p className="mt-2 text-white/90">{plan.totalDays} days • {plan.themeDayReserved ? "includes theme park" : "no theme park day"}</p>
          <div className="cover-grid mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plan.days.slice(0, 6).map((d, i) => {
              const hero = d.spots.find(s => s.image)?.image || (useStock ? fallbackStockImage(d.spots[0] || { name: region as string, city: String(region) }, plan.region) : undefined);
              return (
                <div key={i} className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur border border-white/20">
                  {hero && <img src={hero} alt="cover" className="w-full h-40 object-cover" />}
                  <div className="p-3">
                    <div className="text-sm text-white/80">Day {d.day}</div>
                    <div className="font-semibold">{d.title || d.spots[0]?.city || "Day Plan"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Toolbar */}
        <div className="flex items-start justify-between gap-4 flex-wrap no-print mt-6">
          <div>
            <h2 className="text-2xl font-bold">Planner</h2>
            <p className="text-sm text-neutral-400 mt-1">Add images & descriptions for a Canva‑style export.</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-700 bg-neutral-900">
              <input type="checkbox" checked={useStock} onChange={(e) => setUseStock(e.target.checked)} />
              <span className="text-sm">Use stock images</span>
            </label>
            <button onClick={applyStockImages} className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700">Auto‑fill Images</button>
            <button onClick={autofillDescriptions} className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 hover:bg-neutral-700">Auto‑fill Descriptions</button>
            <button onClick={resetFromSummary} className="px-4 py-2 rounded-xl border border-neutral-700 hover:bg-neutral-900" title="Reload the original summary layout">Reset</button>
            <button disabled={!canSave} onClick={savePlan} className={`px-4 py-2 rounded-xl ${canSave ? "bg-emerald-600 hover:bg-emerald-700" : "bg-neutral-700 cursor-not-allowed"}`} title={canSave ? "Save your latest edits" : "No changes to save"}>Save</button>
            <button onClick={exportPDF} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700" title="Export to PDF via browser print">Export PDF</button>
            <button onClick={shareLink} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700" title="Copy or share a link to this plan">{copied === "copied" ? "Copied!" : copied === "shared" ? "Shared!" : "Share Link"}</button>
          </div>
        </div>

        {/* Days (editable + print‑ready) */}
        <div className="mt-6 space-y-8">
          {plan.days.map((day, i) => (
            <section key={i} className="rounded-3xl border border-neutral-800 bg-neutral-900 p-5 print-card">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-[240px]">
                  <div className="text-sm text-neutral-400">Day {i + 1}</div>
                  <input
                    value={day.title ?? ""}
                    onChange={(e) => updateDayTitle(i, e.target.value)}
                    placeholder="Add a title (e.g., Kyoto Icons)"
                    className="mt-1 w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white placeholder-neutral-500"
                  />
                </div>
                <div className="flex gap-2 no-print">
                  <button onClick={() => moveDay(i, "up")} className="px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:bg-neutral-700">↑ Day</button>
                  <button onClick={() => moveDay(i, "down")} className="px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 hover:bg-neutral-700">↓ Day</button>
                </div>
              </div>

              <textarea
                value={day.notes ?? ""}
                onChange={(e) => updateDayNotes(i, e.target.value)}
                placeholder="Notes for this day… lunch plans, parking, weather backups, etc."
                className="mt-3 w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-white placeholder-neutral-500"
              />

              {/* Spots — now with image + description */}
              <ul className="spot-grid mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {day.spots.map((s, j) => {
                  const hero = s.image || (useStock ? fallbackStockImage(s, plan.region) : undefined);
                  const desc = s.description ?? "";
                  const curated = getDescriptionFor(s, plan.region);
                  const displayDesc = desc && !looksGenericDesc(desc) ? desc : curated;
                  return (
                    <li key={`${s.name}-${j}`} className="rounded-2xl bg-neutral-800 border border-neutral-700 overflow-hidden">
                      {hero && (<img src={hero} alt={s.name} className="w-full h-48 object-cover print-hero" />)}
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="min-w-[220px]">
                            <div className="font-semibold text-white">{s.name}</div>
                            <div className="text-xs text-neutral-400">{s.city}{s.duration ? ` • ${s.duration}` : ""}</div>
                          </div>
                          <div className="flex items-center gap-2 no-print">
                            <button onClick={() => moveSpot(i, j, "up")} className="px-2 py-1 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-sm">↑</button>
                            <button onClick={() => moveSpot(i, j, "down")} className="px-2 py-1 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-sm">↓</button>
                            <select
                              className="px-2 py-1 rounded-lg border border-neutral-700 bg-neutral-900 text-sm"
                              value={i}
                              onChange={(e) => moveSpotToDay(i, j, parseInt(e.target.value, 10))}
                              title="Move to day"
                            >
                              {plan.days.map((_, idx) => (
                                <option value={idx} key={`dopt-${idx}`}>Day {idx + 1}</option>
                              ))}
                            </select>
                            <button onClick={() => removeSpot(i, j)} className="px-2 py-1 rounded-lg border border-red-700 bg-red-900/30 hover:bg-red-900/50 text-sm text-red-200">Remove</button>
                          </div>
                        </div>

                        {/* Editable controls (screen only) */}
                        <div className="no-print mt-3 space-y-2">
                          <input
                            value={s.image ?? ""}
                            onChange={(e) => updateSpotImage(i, j, e.target.value)}
                            placeholder="Paste image URL (JPG/PNG)"
                            className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm text-white placeholder-neutral-500"
                          />
                          <textarea
                            value={desc}
                            onChange={(e) => updateSpotDescription(i, j, e.target.value)}
                            placeholder={curated}
                            className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm text-white placeholder-neutral-500"
                          />
                        </div>

                        {/* Print description */}
                        {displayDesc && (
                          <p className="mt-3 text-sm text-neutral-300">
                            {displayDesc}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-8 no-print">
          <button onClick={() => router.push(`/itinerary/${region}/summary`)} className="text-sm underline text-neutral-400 hover:text-white">← Back to Summary</button>
          <div className="flex gap-2">
            <button onClick={exportPDF} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700">Export PDF</button>
            <button onClick={shareLink} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700">{copied === "copied" ? "Copied!" : copied === "shared" ? "Shared!" : "Share Link"}</button>
            <button disabled={!canSave} onClick={savePlan} className={`px-5 py-3 rounded-xl ${canSave ? "bg-emerald-600 hover:bg-emerald-700" : "bg-neutral-700 cursor-not-allowed"}`}>Save Changes</button>
          </div>
        </div>
      </div>
    </main>
  );
}
