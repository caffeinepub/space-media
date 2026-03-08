// ─── Passenger / Auth ────────────────────────────────────────────────────────

export type PassengerRole = "tourist" | "scientist" | "staff" | "manager";

export interface Passenger {
  id: string;
  name: string;
  role: PassengerRole;
  tripId: string;
  passportId?: string;
  createdAt: number; // ms timestamp
}

// ─── Media Content ───────────────────────────────────────────────────────────

export interface AudioTrack {
  id: string;
  language: string;
  langCode: string;
  audioLabel: string; // "Stereo" | "5.1" | "Commentary"
  isDefault: boolean;
}

export interface SubtitleTrack {
  id: string;
  language: string;
  langCode: string;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  description: string;
  runtime: string;
  thumbnailUrl: string;
  resumePosition?: number; // 0-1 progress ratio (legacy static)
  durationSeconds?: number; // for progress tracking
}

export interface Season {
  seasonNumber: number;
  label: string; // e.g. "Season 1"
  episodes: Episode[];
}

export interface MoviePart {
  partNumber: number;
  label: string; // e.g. "Part 1"
  videoId: string; // references a VideoContent id
  title: string;
}

export interface VideoContent {
  id: string;
  title: string;
  year: number;
  rating: string; // e.g. "PG-13"
  runtime: string; // e.g. "1h 45m"
  genre: string;
  language: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  subtitles: string[];
  resumePosition?: number; // seconds
  tags?: string[];
  // HLS multi-audio fields
  hlsMasterUrl?: string;
  audioTracks?: AudioTrack[];
  defaultAudioLang?: string;
  // Series / multi-part
  contentType?: "movie" | "series";
  seasons?: Season[];
  parts?: MoviePart[];
}

// ─── Studio ───────────────────────────────────────────────────────────────────

export interface StudioVideo {
  id: string;
  title: string;
  description: string;
  genre: string;
  ageRating: string;
  primaryLanguage: string;
  posterUrl: string;
  hlsMasterUrl: string;
  processingStatus: "processing" | "ready" | "failed" | "unpublished";
  audioTracks: AudioTrack[];
  subtitles: SubtitleTrack[];
  dateAdded: number;
  duration: string;
  isPublished: boolean;
  // Content type system
  contentType?: "movie" | "series";
  seriesId?: string; // shared ID for all parts of a movie OR all episodes of a web series
  seasonNumber?: number; // for web series episodes
  partNumber?: number; // for multi-part movies
  episodeNumber?: number; // for web series episodes
  episodeTitle?: string; // episode title (series only)
}

// ─── Episode Progress Tracking ────────────────────────────────────────────────

export interface EpisodeProgress {
  episodeId: string;
  watchedSeconds: number;
  durationSeconds: number; // total duration, for ratio
  completed: boolean;
  lastWatchedAt: number; // ms timestamp
}

export interface SeasonProgress {
  seasonNumber: number;
  episodes: Record<string, EpisodeProgress>; // key: episodeId
  lastEpisodeId: string | null;
}

export interface SeriesProgress {
  seriesVideoId: string; // the VideoContent id of the series
  seasons: Record<number, SeasonProgress>; // key: seasonNumber
  lastSeasonNumber: number;
  lastEpisodeId: string | null;
}

// ─── Downloads ───────────────────────────────────────────────────────────────

export type MediaType = "video";
export type LicenseStatus = "valid" | "expired";

export interface DownloadedItem {
  id: string;
  title: string;
  mediaType: MediaType;
  artworkUrl: string;
  downloadedAt: number; // ms timestamp
  expiresAt: number; // ms timestamp
  licenseStatus: LicenseStatus;
  // metadata for search
  genre: string;
  language: string;
  artist: string;
  album: string;
  tags: string[];
  passengerId: string;
  // mock file size
  sizeBytes: number;
}

// ─── Settings ────────────────────────────────────────────────────────────────

export type ThemeId =
  | "nebula"
  | "dark"
  | "aurora"
  | "crimson"
  | "ocean"
  | "desert"
  | "arctic"
  | "neon";

export type DownloadQuality = "low" | "medium" | "high";

export interface AppSettings {
  theme: ThemeId;
  downloadQuality: DownloadQuality;
  passengerId: string;
  simulateOffline: boolean;
}

// ─── Player State ────────────────────────────────────────────────────────────

export interface VideoPlayerState {
  currentVideo: VideoContent | null;
  isPlaying: boolean;
  progress: number; // seconds
  subtitleLang: string;
  audioLang: string; // currently selected audio language code
}

// ─── Theme Definition ─────────────────────────────────────────────────────────

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  imageUrl: string;
  dataAttr: string;
}

// ─── Series Watch History ────────────────────────────────────────────────────

/** Map from videoId (series root) → SeriesProgress */
export type SeriesProgressMap = Record<string, SeriesProgress>;

// ─── Navigation ──────────────────────────────────────────────────────────────

export type TabId = "video" | "downloads" | "studio" | "analytics" | "profile";
