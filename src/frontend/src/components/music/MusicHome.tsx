import { useApp } from "@/AppContext";
import StatusPill from "@/components/shared/StatusPill";
import {
  formatFollowers,
  mockAlbums,
  mockArtists,
  mockPlaylists,
  mockTracks,
} from "@/mockData";
import { ChevronRight, Search } from "lucide-react";
import { motion } from "motion/react";

export default function MusicHome() {
  const { playTrack, setShowSearch, setSearchInitialTab } = useApp();

  function handleOpenSearch() {
    setSearchInitialTab("music");
    setShowSearch(true);
  }

  return (
    <div
      className="flex flex-col h-full overflow-y-auto scrollbar-hide"
      style={{ backgroundColor: "oklch(0.97 0 0)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 pt-5 pb-3 sticky top-0 z-10"
        style={{ backgroundColor: "oklch(0.97 0 0)" }}
      >
        <h1
          className="text-2xl font-bold font-display"
          style={{ color: "oklch(0.12 0.01 270)" }}
        >
          Music
        </h1>
        <div className="flex items-center gap-2">
          <StatusPill />
          <button
            type="button"
            onClick={handleOpenSearch}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundColor: "oklch(0.90 0.01 270)",
              color: "oklch(0.30 0.01 270)",
            }}
            aria-label="Search music"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recently Played */}
      <section className="mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2
            className="text-base font-bold"
            style={{ color: "oklch(0.12 0.01 270)" }}
          >
            Recently Played
          </h2>
          <button
            type="button"
            className="text-xs font-semibold flex items-center gap-0.5"
            style={{ color: "oklch(var(--theme-accent))" }}
          >
            See All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4">
          {mockTracks.slice(0, 8).map((track, i) => (
            <motion.button
              key={track.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => playTrack(track, mockTracks.slice(0, 8))}
              className="shrink-0 flex flex-col items-center gap-2 focus:outline-none group"
            >
              <div className="relative w-16 h-16">
                <img
                  src={track.albumArt}
                  alt={track.album}
                  className="w-16 h-16 rounded-full object-cover shadow-md transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              <p
                className="text-xs font-medium text-center w-16 truncate"
                style={{ color: "oklch(0.25 0.01 270)" }}
              >
                {track.artist}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Featured Playlist */}
      <section className="px-4 mb-6">
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            const tracks = mockTracks.slice(0, 10);
            if (tracks[0]) playTrack(tracks[0], tracks);
          }}
          className="w-full rounded-2xl overflow-hidden relative h-36 focus:outline-none"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}
        >
          <img
            src={mockPlaylists[0].coverArt}
            alt={mockPlaylists[0].name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.15 0.10 290 / 0.85), oklch(0.10 0.08 250 / 0.75))",
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">
              Featured Playlist
            </p>
            <h3 className="text-white text-lg font-bold font-display">
              {mockPlaylists[0].name}
            </h3>
            <p className="text-white/70 text-xs">
              {mockPlaylists[0].description}
            </p>
          </div>
        </motion.button>
      </section>

      {/* Featured Playlists Grid */}
      <section className="mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2
            className="text-base font-bold"
            style={{ color: "oklch(0.12 0.01 270)" }}
          >
            Featured Playlists
          </h2>
          <button
            type="button"
            className="text-xs font-semibold flex items-center gap-0.5"
            style={{ color: "oklch(var(--theme-accent))" }}
          >
            See All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 px-4">
          {mockPlaylists.slice(1).map((playlist, i) => (
            <motion.button
              key={playlist.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={() => {
                const tracks = mockTracks.slice(i * 3, i * 3 + 6);
                if (tracks[0]) playTrack(tracks[0], tracks);
              }}
              className="rounded-xl overflow-hidden relative focus:outline-none group"
              style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.10)" }}
            >
              <img
                src={playlist.coverArt}
                alt={playlist.name}
                className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.7), transparent 50%)",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-white text-xs font-semibold text-left truncate">
                  {playlist.name}
                </p>
                <p className="text-white/60 text-[10px] text-left">
                  {playlist.trackCount} tracks
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* New Albums */}
      <section className="mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2
            className="text-base font-bold"
            style={{ color: "oklch(0.12 0.01 270)" }}
          >
            New Albums
          </h2>
          <button
            type="button"
            className="text-xs font-semibold flex items-center gap-0.5"
            style={{ color: "oklch(var(--theme-accent))" }}
          >
            See All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4">
          {mockAlbums.map((album, i) => (
            <motion.button
              key={album.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => {
                const tracks = mockTracks.filter(
                  (t) => t.album === album.title,
                );
                const first = tracks[0] ?? mockTracks[i];
                playTrack(first, tracks.length > 0 ? tracks : mockTracks);
              }}
              className="shrink-0 w-28 focus:outline-none group text-left"
            >
              <img
                src={album.coverArt}
                alt={album.title}
                className="w-28 h-28 rounded-xl object-cover shadow-md transition-transform group-hover:scale-105 mb-2"
              />
              <p
                className="text-xs font-semibold truncate"
                style={{ color: "oklch(0.15 0.01 270)" }}
              >
                {album.title}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "oklch(0.45 0.01 270)" }}
              >
                {album.artist}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Artists */}
      <section className="mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2
            className="text-base font-bold"
            style={{ color: "oklch(0.12 0.01 270)" }}
          >
            Artists
          </h2>
          <button
            type="button"
            className="text-xs font-semibold flex items-center gap-0.5"
            style={{ color: "oklch(var(--theme-accent))" }}
          >
            See All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4">
          {mockArtists.map((artist, i) => (
            <motion.button
              key={artist.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => {
                const tracks = mockTracks.filter(
                  (t) => t.artist === artist.name,
                );
                const first = tracks[0] ?? mockTracks[i];
                playTrack(first, tracks.length > 0 ? tracks : mockTracks);
              }}
              className="shrink-0 flex flex-col items-center gap-2 w-20 focus:outline-none group"
            >
              <img
                src={artist.imageUrl}
                alt={artist.name}
                className="w-16 h-16 rounded-full object-cover shadow-md transition-transform group-hover:scale-105"
              />
              <p
                className="text-xs font-medium text-center leading-tight line-clamp-2"
                style={{ color: "oklch(0.20 0.01 270)" }}
              >
                {artist.name}
              </p>
              <p
                className="text-[10px] text-center"
                style={{ color: "oklch(0.50 0.01 270)" }}
              >
                {formatFollowers(artist.followerCount)}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="h-28" />
    </div>
  );
}
