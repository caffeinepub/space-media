import type { StudioVideo, VideoContent } from "./types";

// ─── Video Content ────────────────────────────────────────────────────────────

export const mockVideos: VideoContent[] = [
  {
    id: "v1",
    title: "Stellar Odyssey",
    year: 2024,
    rating: "PG-13",
    runtime: "2h 18m",
    genre: "Sci-Fi",
    language: "English",
    description:
      "A crew of interstellar explorers ventures beyond the known galaxy, discovering civilizations that challenge everything humanity thought it understood about the cosmos. An epic journey of survival, wonder, and first contact.",
    posterUrl: "https://picsum.photos/seed/v1stellar/300/450",
    backdropUrl: "https://picsum.photos/seed/v1stellar_back/800/450",
    subtitles: ["English", "Spanish", "French", "German"],
    resumePosition: 1823,
    tags: ["space", "exploration", "aliens"],
    hlsMasterUrl: "/media/videos/v1/master.m3u8",
    defaultAudioLang: "en",
    audioTracks: [
      {
        id: "at1",
        language: "English",
        langCode: "en",
        audioLabel: "Stereo",
        isDefault: true,
      },
      {
        id: "at2",
        language: "Spanish",
        langCode: "es",
        audioLabel: "Stereo",
        isDefault: false,
      },
      {
        id: "at3",
        language: "French",
        langCode: "fr",
        audioLabel: "Stereo",
        isDefault: false,
      },
    ],
  },
  {
    id: "v2",
    title: "Gravity's Edge",
    year: 2023,
    rating: "PG-13",
    runtime: "1h 52m",
    genre: "Action",
    language: "English",
    description:
      "When a catastrophic satellite collision leaves two astronauts adrift in orbit, they must fight against impossible odds and dwindling oxygen to survive. A tense, breathtaking thriller set among the stars.",
    posterUrl: "https://picsum.photos/seed/v2gravity/300/450",
    backdropUrl: "https://picsum.photos/seed/v2gravity_back/800/450",
    subtitles: ["English", "Japanese", "Korean"],
    resumePosition: 0,
    tags: ["survival", "space", "thriller"],
    hlsMasterUrl: "/media/videos/v2/master.m3u8",
    defaultAudioLang: "en",
    audioTracks: [
      {
        id: "at4",
        language: "English",
        langCode: "en",
        audioLabel: "Stereo",
        isDefault: true,
      },
      {
        id: "at5",
        language: "Japanese",
        langCode: "ja",
        audioLabel: "Stereo",
        isDefault: false,
      },
    ],
  },
  {
    id: "v3",
    title: "The Red Planet Chronicles",
    year: 2024,
    rating: "TV-MA",
    runtime: "1h 30m",
    genre: "Documentary",
    language: "English",
    description:
      "An intimate documentary following the first permanent Mars colony through its tumultuous first year. Stunning cinematography captures the raw beauty of the Martian landscape and the human spirit.",
    posterUrl: "https://picsum.photos/seed/v3mars/300/450",
    backdropUrl: "https://picsum.photos/seed/v3mars_back/800/450",
    subtitles: ["English", "Spanish"],
    tags: ["mars", "documentary", "science"],
    hlsMasterUrl: "/media/videos/v3/master.m3u8",
    defaultAudioLang: "en",
    audioTracks: [
      {
        id: "at6",
        language: "English",
        langCode: "en",
        audioLabel: "Stereo",
        isDefault: true,
      },
      {
        id: "at7",
        language: "Spanish",
        langCode: "es",
        audioLabel: "Stereo",
        isDefault: false,
      },
    ],
  },
  {
    id: "v4",
    title: "Dark Matter",
    year: 2023,
    rating: "R",
    runtime: "2h 05m",
    genre: "Drama",
    language: "English",
    description:
      "A quantum physicist wakes in a world that isn't his own, forced to navigate a labyrinth of alternate realities to find his way home. A mind-bending thriller about choice, identity, and the roads not taken.",
    posterUrl: "https://picsum.photos/seed/v4dark/300/450",
    backdropUrl: "https://picsum.photos/seed/v4dark_back/800/450",
    subtitles: ["English", "French", "German", "Italian"],
    resumePosition: 3240,
    tags: ["quantum", "thriller", "parallel worlds"],
    contentType: "movie",
    parts: [
      {
        partNumber: 1,
        label: "Part 1",
        videoId: "v4",
        title: "Dark Matter: Part 1",
      },
      {
        partNumber: 2,
        label: "Part 2",
        videoId: "v4p2",
        title: "Dark Matter: Part 2",
      },
    ],
  },
  {
    id: "v4p2",
    title: "Dark Matter: Part 2",
    year: 2023,
    rating: "R",
    runtime: "2h 11m",
    genre: "Drama",
    language: "English",
    description:
      "The quantum physicist's journey through alternate realities reaches its devastating conclusion. With time unraveling and every choice carrying cosmic consequences, he must confront the ultimate truth about identity and sacrifice.",
    posterUrl: "https://picsum.photos/seed/v4darkp2/300/450",
    backdropUrl: "https://picsum.photos/seed/v4dark_back2/800/450",
    subtitles: ["English", "French", "German", "Italian"],
    tags: ["quantum", "thriller", "parallel worlds", "conclusion"],
    contentType: "movie",
    parts: [
      {
        partNumber: 1,
        label: "Part 1",
        videoId: "v4",
        title: "Dark Matter: Part 1",
      },
      {
        partNumber: 2,
        label: "Part 2",
        videoId: "v4p2",
        title: "Dark Matter: Part 2",
      },
    ],
  },
  {
    id: "v5",
    title: "Nebula Station",
    year: 2024,
    rating: "TV-14",
    runtime: "45m",
    genre: "Sci-Fi",
    language: "English",
    description:
      "Life aboard humanity's most remote space station gets complicated when a mysterious signal from deep space triggers a chain of events that could reshape the fate of the human race.",
    posterUrl: "https://picsum.photos/seed/v5nebula/300/450",
    backdropUrl: "https://picsum.photos/seed/v5nebula_back/800/450",
    subtitles: ["English", "Spanish", "Mandarin"],
    tags: ["station", "signal", "mystery"],
    contentType: "series",
    seasons: [
      {
        seasonNumber: 1,
        label: "Season 1",
        episodes: [
          {
            id: "v5s1e1",
            episodeNumber: 1,
            title: "Arrival",
            description:
              "Dr. Elena Vasquez arrives at Nebula Station and immediately senses something is deeply wrong. The crew is jumpy, systems are glitching, and a faint signal keeps repeating from the edge of known space.",
            runtime: "47m",
            thumbnailUrl: "https://picsum.photos/seed/v5s1e1/400/225",
            durationSeconds: 2820,
          },
          {
            id: "v5s1e2",
            episodeNumber: 2,
            title: "The Signal",
            description:
              "Analysis of the deep-space transmission reveals a pattern no human algorithm could generate. Station Commander Reyes orders a communications blackout — but it's already too late.",
            runtime: "44m",
            thumbnailUrl: "https://picsum.photos/seed/v5s1e2/400/225",
            durationSeconds: 2640,
          },
          {
            id: "v5s1e3",
            episodeNumber: 3,
            title: "Quarantine",
            description:
              "Two crew members exhibit strange behavioral changes after the signal breach. Dr. Vasquez races to contain the spread while uncovering the station's classified history.",
            runtime: "51m",
            thumbnailUrl: "https://picsum.photos/seed/v5s1e3/400/225",
            durationSeconds: 3060,
          },
          {
            id: "v5s1e4",
            episodeNumber: 4,
            title: "First Contact",
            description:
              "The source of the signal makes direct contact. What began as an anomaly becomes the most significant event in human history — and the most dangerous.",
            runtime: "48m",
            thumbnailUrl: "https://picsum.photos/seed/v5s1e4/400/225",
            durationSeconds: 2880,
          },
          {
            id: "v5s1e5",
            episodeNumber: 5,
            title: "Point of No Return",
            description:
              "With the station drifting off course and half the crew compromised, Vasquez faces an impossible choice that will determine the fate of everyone aboard — and perhaps humanity itself.",
            runtime: "52m",
            thumbnailUrl: "https://picsum.photos/seed/v5s1e5/400/225",
            durationSeconds: 3120,
          },
        ],
      },
      {
        seasonNumber: 2,
        label: "Season 2",
        episodes: [
          {
            id: "v5s2e1",
            episodeNumber: 1,
            title: "New Horizons",
            description:
              "Six months after the events of Season 1, a rebuilt Nebula Station reopens with a new crew — and the disturbing signals have started again, stronger than ever.",
            runtime: "49m",
            thumbnailUrl: "https://picsum.photos/seed/v5s2e1/400/225",
            durationSeconds: 2940,
          },
          {
            id: "v5s2e2",
            episodeNumber: 2,
            title: "The Return",
            description:
              "Dr. Vasquez returns to the station against orders, bringing evidence that the original signal was not a first contact — it was a warning.",
            runtime: "46m",
            thumbnailUrl: "https://picsum.photos/seed/v5s2e2/400/225",
            durationSeconds: 2760,
          },
          {
            id: "v5s2e3",
            episodeNumber: 3,
            title: "Legacy Code",
            description:
              "Hidden files in the station's core reveal that a secret program has been running for decades, designed specifically for this moment of contact.",
            runtime: "50m",
            thumbnailUrl: "https://picsum.photos/seed/v5s2e3/400/225",
            durationSeconds: 3000,
          },
          {
            id: "v5s2e4",
            episodeNumber: 4,
            title: "Convergence",
            description:
              "The warning from the signal becomes reality as multiple alien vessels approach the station. The crew must decide: fight, flee, or trust the unknown.",
            runtime: "55m",
            thumbnailUrl: "https://picsum.photos/seed/v5s2e4/400/225",
            durationSeconds: 3300,
          },
        ],
      },
    ],
  },
  {
    id: "v6",
    title: "Zero Gravity Comedy Club",
    year: 2023,
    rating: "TV-14",
    runtime: "1h 20m",
    genre: "Comedy",
    language: "English",
    description:
      "Five comedians perform stand-up in actual microgravity conditions aboard a parabolic flight. Hilarity, chaos, and unexpected profundity ensue as jokes and comedians float freely.",
    posterUrl: "https://picsum.photos/seed/v6comedy/300/450",
    backdropUrl: "https://picsum.photos/seed/v6comedy_back/800/450",
    subtitles: ["English"],
    tags: ["comedy", "standup", "weightless"],
  },
  {
    id: "v7",
    title: "The Last Mission",
    year: 2022,
    rating: "PG-13",
    runtime: "2h 32m",
    genre: "Action",
    language: "English",
    description:
      "A veteran astronaut on the verge of retirement is called for one final mission when a rogue AI threatens to destroy Earth's entire satellite network. The race against time begins.",
    posterUrl: "https://picsum.photos/seed/v7mission/300/450",
    backdropUrl: "https://picsum.photos/seed/v7mission_back/800/450",
    subtitles: ["English", "Spanish", "French"],
    tags: ["action", "ai", "satellites"],
  },
  {
    id: "v8",
    title: "Proxima",
    year: 2024,
    rating: "PG",
    runtime: "1h 47m",
    genre: "Drama",
    language: "French",
    description:
      "A French astronaut prepares for a year-long mission to the International Space Station while balancing the profound weight of leaving her young daughter behind on Earth.",
    posterUrl: "https://picsum.photos/seed/v8proxima/300/450",
    backdropUrl: "https://picsum.photos/seed/v8proxima_back/800/450",
    subtitles: ["French", "English", "German"],
    tags: ["family", "emotional", "iss"],
  },
  {
    id: "v9",
    title: "Asteroid Hunters",
    year: 2023,
    rating: "G",
    runtime: "52m",
    genre: "Documentary",
    language: "English",
    description:
      "Follow the scientists and astronomers who track near-Earth asteroids 24 hours a day, working to protect our planet from potentially devastating impacts.",
    posterUrl: "https://picsum.photos/seed/v9asteroid/300/450",
    backdropUrl: "https://picsum.photos/seed/v9asteroid_back/800/450",
    subtitles: ["English"],
    tags: ["asteroids", "science", "protection"],
  },
  {
    id: "v10",
    title: "Exoplanet Dreams",
    year: 2024,
    rating: "PG",
    runtime: "1h 15m",
    genre: "Documentary",
    language: "English",
    description:
      "A visually stunning journey through the most extraordinary exoplanets ever discovered, from lava worlds and ice giants to planets with two suns where the skies never go dark.",
    posterUrl: "https://picsum.photos/seed/v10exo/300/450",
    backdropUrl: "https://picsum.photos/seed/v10exo_back/800/450",
    subtitles: ["English", "Spanish", "Japanese"],
    tags: ["exoplanets", "planets", "discovery"],
  },
  {
    id: "v11",
    title: "The Mars Chronicles",
    year: 2024,
    rating: "TV-MA",
    runtime: "55m",
    genre: "Sci-Fi",
    language: "English",
    description:
      "A gripping dramatized series following the first generation of permanent Mars colonists as they battle environmental catastrophe, political betrayal, and the psychological cost of life 140 million miles from Earth.",
    posterUrl: "https://picsum.photos/seed/v11mars/300/450",
    backdropUrl: "https://picsum.photos/seed/v11mars_back/800/450",
    subtitles: ["English", "Spanish", "French", "German"],
    tags: ["mars", "colony", "survival", "drama"],
    contentType: "series",
    seasons: [
      {
        seasonNumber: 1,
        label: "Season 1",
        episodes: [
          {
            id: "v11s1e1",
            episodeNumber: 1,
            title: "Red Dust",
            description:
              "The first 100 colonists touch down on the Martian surface. Commander Yara Singh must hold the fragile settlement together as dust storms, equipment failures, and personal conflicts threaten their survival from day one.",
            runtime: "58m",
            thumbnailUrl: "https://picsum.photos/seed/v11s1e1/400/225",
            durationSeconds: 3480,
          },
          {
            id: "v11s1e2",
            episodeNumber: 2,
            title: "Below Freezing",
            description:
              "A record cold front pushes the colony's heating systems to breaking point. While engineers scramble, geologist Dr. Park makes an underground discovery that changes everything they know about Mars.",
            runtime: "54m",
            thumbnailUrl: "https://picsum.photos/seed/v11s1e2/400/225",
            durationSeconds: 3240,
          },
          {
            id: "v11s1e3",
            episodeNumber: 3,
            title: "Water Rights",
            description:
              "A conflict erupts over water allocation between the science team and the agricultural crew. Political factions form in the colony, and Commander Singh must prevent a fracture before it becomes irreversible.",
            runtime: "57m",
            thumbnailUrl: "https://picsum.photos/seed/v11s1e3/400/225",
            durationSeconds: 3420,
          },
          {
            id: "v11s1e4",
            episodeNumber: 4,
            title: "The Long Night",
            description:
              "During Mars's longest night cycle, a crew member goes missing outside the dome. A desperate rescue mission unfolds in near-zero visibility with oxygen supplies running dangerously low.",
            runtime: "61m",
            thumbnailUrl: "https://picsum.photos/seed/v11s1e4/400/225",
            durationSeconds: 3660,
          },
          {
            id: "v11s1e5",
            episodeNumber: 5,
            title: "Signal Lost",
            description:
              "Earth communication cuts out for 72 hours. Isolated and facing a medical emergency, the colony must make life-or-death decisions with no guidance and no rescue coming.",
            runtime: "56m",
            thumbnailUrl: "https://picsum.photos/seed/v11s1e5/400/225",
            durationSeconds: 3360,
          },
          {
            id: "v11s1e6",
            episodeNumber: 6,
            title: "The First Year",
            description:
              "One Earth year into the mission, the colonists gather for a ceremony — but celebrations are cut short by the most dangerous crisis they have yet faced, one that will force them to choose between Mars and home.",
            runtime: "63m",
            thumbnailUrl: "https://picsum.photos/seed/v11s1e6/400/225",
            durationSeconds: 3780,
          },
        ],
      },
    ],
  },
  // ─── Additional dummy web series ──────────────────────────────────────────
  {
    id: "v12",
    title: "Void Runners",
    year: 2025,
    rating: "TV-14",
    runtime: "42m",
    genre: "Action",
    language: "English",
    description:
      "A ragtag crew of deep-space couriers hauls illegal cargo across contested star systems, always one jump ahead of the Galactic Authority. Fast, fun, and explosively entertaining.",
    posterUrl: "https://picsum.photos/seed/v12void/300/450",
    backdropUrl: "https://picsum.photos/seed/v12void_back/800/450",
    subtitles: ["English", "Spanish"],
    tags: ["space", "action", "heist"],
    contentType: "series",
    seasons: [
      {
        seasonNumber: 1,
        label: "Season 1",
        episodes: [
          {
            id: "v12s1e1",
            episodeNumber: 1,
            title: "Ignition",
            description:
              "Captain Rax assembles a crew for what looks like a routine cargo run — until they discover what's actually in the crates.",
            runtime: "44m",
            thumbnailUrl: "https://picsum.photos/seed/v12s1e1/400/225",
            durationSeconds: 2640,
          },
          {
            id: "v12s1e2",
            episodeNumber: 2,
            title: "Hot Goods",
            description:
              "Pursued by an Authority warship, the crew must dump their cargo or risk arrest. But the cargo doesn't want to be dumped.",
            runtime: "41m",
            thumbnailUrl: "https://picsum.photos/seed/v12s1e2/400/225",
            durationSeconds: 2460,
          },
          {
            id: "v12s1e3",
            episodeNumber: 3,
            title: "Border Crossing",
            description:
              "A bribe goes wrong at the Outer Belt checkpoint, forcing the crew into a reckless shortcut through a debris field.",
            runtime: "43m",
            thumbnailUrl: "https://picsum.photos/seed/v12s1e3/400/225",
            durationSeconds: 2580,
          },
          {
            id: "v12s1e4",
            episodeNumber: 4,
            title: "Dead Drop",
            description:
              "The handoff is ambushed. With two crew members taken hostage, Rax launches a rescue that may cost them everything.",
            runtime: "46m",
            thumbnailUrl: "https://picsum.photos/seed/v12s1e4/400/225",
            durationSeconds: 2760,
          },
        ],
      },
    ],
  },
  {
    id: "v13",
    title: "Echoes of Andromeda",
    year: 2025,
    rating: "TV-MA",
    runtime: "50m",
    genre: "Drama",
    language: "English",
    description:
      "A linguist selected for the first intergalactic transmission project must decode not just an alien language but the hidden agenda of the corporation funding the mission.",
    posterUrl: "https://picsum.photos/seed/v13echo/300/450",
    backdropUrl: "https://picsum.photos/seed/v13echo_back/800/450",
    subtitles: ["English", "French", "German"],
    tags: ["drama", "alien language", "corporation"],
    contentType: "series",
    seasons: [
      {
        seasonNumber: 1,
        label: "Season 1",
        episodes: [
          {
            id: "v13s1e1",
            episodeNumber: 1,
            title: "The Brief",
            description:
              "Dr. Mara Cole is flown to a remote research facility and handed a recording no one else has been able to interpret. Forty-eight hours to crack it — or the project is shelved.",
            runtime: "52m",
            thumbnailUrl: "https://picsum.photos/seed/v13s1e1/400/225",
            durationSeconds: 3120,
          },
          {
            id: "v13s1e2",
            episodeNumber: 2,
            title: "Patterns",
            description:
              "Mara finds a recursive structure in the signal that matches no known human language family. A rival analyst claims credit — and the race for discovery turns dangerous.",
            runtime: "49m",
            thumbnailUrl: "https://picsum.photos/seed/v13s1e2/400/225",
            durationSeconds: 2940,
          },
          {
            id: "v13s1e3",
            episodeNumber: 3,
            title: "Redacted",
            description:
              "Sections of the original recording have been deleted. Mara realises the corporation already knows what the signal says — and does not want her to find out.",
            runtime: "51m",
            thumbnailUrl: "https://picsum.photos/seed/v13s1e3/400/225",
            durationSeconds: 3060,
          },
        ],
      },
    ],
  },
  {
    id: "v14",
    title: "Titan Base Alpha",
    year: 2024,
    rating: "TV-14",
    runtime: "38m",
    genre: "Sci-Fi",
    language: "English",
    description:
      "A procedural drama set inside Saturn's largest moon, following the medics, engineers, and security officers of Titan's only permanent research outpost as they handle crises no training could prepare them for.",
    posterUrl: "https://picsum.photos/seed/v14titan/300/450",
    backdropUrl: "https://picsum.photos/seed/v14titan_back/800/450",
    subtitles: ["English", "Spanish", "Mandarin"],
    tags: ["titan", "procedural", "base life"],
    contentType: "series",
    seasons: [
      {
        seasonNumber: 1,
        label: "Season 1",
        episodes: [
          {
            id: "v14s1e1",
            episodeNumber: 1,
            title: "Orientation",
            description:
              "Three new arrivals get a brutal introduction to life on Titan when a methane geyser erupts directly beneath the base's access tunnel.",
            runtime: "40m",
            thumbnailUrl: "https://picsum.photos/seed/v14s1e1/400/225",
            durationSeconds: 2400,
          },
          {
            id: "v14s1e2",
            episodeNumber: 2,
            title: "Night Shift",
            description:
              "A mysterious illness spreads through the night crew. The base medic has twelve hours to identify the pathogen before the morning shift wakes up.",
            runtime: "37m",
            thumbnailUrl: "https://picsum.photos/seed/v14s1e2/400/225",
            durationSeconds: 2220,
          },
          {
            id: "v14s1e3",
            episodeNumber: 3,
            title: "Pressure",
            description:
              "A structural crack in Dome C triggers a base-wide evacuation protocol, but one engineer refuses to leave — and she may be the only person who can stop a full collapse.",
            runtime: "39m",
            thumbnailUrl: "https://picsum.photos/seed/v14s1e3/400/225",
            durationSeconds: 2340,
          },
          {
            id: "v14s1e4",
            episodeNumber: 4,
            title: "Contraband",
            description:
              "Security Chief Osei discovers an illegal hydroponics lab hidden deep in the base. Shutting it down could save the mission — or trigger a mutiny.",
            runtime: "38m",
            thumbnailUrl: "https://picsum.photos/seed/v14s1e4/400/225",
            durationSeconds: 2280,
          },
          {
            id: "v14s1e5",
            episodeNumber: 5,
            title: "The Dig",
            description:
              "An exploratory drill breaks through into a vast underground cavity. What the team finds inside will redefine humanity's understanding of life in the solar system.",
            runtime: "42m",
            thumbnailUrl: "https://picsum.photos/seed/v14s1e5/400/225",
            durationSeconds: 2520,
          },
        ],
      },
    ],
  },
];

