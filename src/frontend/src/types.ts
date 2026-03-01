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
}

export interface StudioMusic {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  language: string;
  coverArt: string;
  dateAdded: number;
  duration: string;
  isPublished: boolean;
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

export type PlayerBgId = "blue-moon" | "red-nebula";

export interface AppSettings {
  theme: ThemeId;
  downloadQuality: DownloadQuality;
  passengerId: string;
  eqBands: number[]; // 5 values, -12 to +12
  eqPreset: string;
  simulateOffline: boolean;
  playerBg: PlayerBgId;
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
  audioLang: string; // currently selected audio language code
}

// ─── Theme Definition ─────────────────────────────────────────────────────────

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  imageUrl: string;
  dataAttr: string;
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export type TabId =
  | "video"
  | "music"
  | "downloads"
  | "studio"
  | "analytics"
  | "profile";
