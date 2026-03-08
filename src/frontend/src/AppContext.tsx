import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { mockVideos, seedStudioVideos } from "./mockData";
import type {
  AppSettings,
  AudioTrack,
  DownloadQuality,
  DownloadedItem,
  EpisodeProgress,
  Passenger,
  SeriesProgressMap,
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
  SERIES_PROGRESS: "sm_series_progress",
};

// ─── Default Values ───────────────────────────────────────────────────────────

function getDefaultSettings(passengerId: string): AppSettings {
  return {
    theme: "nebula",
    downloadQuality: "medium",
    passengerId,
    simulateOffline: false,
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
      id: "dl_nebula",
      title: "Nebula Station S1",
      mediaType: "video",
      artworkUrl: "https://picsum.photos/seed/v5nebula/300/450",
      downloadedAt: getDaysAgo(2),
      expiresAt: getDaysFromNow(licenceDays - 2),
      licenseStatus: "valid",
      genre: "Sci-Fi",
      language: "English",
      artist: "",
      album: "",
      tags: ["series", "space", "station"],
      passengerId,
      sizeBytes: 8_500_000_000,
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
  searchInitialTab: "video";
  setSearchInitialTab: (t: "video") => void;

  // Video Detail
  selectedVideo: VideoContent | null;
  setSelectedVideo: (v: VideoContent | null) => void;

  // Studio
  studioVideos: StudioVideo[];
  addStudioVideo: (v: StudioVideo) => void;
  updateStudioVideo: (id: string, updates: Partial<StudioVideo>) => void;
  deleteStudioVideo: (id: string) => void;
  addAudioTrackToVideo: (videoId: string, track: AudioTrack) => void;
  removeAudioTrackFromVideo: (videoId: string, trackId: string) => void;

  // Series Watch Progress
  seriesProgress: SeriesProgressMap;
  getEpisodeProgress: (
    videoId: string,
    seasonNumber: number,
    episodeId: string,
  ) => EpisodeProgress | null;
  setEpisodeProgress: (
    videoId: string,
    seasonNumber: number,
    episodeId: string,
    seconds: number,
    durationSeconds: number,
  ) => void;
  getSeriesResumeInfo: (
    videoId: string,
  ) => { seasonNumber: number; episodeId: string; seconds: number } | null;
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
    return {
      theme: saved.theme ?? "nebula",
      downloadQuality: saved.downloadQuality ?? "medium",
      passengerId: saved.passengerId ?? "",
      simulateOffline: saved.simulateOffline ?? false,
    };
  });

  const [isConnected, setIsConnected] = useState<boolean>(() =>
    getFromLocalStorage<boolean>(KEYS.CONNECTION, true),
  );

  const [activeTab, setActiveTab] = useState<TabId>("video");
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInitialTab] = useState<"video">("video");
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

  const [seriesProgress, setSeriesProgress] = useState<SeriesProgressMap>(() =>
    getFromLocalStorage<SeriesProgressMap>(KEYS.SERIES_PROGRESS, {}),
  );

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
      setSettings({
        theme: savedSettings.theme ?? "nebula",
        downloadQuality: savedSettings.downloadQuality ?? "medium",
        passengerId: savedSettings.passengerId ?? p.id,
        simulateOffline: savedSettings.simulateOffline ?? false,
      });
    }
  }, []);

  const logout = useCallback(() => {
    setToLocalStorage(KEYS.PASSENGER, null);
    setPassenger(null);
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

  // ─── Series Watch Progress ────────────────────────────────────────────────

  const getEpisodeProgress = useCallback(
    (
      videoId: string,
      seasonNumber: number,
      episodeId: string,
    ): EpisodeProgress | null => {
      return (
        seriesProgress[videoId]?.seasons[seasonNumber]?.episodes[episodeId] ??
        null
      );
    },
    [seriesProgress],
  );

  const setEpisodeProgress = useCallback(
    (
      videoId: string,
      seasonNumber: number,
      episodeId: string,
      seconds: number,
      durationSeconds: number,
    ) => {
      setSeriesProgress((prev) => {
        const series = prev[videoId] ?? {
          seriesVideoId: videoId,
          seasons: {},
          lastSeasonNumber: seasonNumber,
          lastEpisodeId: episodeId,
        };
        const season = series.seasons[seasonNumber] ?? {
          seasonNumber,
          episodes: {},
          lastEpisodeId: episodeId,
        };
        const ep: EpisodeProgress = {
          episodeId,
          watchedSeconds: seconds,
          durationSeconds,
          completed: durationSeconds > 0 && seconds / durationSeconds >= 0.9,
          lastWatchedAt: Date.now(),
        };
        const updatedSeason = {
          ...season,
          episodes: { ...season.episodes, [episodeId]: ep },
          lastEpisodeId: episodeId,
        };
        const updatedSeries = {
          ...series,
          seasons: { ...series.seasons, [seasonNumber]: updatedSeason },
          lastSeasonNumber: seasonNumber,
          lastEpisodeId: episodeId,
        };
        const next = { ...prev, [videoId]: updatedSeries };
        setToLocalStorage(KEYS.SERIES_PROGRESS, next);
        return next;
      });
    },
    [],
  );

  const getSeriesResumeInfo = useCallback(
    (
      videoId: string,
    ): { seasonNumber: number; episodeId: string; seconds: number } | null => {
      const sp = seriesProgress[videoId];
      if (!sp || !sp.lastEpisodeId) return null;
      const ep = sp.seasons[sp.lastSeasonNumber]?.episodes[sp.lastEpisodeId];
      if (!ep || ep.completed) return null;
      return {
        seasonNumber: sp.lastSeasonNumber,
        episodeId: sp.lastEpisodeId,
        seconds: ep.watchedSeconds,
      };
    },
    [seriesProgress],
  );

  const setSearchInitialTab = useCallback((_t: "video") => {
    // Always video-only; no-op setter kept for API compatibility
  }, []);

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
    addStudioVideo,
    updateStudioVideo,
    deleteStudioVideo,
    addAudioTrackToVideo,
    removeAudioTrackFromVideo,
    seriesProgress,
    getEpisodeProgress,
    setEpisodeProgress,
    getSeriesResumeInfo,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
