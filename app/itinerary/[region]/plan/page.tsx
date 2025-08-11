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
};

type PlanItem = Spot & {
  day: number;            // day index (1..N)
  order: number;          // order within the day
  duration: string;       // '1–2 hrs' or '2–3 hrs'
};

type Plan = {
  region: string;
  days: number;
  includeThemePark?: boolean;
  items: PlanItem[];
  updatedAt: string;
};

type SummaryPayload = {
  region: string;
  days: number;
  includeThemePark?: boolean;
  clusters: { day: number; spots: (Spot & { duration: string })[] }[];
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

// Alias resolver for free-typed searches
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

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// ===== Utils =====
const readJSON = <T,>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const writeJSON = (key: string, value: any) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("localStorage write failed", e);
  }
};

// ===== Component =====
export default function PlanPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const region = (params?.region as string) ?? "kansai";
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<"" | "copied" | "shared">("");

  // pull summary (from previous step) for fallbacks
  const summary = useMemo(() => {
    return readJSON<SummaryPayload>(SUMMARY_KEY(region));
  }, [region]);

  useEffect(() => {
    // existing plan or create from summary
    const existing = readJSON<Plan>(PLAN_KEY(region));
    if (existing) {
      setPlan(existing);
      setLoading(false);
      return;
    }

    if (summary) {
      const items: PlanItem[] = [];
      for (const cluster of summary.clusters) {
        cluster.spots.forEach((s, i) => {
          items.push({
            ...s,
            day: cluster.day,
            order: i + 1,
            duration: s.duration ?? (s.tags?.includes("Iconic") || s.tags?.includes("Cultural") ? "2–3 hrs" : "1–2 hrs"),
          });
        });
      }
      const fresh: Plan = {
        region: summary.region,
        days: summary.days,
        includeThemePark: summary.includeThemePark,
        items,
        updatedAt: new Date().toISOString(),
      };
      setPlan(fresh);
      writeJSON(PLAN_KEY(region), fresh);
    }
    setLoading(false);
  }, [region, summary]);

  // Reorder helpers
  const moveItem = (day: number, index: number, dir: -1 | 1) => {
    if (!plan) return;
    const items = [...plan.items];
    const dayItems = items.filter((it) => it.day === day);
    const src = dayItems[index];
    const dst = dayItems[index + dir];
    if (!src || !dst) return;

    const srcGlobal = items.findIndex((it) => it.day === day && it.order === src.order);
    const dstGlobal = items.findIndex((it) => it.day === day && it.order === dst.order);

    // swap orders
    items[srcGlobal] = { ...items[srcGlobal], order: dst.order };
    items[dstGlobal] = { ...items[dstGlobal], order: src.order };

    const normalized = items
      .sort((a, b) => (a.day === b.day ? a.order - b.order : a.day - b.day))
      .map((it, i) => ({ ...it }));

    const updated: Plan = { ...plan, items: normalized, updatedAt: new Date().toISOString() };
    setPlan(updated);
    writeJSON(PLAN_KEY(region), updated);
  };

  // Save
  const canSave = !!plan;
  const savePlan = () => {
    if (!plan) return;
    const updated: Plan = { ...plan, updatedAt: new Date().toISOString() };
    setPlan(updated);
    writeJSON(PLAN_KEY(region), updated);
  };

  // Export / Share
  const exportPDF = () => {
    window.print();
  };

  const shareLink = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.share?.({ url, title: `Shinkai Plan — ${region}` });
      setCopied("shared");
    } catch {
      try {
        await navigator.clipboard.writeText(url);
        setCopied("copied");
        setTimeout(() => setCopied(""), 1500);
      } catch (e) {
        console.error("Clipboard failed:", e);
        alert(url);
      }
    }
  };

  if (loading) return <div className="p-6 text-white">Loading…</div>;
  if (!plan) return (
    <div className="p-6 text-white space-y-3">
      <div className="text-xl font-semibold">No saved itinerary found.</div>
      <button
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl"
        onClick={() => router.push(`/itinerary/${region}/summary`)}
      >Build Summary</button>
    </div>
  );

  // Group items by day
  const byDay: Record<number, PlanItem[]> = {};
  for (const it of plan.items) {
    if (!byDay[it.day]) byDay[it.day] = [];
    byDay[it.day].push(it);
  }
  Object.keys(byDay).forEach((k) => byDay[+k].sort((a, b) => a.order - b.order));

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-semibold">{region.toUpperCase()} Itinerary Plan</h1>
          <div className="text-sm text-white/60">Last updated {new Date(plan.updatedAt).toLocaleString()}</div>
        </div>

        {/* Days */}
        <div className="mt-6 space-y-8 print:space-y-4">
          {Array.from({ length: plan.days }).map((_, dayIdx) => {
            const day = dayIdx + 1;
            const items = byDay[day] ?? [];
            return (
              <section key={day} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 shadow">
                <h2 className="text-lg font-semibold mb-3">Day {day}</h2>
                {items.length === 0 ? (
                  <div className="text-white/70">No spots for this day. Use the Summary step to add clustered spots.</div>
                ) : (
                  <ol className="space-y-3">
                    {items.map((it, i) => (
                      <li key={`${it.name}-${i}`} className="flex items-center gap-3">
                        <div className="text-white/60 w-6 text-right">{i + 1}.</div>
                        <div className="flex-1">
                          <div className="font-medium">{it.name}</div>
                          <div className="text-sm text-white/70">{it.city} • {it.duration}</div>
                          {DESCRIPTIONS[it.name] && (
                            <div className="text-xs text-white/60 mt-1">{DESCRIPTIONS[it.name]}</div>
                          )}
                        </div>
                        <div className="flex gap-1 no-print">
                          <button
                            className="px-2 py-1 rounded-md bg-neutral-700 hover:bg-neutral-600"
                            onClick={() => moveItem(day, i, -1)}
                          >↑</button>
                          <button
                            className="px-2 py-1 rounded-md bg-neutral-700 hover:bg-neutral-600"
                            onClick={() => moveItem(day, i, 1)}
                          >↓</button>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-8 no-print">
          <button
            onClick={() => router.push(`/itinerary/${region}/summary`)}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
          >← Back to Summary</button>
          <div className="flex gap-2">
            <button onClick={exportPDF} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700">Export PDF</button>
            <button onClick={shareLink} className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700">
              {copied === "copied" ? "Copied!" : copied === "shared" ? "Shared!" : "Share Link"}
            </button>
            <button disabled={!canSave} onClick={savePlan} className={`px-4 py-2 rounded-xl ${canSave ? "bg-green-600 hover:bg-green-700" : "bg-neutral-700 cursor-not-allowed"}`}>Save Changes</button>
          </div>
        </div>
      </div>
    </main>
  );
}
