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
    .replace(/[^a-z0-9]+/g, " ")     // non-alphanumerics -> spaces
    .replace(/\s{2,}/g, " ")         // collapse whitespace
    .trim();

export const DESCRIPTIONS: DescriptionMap = {
  // ==== Kansai (Kyoto, Osaka, Nara, Kobe) ====
  "Fushimi Inari Taisha": "Walk through thousands of vermilion torii gates snaking up Mt. Inari. Best early morning or late afternoon for softer light and fewer crowds.",
  "Kinkaku-ji (Golden Pavilion)": "Kyoto’s shimmering Zen temple reflected in a mirror-still pond. Photos are best from the outer garden loop.",
  "Gion Stroll": "Historic geisha district lined with wooden machiya houses, tea rooms, and narrow lanes—perfect for an evening wander.",
  "Nara Park & Deer": "Meet Nara’s friendly bowing deer. Bring a pack of senbei crackers and keep an eye on your maps and pockets!",
  "Tōdai-ji Daibutsuden": "Home to the Great Buddha. The vast wooden hall and temple grounds are awe-inspiring in any season.",
  "Kasuga Taisha": "An ancient Shinto shrine famous for its stone and bronze lanterns tucked into a mystical cedar forest.",
  "Dotonbori": "Neon-lit canal district known for takoyaki, okonomiyaki, and iconic signs like the Glico Running Man.",
  "Osaka Castle": "A restored hilltop keep with a museum inside and cherry-ringed park outside—great for wide city views.",
  "Arashiyama Bamboo Grove": "Lose yourself in towering bamboo, a soft green tunnel perfect at dawn before crowds build. Pair with nearby Tenryu-ji or the river walk.",
  "Philosopher's Path": "A gentle canal-side stroll under hundreds of cherry trees linking Ginkaku-ji to Nanzen-ji—best in spring and with cozy cafés along the way.",
  "Kobe Harborland": "Waterfront promenade with shops, Ferris wheel, and night views across the bay.",
  "Kobe Beef Dinner": "Indulge in melt-in-your-mouth wagyu at a certified teppanyaki house—reserve ahead for the top cuts.",

  // ==== Hokkaido (canonical keys match your spots) ====
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

  // ==== Kanto (Tokyo & surrounds) ====
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

  // ==== Chūbu ====
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

  // ==== Chūgoku ====
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

  // ==== Shikoku ====
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

  // ==== Kyūshū ====
  "Dazaifu Tenmangū": "Shrine to the god of learning—plum trees, vermilion bridges, and a lively approach street for umegae-mochi.",
  "Canal City Hakata": "Sculptural mall with a central canal, shows, and ramen stadium—easy rainy-day anchor in Fukuoka.",
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
  "Udo Shrine": "Sea cave shrine perched on a cliff—rope-ring pebble toss for luck and dramatic coastal views.",
  "Sakurajima": "Active volcano across the bay—ferry from Kagoshima, lava trails, and frequent ash plumes.",
  "Sengan-en Garden": "Shimazu villa garden with borrowed views of Sakurajima—historic house tour and craft village.",

  // ==== Tōhoku ====
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

  // ==== Okinawa ====
  "Shurijo Castle (Shuri-jō)": "Restored Ryukyuan palace on a hill—crimson gates, stone walls, and sweeping city views.",
  "Okinawa Churaumi Aquarium": "One of Japan’s best aquariums—massive tank with whale sharks and manta rays.",
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
  "Pinaisara Falls (Iriomote)": "Okinawa’s tallest waterfall—jungle trek/kayak combo to a clifftop plunge and pool.",

};

