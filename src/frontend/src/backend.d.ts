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
export interface AppSettings {
    theme: string;
    downloadQuality: string;
    passengerId: string;
}
export interface backendInterface {
    addDownload(item: DownloadedItem): Promise<void>;
    createPassenger(id: string, name: string, role: string, tripId: string): Promise<void>;
    deleteDownload(id: string): Promise<void>;
    getDownloads(passengerId: string): Promise<Array<DownloadedItem>>;
    getPassenger(passengerId: string): Promise<Passenger>;
    getSettings(passengerId: string): Promise<AppSettings | null>;
    listPassengers(): Promise<Array<Passenger>>;
    renewDownload(id: string, newExpiresAt: bigint): Promise<void>;
    saveSettings(passengerId: string, theme: string, downloadQuality: string): Promise<void>;
    searchDownloads(passengerId: string, searchTerm: string, typeFilter: string | null): Promise<Array<DownloadedItem>>;
    validateStaffKey(key: string): Promise<boolean>;
}
