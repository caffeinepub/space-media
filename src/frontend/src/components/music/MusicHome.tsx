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
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 xl:px-8 pt-5 pb-3 sticky top-0 z-10 bg-background border-b border-border/40">
        <h1 className="text-2xl xl:text-3xl font-bold font-display text-foreground">
          Music
        </h1>
        <div className="flex items-center gap-2">
          <StatusPill />
          <button
            type="button"
            onClick={handleOpenSearch}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-primary bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground"
            aria-label="Search music"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recently Played */}
      <section className="mb-6 xl:mb-8">
        <div className="flex items-center justify-between px-4 xl:px-8 mt-5 mb-3">
          <h2 className="text-base md:text-lg lg:text-xl font-bold text-foreground">
            Recently Played
          </h2>
          <button
            type="button"
            className="text-xs font-semibold flex items-center gap-0.5 text-primary hover:opacity-80 transition-opacity"
          >
            See All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 xl:px-8">
          {mockTracks.slice(0, 8).map((track, i) => (
            <motion.button
              key={track.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => playTrack(track, mockTracks.slice(0, 8))}
              className="shrink-0 flex flex-col items-center gap-2 focus:outline-none group focus-visible:ring-2 focus-visible:ring-primary rounded-full"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28">
                <img
                  src={track.albumArt}
                  alt={track.album}
                  className="w-full h-full rounded-full object-cover shadow-md transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              <p className="text-xs font-medium text-center w-16 md:w-20 lg:w-24 xl:w-28 truncate text-muted-foreground">
                {track.artist}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Featured Playlist hero */}
      <section className="px-4 xl:px-8 mb-6 xl:mb-8">
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            const tracks = mockTracks.slice(0, 10);
            if (tracks[0]) playTrack(tracks[0], tracks);
          }}
          className="w-full rounded-2xl overflow-hidden relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          style={{
            height: "clamp(130px, 36vw, 240px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          }}
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
          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 xl:p-8">
            <p className="text-white/70 text-xs xl:text-sm font-semibold uppercase tracking-wider mb-1">
              Featured Playlist
            </p>
            <h3 className="text-white text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold font-display">
              {mockPlaylists[0].name}
            </h3>
            <p className="text-white/70 text-xs xl:text-sm">
              {mockPlaylists[0].description}
            </p>
          </div>
        </motion.button>
      </section>

      {/* Featured Playlists Grid */}
      <section className="mb-6 xl:mb-8">
        <div className="flex items-center justify-between px-4 xl:px-8 mb-3">
          <h2 className="text-base md:text-lg lg:text-xl font-bold text-foreground">
            Featured Playlists
          </h2>
          <button
            type="button"
            className="text-xs font-semibold flex items-center gap-0.5 text-primary hover:opacity-80 transition-opacity"
          >
            See All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {/* 2 cols mobile, 4 tablet, 5 lg, 6 xl */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 px-4 xl:px-8">
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
              className="rounded-xl overflow-hidden relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary group shadow-card-dark"
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
      <section className="mb-6 xl:mb-8">
        <div className="flex items-center justify-between px-4 xl:px-8 mb-3">
          <h2 className="text-base md:text-lg lg:text-xl font-bold text-foreground">
            New Albums
          </h2>
          <button
            type="button"
            className="text-xs font-semibold flex items-center gap-0.5 text-primary hover:opacity-80 transition-opacity"
          >
            See All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {/* Grid on md+, horizontal scroll on mobile */}
        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 px-4 xl:px-8">
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
              className="focus:outline-none group text-left focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            >
              <img
                src={album.coverArt}
                alt={album.title}
                className="w-full aspect-square rounded-xl object-cover shadow-card-dark transition-transform group-hover:scale-105 mb-2"
              />
              <p className="text-xs font-semibold truncate text-foreground">
                {album.title}
              </p>
              <p className="text-xs truncate text-muted-foreground">
                {album.artist}
              </p>
            </motion.button>
          ))}
        </div>
        {/* Mobile horizontal scroll */}
        <div className="flex md:hidden gap-3 overflow-x-auto scrollbar-hide px-4">
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
                className="w-28 h-28 rounded-xl object-cover shadow-card-dark transition-transform group-hover:scale-105 mb-2"
              />
              <p className="text-xs font-semibold truncate text-foreground">
                {album.title}
              </p>
              <p className="text-xs truncate text-muted-foreground">
                {album.artist}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Artists */}
      <section className="mb-6 xl:mb-8">
        <div className="flex items-center justify-between px-4 xl:px-8 mb-3">
          <h2 className="text-base md:text-lg lg:text-xl font-bold text-foreground">
            Artists
          </h2>
          <button
            type="button"
            className="text-xs font-semibold flex items-center gap-0.5 text-primary hover:opacity-80 transition-opacity"
          >
            See All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {/* Grid on md+, horizontal scroll on mobile */}
        <div className="hidden md:grid md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-4 px-4 xl:px-8">
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
              className="flex flex-col items-center gap-2 focus:outline-none group focus-visible:ring-2 focus-visible:ring-primary rounded-full"
            >
              <img
                src={artist.imageUrl}
                alt={artist.name}
                className="w-full aspect-square rounded-full object-cover shadow-md transition-transform group-hover:scale-105"
              />
              <p className="text-xs font-medium text-center leading-tight line-clamp-2 text-foreground">
                {artist.name}
              </p>
            </motion.button>
          ))}
        </div>
        <div className="flex md:hidden gap-4 overflow-x-auto scrollbar-hide px-4">
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
              <p className="text-xs font-medium text-center leading-tight line-clamp-2 text-foreground">
                {artist.name}
              </p>
              <p className="text-[10px] text-center text-muted-foreground">
                {formatFollowers(artist.followerCount)}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Bottom spacer */}
      <div className="h-28 md:h-10" />
    </div>
  );
}