export const ALIASES: AliasMap = {
  // Kansai
  "fushimi inari": "Fushimi Inari Taisha",
  "kinkakuji": "Kinkaku-ji (Golden Pavilion)",
  "golden pavilion": "Kinkaku-ji (Golden Pavilion)",
  "arashiyama bamboo": "Arashiyama Bamboo Grove",
  "philosophers path": "Philosopher's Path",
  "nara deer": "Nara Park & Deer",
  "todai ji": "Tōdai-ji Daibutsuden",

  // Hokkaido (→ canonical keys above)
  "sapporo odori park": "Odori Park",
  "odori": "Odori Park",
  "blue pond": "Blue Pond (Aoiike)",
  "blue pond biei": "Blue Pond (Aoiike)",
  "farm tomita furano": "Farm Tomita",
  "niseko": "Niseko Grand Hirafu",
  "yoichi distillery": "Nikka Whisky Yoichi Distillery",
  "hell valley": "Noboribetsu Hell Valley",
  "mt hakodate": "Mount Hakodate Night View",
  "hakodate night view": "Mount Hakodate Night View",
  "hakodate market": "Hakodate Morning Market",

  // Kanto
  "skytree": "Tokyo Skytree",
  "sensoji": "Sensō-ji (Sensoji)",
  "senso-ji asakusa": "Sensō-ji (Sensoji)",
  "meiji jingu": "Meiji Jingu Shrine",
  "takeshita street": "Takeshita Street (Harajuku)",
  "shibuya crossing": "Shibuya Crossing & Scramble Square",
  "teamlab": "teamLab (Digital Art Museum)",
  "imperial palace gardens": "Imperial Palace East Gardens",
  "disneysea": "Tokyo DisneySea",
  "minato mirai": "Yokohama Minato Mirai",

  // Chūbu
  "lake kawaguchiko": "Lake Kawaguchi",
  "kawaguchiko": "Lake Kawaguchi",
  "chureito": "Chureito Pagoda",
  "fuji q": "Fuji-Q Highland",
  "fujiq": "Fuji-Q Highland",
  "kamikochi": "Kamikōchi",
  "snow monkey park": "Jigokudani Snow Monkey Park",
  "shirakawago": "Shirakawa-go Gassho Village",
  "kenrokuen": "Kenrokuen Garden",
  "omicho market": "Ōmichō Market",
  "kurobe dam": "Kurobe Dam (Tateyama Kurobe)",
  "toyota museum": "Toyota Commemorative Museum",

  // Chūgoku
  "miyajima": "Itsukushima Shrine",
  "okayama korakuen": "Okayama Korakuen Garden",
  "kintaikyo": "Kintaikyo Bridge",
  "akiyoshido": "Akiyoshido Cave",
  "adachi museum": "Adachi Museum of Art",
  "tottori dunes": "Tottori Sand Dunes",

  // Shikoku
  "iya kazurabashi": "Iya Valley Kazurabashi (Vine Bridge)",
  "kankakei": "Kankakei Gorge (Shōdoshima)",
  "shimanami kaido": "Shimanami Kaidō Cycling (Imabari Start)",
  "dogo onsen": "Dōgo Onsen Honkan",
  "cape muroto": "Cape Muroto (Muroto Misaki)",
  "cape ashizuri": "Cape Ashizuri (Ashizuri Misaki)",

  // Kyūshū
  "beppu hells": "Beppu Jigoku (Hell Tour)",
  "gunkanjima": "Hashima Island (Gunkanjima)",
  "senganen": "Sengan-en Garden",
  "mt aso": "Mount Aso",
  "yufuin": "Yufuin Onsen",

  // Tōhoku
  "wa-rasse": "Nebuta Museum WA-RASSE",
  "aomori nebuta": "Nebuta Museum WA-RASSE",
  "hirosaki castle": "Hirosaki Castle & Park",
  "oirase": "Oirase Gorge",
  "towada lake": "Lake Towada",
  "kakunodate": "Kakunodate Samurai District",
  "nyuto onsen": "Nyuto Onsen (Tsurunoyu)",
  "lake tazawa": "Lake Tazawa",
  "chusonji": "Chūson-ji (Konjikidō)",
  "geibikei": "Geibikei Gorge",
  "jodogahama": "Jōdogahama Beach",
  "matsushima": "Matsushima Bay",
  "zuiganji": "Zuigan-ji Temple",
  "zuihoden": "Zuihōden Mausoleum",
  "aoba castle": "Aoba Castle Ruins (Sendai Castle)",
  "sendai castle": "Aoba Castle Ruins (Sendai Castle)",
  "yamadera": "Yamadera (Risshaku-ji)",
  "ginzan": "Ginzan Onsen",
  "zao okama": "Zao Okama Crater",
  "ouchi juku": "Ōuchi-juku",
  "tsuruga castle": "Tsuruga Castle (Aizu-Wakamatsu Castle)",
  "goshikinuma": "Goshikinuma (Five Colored Ponds)",
  "five colored ponds": "Goshikinuma (Five Colored Ponds)",

  // Okinawa
  "shuri castle": "Shurijo Castle (Shuri-jō)",
  "churaumi": "Okinawa Churaumi Aquarium",
  "cape maeda": "Blue Cave (Cape Maeda)",
  "cape manza": "Cape Manzamo",
  "hennazaki": "Higashi-Hennazaki (Cape)",
  "irabu bridge": "Irabu Ohashi Bridge",
  "kabira": "Kabira Bay",
  "kondoi": "Kondoi Beach (Taketomi)",
  "kaiji beach": "Kaiji Beach (Star Sand)",
  "pinaisara": "Pinaisara Falls (Iriomote)",
};

export const looksGenericDesc = (t?: string) => {
  if (!t) return true;
  const s = t.trim();
  return s.length < 30 || /expect a comfortable pace/i.test(s);
};

function genericDescribe(
  spot: { name: string; city?: string; tags?: string[] },
  region: string
) {
  const parts = [`${spot.name} in ${spot.city || region}`];
  if (spot.tags?.length) parts.push(`— ${spot.tags.slice(0, 3).join(" / ")}`);
  parts.push("Expect a comfortable pace (1–3 hrs). Consider booking ahead if needed.");
  return parts.join(" ");
}

export function resolveAlias(input: string, aliases: AliasMap = ALIASES): string {
  const n = normalize(input);
  if (DESCRIPTIONS[input]) return input;
  const normalizedMap: Record<string, string> = {};
  for (const [k, v] of Object.entries(aliases)) {
    normalizedMap[normalize(k)] = v;
  }
  return normalizedMap[n] ?? input;
}

export function getDescriptionFor(
  spot: { name: string; city?: string; tags?: string[] },
  region: string
) {
  if (DESCRIPTIONS[spot.name]) return DESCRIPTIONS[spot.name];
  const alias = resolveAlias(spot.name);
  if (alias && DESCRIPTIONS[alias]) return DESCRIPTIONS[alias];
  return genericDescribe(spot, region);
}
