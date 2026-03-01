import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { mockVideos, seedStudioMusic, seedStudioVideos } from "./mockData";
import type {
  AppSettings,
  AudioTrack,
  DownloadQuality,
  DownloadedItem,
  MusicPlayerState,
  MusicTrack,
  Passenger,
  PlayerBgId,
  StudioMusic,
  StudioVideo,
  TabId,
  ThemeId,
  VideoContent,
  VideoPlayerState,
} from "./types";
import { getFromLocalStorage, setToLocalStorage } from "./useLocalStorage";

// ─── LocalStorage Keys ────────────────────────────────────────────────────────
const KEYS = {
  PASSENGER: "sm_passenger",
  PASSENGERS: "sm_passengers",
  DOWNLOADS: "sm_downloads",
  SETTINGS: "sm_settings",
  CONNECTION: "sm_connection",
  STUDIO_VIDEOS: "sm_studio_videos",
  STUDIO_MUSIC: "sm_studio_music",
};

// ─── Default Values ───────────────────────────────────────────────────────────

function getDefaultSettings(passengerId: string): AppSettings {
  return {
    theme: "nebula",
    downloadQuality: "medium",
    passengerId,
    eqBands: [0, 0, 0, 0, 0],
    eqPreset: "Flat",
    simulateOffline: false,
    playerBg: "blue-moon",
  };
}

function getDaysFromNow(days: number): number {
  return Date.now() + days * 24 * 60 * 60 * 1000;
}

