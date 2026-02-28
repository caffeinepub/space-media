// ─── Passenger / Auth ────────────────────────────────────────────────────────

export type PassengerRole = "tourist" | "scientist";

export interface Passenger {
  id: string;
  name: string;
  role: PassengerRole;
  tripId: string;
  passportId?: string;
  createdAt: number; // ms timestamp
}

// ─── Media Content ───────────────────────────────────────────────────────────

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
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number; // seconds
  genre: string;
  year?: number;
}

export interface Playlist {
  id: string;
  name: string;
  coverArt: string;
  trackCount: number;
  description: string;
  tracks?: string[]; // track ids
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverArt: string;
  year: number;
  trackCount: number;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  genre: string;
  followerCount: number;
}

// ─── Downloads ───────────────────────────────────────────────────────────────

export type MediaType = "video" | "music";
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
  eqBands: number[]; // 5 values, -12 to +12
  eqPreset: string;
  simulateOffline: boolean;
}

// ─── Player State ────────────────────────────────────────────────────────────

export interface MusicPlayerState {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  progress: number; // seconds
  queue: MusicTrack[];
  shuffle: boolean;
  repeat: "none" | "one" | "all";
  volume: number; // 0-1
}

export interface VideoPlayerState {
  currentVideo: VideoContent | null;
  isPlaying: boolean;
  progress: number; // seconds
  subtitleLang: string;
}

// ─── Theme Definition ─────────────────────────────────────────────────────────

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  imageUrl: string;
  dataAttr: string;
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export type TabId = "video" | "music" | "downloads" | "profile";
