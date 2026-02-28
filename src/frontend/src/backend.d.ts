import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Passenger {
    id: string;
    name: string;
    createdAt: bigint;
    tripId: string;
    role: string;
}
export interface AppSettings {
    theme: string;
    downloadQuality: string;
    passengerId: string;
}
export interface DownloadedItem {
    id: string;
    title: string;
    expiresAt: bigint;
    album: string;
    tags: Array<string>;
    artworkUrl: string;
    downloadedAt: bigint;
    language: string;
    genre: string;
    passengerId: string;
    mediaType: string;
    artist: string;
}
export interface AudioTrack {
    id: string;
    audioLabel: string;
    langCode: string;
    language: string;
    isDefault: boolean;
}
export interface StudioMusic {
    id: string;
    title: string;
    duration: string;
    album: string;
    isPublished: boolean;
    language: string;
    genre: string;
    artist: string;
    coverArt: string;
    dateAdded: bigint;
}
export interface StudioVideo {
    id: string;
    title: string;
    audioTracks: Array<AudioTrack>;
    duration: string;
    hlsMasterUrl: string;
    processingStatus: string;
    isPublished: boolean;
    ageRating: string;
    description: string;
    genre: string;
    posterUrl: string;
    primaryLanguage: string;
    dateAdded: bigint;
}
export interface backendInterface {
    addAudioTrack(videoId: string, track: AudioTrack): Promise<void>;
    addDownload(item: DownloadedItem): Promise<void>;
    createPassenger(id: string, name: string, role: string, tripId: string): Promise<void>;
    createStudioMusic(music: StudioMusic): Promise<void>;
    createStudioVideo(video: StudioVideo): Promise<void>;
    deleteDownload(id: string): Promise<void>;
    deleteStudioMusic(id: string): Promise<void>;
    deleteStudioVideo(id: string): Promise<void>;
    getDownloads(passengerId: string): Promise<Array<DownloadedItem>>;
    getPassenger(passengerId: string): Promise<Passenger>;
    getSettings(passengerId: string): Promise<AppSettings | null>;
    getStudioMusic(id: string): Promise<StudioMusic>;
    getStudioVideo(id: string): Promise<StudioVideo>;
    listPassengers(): Promise<Array<Passenger>>;
    listStudioMusic(): Promise<Array<StudioMusic>>;
    listStudioVideos(): Promise<Array<StudioVideo>>;
    removeAudioTrack(videoId: string, trackId: string): Promise<void>;
    renewDownload(id: string, newExpiresAt: bigint): Promise<void>;
    saveSettings(passengerId: string, theme: string, downloadQuality: string): Promise<void>;
    searchDownloads(passengerId: string, searchTerm: string, typeFilter: string | null): Promise<Array<DownloadedItem>>;
    setDefaultAudioTrack(videoId: string, trackId: string): Promise<void>;
    updateStudioMusic(id: string, title: string, artist: string, album: string, genre: string, language: string, coverArt: string, isPublished: boolean): Promise<void>;
    updateStudioVideo(id: string, title: string, description: string, genre: string, ageRating: string, primaryLanguage: string, posterUrl: string, hlsMasterUrl: string, processingStatus: string, isPublished: boolean): Promise<void>;
    validateManagerKey(key: string): Promise<boolean>;
    validateStaffKey(key: string): Promise<boolean>;
}