function getDaysAgo(days: number): number {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

function getLicenseDays(role: string): number {
  switch (role) {
    case "scientist":
    case "staff":
      return 180;
    case "manager":
      return 365;
    default:
      return 30;
  }
}

function seedDownloads(passengerId: string, role: string): DownloadedItem[] {
  const licenceDays = getLicenseDays(role);
  return [
    {
      id: "dl1",
      title: "Stellar Odyssey",
      mediaType: "video",
      artworkUrl: "https://picsum.photos/seed/v1stellar/300/450",
      downloadedAt: getDaysAgo(5),
      expiresAt: getDaysFromNow(3), // expiring soon
      licenseStatus: "valid",
      genre: "Sci-Fi",
      language: "English",
      artist: "",
      album: "",
      tags: ["space", "exploration"],
      passengerId,
      sizeBytes: 4_800_000_000,
    },
    {
      id: "dl2",
      title: "Cosmic Drift",
      mediaType: "music",
      artworkUrl: "https://picsum.photos/seed/t1cosmic/300/300",
      downloadedAt: getDaysAgo(10),
      expiresAt: getDaysFromNow(licenceDays - 10),
      licenseStatus: "valid",
      genre: "Electronic",
      language: "Instrumental",
      artist: "Luna Vera",
      album: "Stellar Dreams",
      tags: ["ambient", "chill"],
      passengerId,
      sizeBytes: 12_000_000,
    },
    {
      id: "dl3",
      title: "Dark Matter",
      mediaType: "video",
      artworkUrl: "https://picsum.photos/seed/v4dark/300/450",
      downloadedAt: getDaysAgo(40),
      expiresAt: getDaysAgo(5), // already expired
      licenseStatus: "expired",
      genre: "Drama",
      language: "English",
      artist: "",
      album: "",
      tags: ["quantum", "thriller"],
      passengerId,
      sizeBytes: 6_200_000_000,
    },
    {
      id: "dl4",
      title: "Solar Winds",
      mediaType: "music",
      artworkUrl: "https://picsum.photos/seed/t2solar/300/300",
      downloadedAt: getDaysAgo(2),
      expiresAt: getDaysFromNow(45),
      licenseStatus: "valid",
      genre: "Indie",
      language: "English",
      artist: "The Astronauts",
      album: "Beyond the Horizon",
      tags: ["indie", "space"],
      passengerId,
      sizeBytes: 9_800_000,
    },
  ];
}

// ─── Context Type ─────────────────────────────────────────────────────────────

interface AppContextType {
  // Auth
  passenger: Passenger | null;
  isAuthenticated: boolean;
  login: (p: Passenger) => void;
  logout: () => void;

  // Downloads
  downloads: DownloadedItem[];
  addDownload: (item: DownloadedItem) => void;
  removeDownload: (id: string) => void;
  renewDownload: (id: string) => void;
  renewAllDownloads: () => void;
  isDownloaded: (id: string) => boolean;

  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Connection
  isConnected: boolean;
  toggleConnection: () => void;

  // Navigation
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;

  // Music Player
  musicPlayer: MusicPlayerState;
  playTrack: (track: MusicTrack, queue?: MusicTrack[]) => void;
  pauseMusic: () => void;
  resumeMusic: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setMusicProgress: (seconds: number) => void;
  setVolume: (v: number) => void;
  showMusicPlayer: boolean;
  setShowMusicPlayer: (v: boolean) => void;

  // Video Player
  videoPlayer: VideoPlayerState;
  playVideo: (video: VideoContent) => void;
  closeVideoPlayer: () => void;
  setVideoProgress: (seconds: number) => void;
  setSubtitleLang: (lang: string) => void;
  setAudioLang: (lang: string) => void;
  showVideoPlayer: boolean;
  setShowVideoPlayer: (v: boolean) => void;

  // Search
  showSearch: boolean;
  setShowSearch: (v: boolean) => void;
  searchInitialTab: "video" | "music";
  setSearchInitialTab: (t: "video" | "music") => void;

  // Video Detail
  selectedVideo: VideoContent | null;
  setSelectedVideo: (v: VideoContent | null) => void;

  // Studio
  studioVideos: StudioVideo[];
  studioMusic: StudioMusic[];
  addStudioVideo: (v: StudioVideo) => void;
  updateStudioVideo: (id: string, updates: Partial<StudioVideo>) => void;
  deleteStudioVideo: (id: string) => void;
  addAudioTrackToVideo: (videoId: string, track: AudioTrack) => void;
  removeAudioTrackFromVideo: (videoId: string, trackId: string) => void;
  addStudioMusic: (m: StudioMusic) => void;
  updateStudioMusic: (id: string, updates: Partial<StudioMusic>) => void;
  deleteStudioMusic: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [passenger, setPassenger] = useState<Passenger | null>(() =>
    getFromLocalStorage<Passenger | null>(KEYS.PASSENGER, null),
  );

  const [downloads, setDownloads] = useState<DownloadedItem[]>(() =>
    getFromLocalStorage<DownloadedItem[]>(KEYS.DOWNLOADS, []),
  );

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = getFromLocalStorage<AppSettings | null>(KEYS.SETTINGS, null);
    if (!saved) return getDefaultSettings("");
    // Backfill playerBg if missing from older saved settings
    return {
      ...saved,
      playerBg: saved.playerBg ?? ("blue-moon" as PlayerBgId),
    };
  });

  const [isConnected, setIsConnected] = useState<boolean>(() =>
    getFromLocalStorage<boolean>(KEYS.CONNECTION, true),
  );

  const [activeTab, setActiveTab] = useState<TabId>("video");
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInitialTab, setSearchInitialTab] = useState<"video" | "music">(
    "video",
  );
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);

  // Studio state
  const [studioVideos, setStudioVideos] = useState<StudioVideo[]>(() => {
    const saved = getFromLocalStorage<StudioVideo[] | null>(
      KEYS.STUDIO_VIDEOS,
      null,
    );
    if (!saved || saved.length === 0) {
      setToLocalStorage(KEYS.STUDIO_VIDEOS, seedStudioVideos);
      return seedStudioVideos;
    }
    return saved;
  });

  const [studioMusic, setStudioMusic] = useState<StudioMusic[]>(() => {
    const saved = getFromLocalStorage<StudioMusic[] | null>(
      KEYS.STUDIO_MUSIC,
      null,
    );
    if (!saved || saved.length === 0) {
      setToLocalStorage(KEYS.STUDIO_MUSIC, seedStudioMusic);
      return seedStudioMusic;
    }
    return saved;
  });

  const [musicPlayer, setMusicPlayer] = useState<MusicPlayerState>({
    currentTrack: null,
    isPlaying: false,
    progress: 0,
    queue: [],
    shuffle: false,
    repeat: "none",
    volume: 0.8,
  });

  const [videoPlayer, setVideoPlayer] = useState<VideoPlayerState>({
    currentVideo: null,
    isPlaying: false,
    progress: 0,
    subtitleLang: "English",
    audioLang: "en",
  });

  // Apply theme on settings change
  useEffect(() => {
    const theme = settings.theme || "nebula";
    document.documentElement.setAttribute(
      "data-theme",
      theme === "nebula" ? "" : theme,
    );
  }, [settings.theme]);

  // ─── Auth ─────────────────────────────────────────────────────────────────

  const login = useCallback((p: Passenger) => {
    setToLocalStorage(KEYS.PASSENGER, p);
    setPassenger(p);

    // Load or seed downloads
    const existing = getFromLocalStorage<DownloadedItem[]>(KEYS.DOWNLOADS, []);
    const passengerDownloads = existing.filter((d) => d.passengerId === p.id);
    if (passengerDownloads.length === 0) {
      const seeded = seedDownloads(p.id, p.role);
      const allDownloads = [...existing, ...seeded];
      setToLocalStorage(KEYS.DOWNLOADS, allDownloads);
      setDownloads(seeded);
    } else {
      setDownloads(passengerDownloads);
    }

    // Load or create settings
    const savedSettings = getFromLocalStorage<AppSettings | null>(
      KEYS.SETTINGS,
      null,
    );
    if (!savedSettings || savedSettings.passengerId !== p.id) {
      const newSettings = getDefaultSettings(p.id);
      setToLocalStorage(KEYS.SETTINGS, newSettings);
      setSettings(newSettings);
    } else {
      setSettings(savedSettings);
    }
  }, []);

  const logout = useCallback(() => {
    setToLocalStorage(KEYS.PASSENGER, null);
    setPassenger(null);
    setMusicPlayer((prev) => ({
      ...prev,
      currentTrack: null,
      isPlaying: false,
    }));
    setShowMusicPlayer(false);
    setShowVideoPlayer(false);
  }, []);

  // ─── Downloads ────────────────────────────────────────────────────────────

  const addDownload = useCallback((item: DownloadedItem) => {
    setDownloads((prev) => {
      const next = prev.some((d) => d.id === item.id) ? prev : [...prev, item];
      setToLocalStorage(KEYS.DOWNLOADS, next);
      return next;
    });
  }, []);

  const removeDownload = useCallback((id: string) => {
    setDownloads((prev) => {
      const next = prev.filter((d) => d.id !== id);
      setToLocalStorage(KEYS.DOWNLOADS, next);
      return next;
    });
  }, []);

  const renewDownload = useCallback(
    (id: string) => {
      setDownloads((prev) => {
        const next = prev.map((d) => {
          if (d.id !== id) return d;
          const role = passenger?.role ?? "tourist";
          const days = getLicenseDays(role);
          return {
            ...d,
            expiresAt: Date.now() + days * 24 * 60 * 60 * 1000,
            licenseStatus: "valid" as const,
          };
        });
        setToLocalStorage(KEYS.DOWNLOADS, next);
        return next;
      });
    },
    [passenger?.role],
  );

  const renewAllDownloads = useCallback(() => {
    setDownloads((prev) => {
      const role = passenger?.role ?? "tourist";
      const days = getLicenseDays(role);
      const next = prev.map((d) => ({
        ...d,
        expiresAt: Date.now() + days * 24 * 60 * 60 * 1000,
        licenseStatus: "valid" as const,
      }));
      setToLocalStorage(KEYS.DOWNLOADS, next);
      return next;
    });
  }, [passenger?.role]);

  const isDownloaded = useCallback(
    (id: string) => downloads.some((d) => d.id === id),
    [downloads],
  );

  // ─── Settings ─────────────────────────────────────────────────────────────

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      setToLocalStorage(KEYS.SETTINGS, next);
      return next;
    });
  }, []);

  // ─── Connection ───────────────────────────────────────────────────────────

  const toggleConnection = useCallback(() => {
    setIsConnected((prev) => {
      const next = !prev;
      setToLocalStorage(KEYS.CONNECTION, next);
      return next;
    });
  }, []);

  // ─── Music Player ─────────────────────────────────────────────────────────

  const playTrack = useCallback((track: MusicTrack, queue?: MusicTrack[]) => {
    setMusicPlayer((prev) => ({
      ...prev,
      currentTrack: track,
      isPlaying: true,
      progress: 0,
      queue: queue ?? prev.queue,
    }));
  }, []);

  const pauseMusic = useCallback(() => {
    setMusicPlayer((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const resumeMusic = useCallback(() => {
    setMusicPlayer((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const nextTrack = useCallback(() => {
    setMusicPlayer((prev) => {
      if (!prev.queue.length) return prev;
      const idx = prev.queue.findIndex((t) => t.id === prev.currentTrack?.id);
      let nextIdx: number;
      if (prev.shuffle) {
        nextIdx = Math.floor(Math.random() * prev.queue.length);
      } else {
        nextIdx = (idx + 1) % prev.queue.length;
      }
      return {
        ...prev,
        currentTrack: prev.queue[nextIdx],
        progress: 0,
        isPlaying: true,
      };
    });
  }, []);

  const prevTrack = useCallback(() => {
    setMusicPlayer((prev) => {
      if (prev.progress > 5) return { ...prev, progress: 0 };
      if (!prev.queue.length) return prev;
      const idx = prev.queue.findIndex((t) => t.id === prev.currentTrack?.id);
      const prevIdx = (idx - 1 + prev.queue.length) % prev.queue.length;
      return {
        ...prev,
        currentTrack: prev.queue[prevIdx],
        progress: 0,
        isPlaying: true,
      };
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setMusicPlayer((prev) => ({ ...prev, shuffle: !prev.shuffle }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setMusicPlayer((prev) => {
      const next: "none" | "one" | "all" =
        prev.repeat === "none" ? "all" : prev.repeat === "all" ? "one" : "none";
      return { ...prev, repeat: next };
    });
  }, []);

  const setMusicProgress = useCallback((seconds: number) => {
    setMusicPlayer((prev) => ({ ...prev, progress: seconds }));
  }, []);

  const setVolume = useCallback((v: number) => {
    setMusicPlayer((prev) => ({ ...prev, volume: v }));
  }, []);

  // ─── Video Player ─────────────────────────────────────────────────────────

  const playVideo = useCallback((video: VideoContent) => {
    setVideoPlayer({
      currentVideo: video,
      isPlaying: true,
      progress: video.resumePosition ?? 0,
      subtitleLang: "Off",
      audioLang: video.defaultAudioLang ?? "en",
    });
    setShowVideoPlayer(true);
  }, []);

  const closeVideoPlayer = useCallback(() => {
    setShowVideoPlayer(false);
    setVideoPlayer((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const setVideoProgress = useCallback((seconds: number) => {
    setVideoPlayer((prev) => ({ ...prev, progress: seconds }));
  }, []);

  const setSubtitleLang = useCallback((lang: string) => {
    setVideoPlayer((prev) => ({ ...prev, subtitleLang: lang }));
  }, []);

  const setAudioLang = useCallback((lang: string) => {
    setVideoPlayer((prev) => ({ ...prev, audioLang: lang }));
  }, []);

  // ─── Studio ───────────────────────────────────────────────────────────────

  const addStudioVideo = useCallback((v: StudioVideo) => {
    setStudioVideos((prev) => {
      const next = [...prev, v];
      setToLocalStorage(KEYS.STUDIO_VIDEOS, next);
      return next;
    });
  }, []);

  const updateStudioVideo = useCallback(
    (id: string, updates: Partial<StudioVideo>) => {
      setStudioVideos((prev) => {
        const next = prev.map((v) => (v.id === id ? { ...v, ...updates } : v));
        setToLocalStorage(KEYS.STUDIO_VIDEOS, next);
        return next;
      });
    },
    [],
  );

  const deleteStudioVideo = useCallback((id: string) => {
    setStudioVideos((prev) => {
      const next = prev.filter((v) => v.id !== id);
      setToLocalStorage(KEYS.STUDIO_VIDEOS, next);
      return next;
    });
  }, []);

  const addAudioTrackToVideo = useCallback(
    (videoId: string, track: AudioTrack) => {
      setStudioVideos((prev) => {
        const next = prev.map((v) => {
          if (v.id !== videoId) return v;
          return { ...v, audioTracks: [...v.audioTracks, track] };
        });
        setToLocalStorage(KEYS.STUDIO_VIDEOS, next);
        return next;
      });
    },
    [],
  );

  const removeAudioTrackFromVideo = useCallback(
    (videoId: string, trackId: string) => {
      setStudioVideos((prev) => {
        const next = prev.map((v) => {
          if (v.id !== videoId) return v;
          return {
            ...v,
            audioTracks: v.audioTracks.filter((t) => t.id !== trackId),
          };
        });
        setToLocalStorage(KEYS.STUDIO_VIDEOS, next);
        return next;
      });
    },
    [],
  );

  const addStudioMusic = useCallback((m: StudioMusic) => {
    setStudioMusic((prev) => {
      const next = [...prev, m];
      setToLocalStorage(KEYS.STUDIO_MUSIC, next);
      return next;
    });
  }, []);

  const updateStudioMusic = useCallback(
    (id: string, updates: Partial<StudioMusic>) => {
      setStudioMusic((prev) => {
        const next = prev.map((m) => (m.id === id ? { ...m, ...updates } : m));
        setToLocalStorage(KEYS.STUDIO_MUSIC, next);
        return next;
      });
    },
    [],
  );

  const deleteStudioMusic = useCallback((id: string) => {
    setStudioMusic((prev) => {
      const next = prev.filter((m) => m.id !== id);
      setToLocalStorage(KEYS.STUDIO_MUSIC, next);
      return next;
    });
  }, []);

  // Simulate music progress
  useEffect(() => {
    if (!musicPlayer.isPlaying || !musicPlayer.currentTrack) return;
    const interval = setInterval(() => {
      setMusicPlayer((prev) => {
        if (!prev.currentTrack || !prev.isPlaying) return prev;
        const newProgress = prev.progress + 1;
        if (newProgress >= prev.currentTrack.duration) {
          if (prev.repeat === "one") return { ...prev, progress: 0 };
          if (prev.queue.length > 1 || prev.repeat === "all") {
            const idx = prev.queue.findIndex(
              (t) => t.id === prev.currentTrack?.id,
            );
            const nextIdx = (idx + 1) % prev.queue.length;
            return { ...prev, currentTrack: prev.queue[nextIdx], progress: 0 };
          }
          return { ...prev, isPlaying: false, progress: 0 };
        }
        return { ...prev, progress: newProgress };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [musicPlayer.isPlaying, musicPlayer.currentTrack]);

  const value: AppContextType = {
    passenger,
    isAuthenticated: !!passenger,
    login,
    logout,
    downloads,
    addDownload,
    removeDownload,
    renewDownload,
    renewAllDownloads,
    isDownloaded,
    settings,
    updateSettings,
    isConnected,
    toggleConnection,
    activeTab,
    setActiveTab,
    musicPlayer,
    playTrack,
    pauseMusic,
    resumeMusic,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
    setMusicProgress,
    setVolume,
    showMusicPlayer,
    setShowMusicPlayer,
    videoPlayer,
    playVideo,
    closeVideoPlayer,
    setVideoProgress,
    setSubtitleLang,
    setAudioLang,
    showVideoPlayer,
    setShowVideoPlayer,
    showSearch,
    setShowSearch,
    searchInitialTab,
    setSearchInitialTab,
    selectedVideo,
    setSelectedVideo,
    studioVideos,
    studioMusic,
    addStudioVideo,
    updateStudioVideo,
    deleteStudioVideo,
    addAudioTrackToVideo,
    removeAudioTrackFromVideo,
    addStudioMusic,
    updateStudioMusic,
    deleteStudioMusic,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