// ─── Helper: format duration ──────────────────────────────────────────────────

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
  return count.toString();
}

// ─── Studio Seed Data ─────────────────────────────────────────────────────────

export const seedStudioVideos: StudioVideo[] = [
  {
    id: "sv1",
    title: "Stellar Odyssey",
    description:
      "A crew of interstellar explorers ventures beyond the known galaxy.",
    genre: "Sci-Fi",
    ageRating: "PG-13",
    primaryLanguage: "English",
    posterUrl: "https://picsum.photos/seed/v1stellar/300/450",
    hlsMasterUrl: "/media/videos/sv1/master.m3u8",
    processingStatus: "ready",
    isPublished: true,
    duration: "2h 18m",
    dateAdded: Date.now() - 7 * 24 * 60 * 60 * 1000,
    audioTracks: [
      {
        id: "sat1",
        language: "English",
        langCode: "en",
        audioLabel: "Stereo",
        isDefault: true,
      },
      {
        id: "sat2",
        language: "Spanish",
        langCode: "es",
        audioLabel: "Stereo",
        isDefault: false,
      },
      {
        id: "sat3",
        language: "French",
        langCode: "fr",
        audioLabel: "Stereo",
        isDefault: false,
      },
    ],
    subtitles: [
      { id: "ss1", language: "English", langCode: "en" },
      { id: "ss2", language: "Spanish", langCode: "es" },
    ],
  },
  {
    id: "sv2",
    title: "Gravity's Edge",
    description: "Two astronauts fight impossible odds to survive in orbit.",
    genre: "Action",
    ageRating: "PG-13",
    primaryLanguage: "English",
    posterUrl: "https://picsum.photos/seed/v2gravity/300/450",
    hlsMasterUrl: "/media/videos/sv2/master.m3u8",
    processingStatus: "ready",
    isPublished: true,
    duration: "1h 52m",
    dateAdded: Date.now() - 14 * 24 * 60 * 60 * 1000,
    audioTracks: [
      {
        id: "sat4",
        language: "English",
        langCode: "en",
        audioLabel: "Stereo",
        isDefault: true,
      },
      {
        id: "sat5",
        language: "Japanese",
        langCode: "ja",
        audioLabel: "Stereo",
        isDefault: false,
      },
    ],
    subtitles: [{ id: "ss3", language: "English", langCode: "en" }],
  },
  {
    id: "sv3",
    title: "Dark Matter",
    description:
      "A physicist navigates alternate realities to find his way home.",
    genre: "Drama",
    ageRating: "R",
    primaryLanguage: "English",
    posterUrl: "https://picsum.photos/seed/v4dark/300/450",
    hlsMasterUrl: "/media/videos/sv3/master.m3u8",
    processingStatus: "unpublished",
    isPublished: false,
    duration: "2h 05m",
    dateAdded: Date.now() - 3 * 24 * 60 * 60 * 1000,
    audioTracks: [
      {
        id: "sat6",
        language: "English",
        langCode: "en",
        audioLabel: "Stereo",
        isDefault: true,
      },
    ],
    subtitles: [],
  },
];
