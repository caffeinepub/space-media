import { useApp } from "@/AppContext";
import { Badge } from "@/components/ui/badge";
import { mockTracks, mockVideos } from "@/mockData";
import type { MusicTrack, VideoContent } from "@/types";
import { Download, Search, Wifi, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

type Tab = "video" | "music";

interface SearchResult {
  id: string;
  type: Tab;
  title: string;
  subtitle: string;
  artworkUrl: string;
  isDownloaded: boolean;
  onPlay: () => void;
}

interface SearchScreenProps {
  initialTab?: Tab;
}

export default function SearchScreen({
  initialTab = "video",
}: SearchScreenProps) {
  const {
    setShowSearch,
    downloads,
    playTrack,
    setSelectedVideo,
    setActiveTab,
  } = useApp();
  const [query, setQuery] = useState("");
  const [activeTab, setTabActive] = useState<Tab>(initialTab);
  const [downloadedOnly, setDownloadedOnly] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const downloadedVideoIds = useMemo(
    () =>
      new Set(
        downloads.filter((d) => d.mediaType === "video").map((d) => d.id),
      ),
    [downloads],
  );

  const downloadedMusicIds = useMemo(
    () =>
      new Set(
        downloads.filter((d) => d.mediaType === "music").map((d) => d.id),
      ),
    [downloads],
  );

  const results = useMemo<SearchResult[]>(() => {
    const q = query.toLowerCase().trim();

    if (activeTab === "video") {
      let videos = mockVideos;
      if (downloadedOnly) {
        videos = videos.filter((v) => downloadedVideoIds.has(v.id));
      }
      if (q) {
        videos = videos.filter(
          (v) =>
            v.title.toLowerCase().includes(q) ||
            v.genre.toLowerCase().includes(q) ||
            v.language.toLowerCase().includes(q) ||
            (v.tags ?? []).some((t) => t.toLowerCase().includes(q)),
        );
      }
      return videos.map((v: VideoContent) => ({
        id: v.id,
        type: "video" as Tab,
        title: v.title,
        subtitle: `${v.genre} · ${v.runtime}`,
        artworkUrl: v.posterUrl,
        isDownloaded: downloadedVideoIds.has(v.id),
        onPlay: () => {
          setSelectedVideo(v);
          setActiveTab("video");
          setShowSearch(false);
        },
      }));
    }
    // Music
    let tracks = mockTracks;
    if (downloadedOnly) {
      tracks = tracks.filter((t) => downloadedMusicIds.has(t.id));
    }
    if (q) {
      tracks = tracks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.album.toLowerCase().includes(q) ||
          t.genre.toLowerCase().includes(q),
      );
    }
    return tracks.map((t: MusicTrack) => ({
      id: t.id,
      type: "music" as Tab,
      title: t.title,
      subtitle: `${t.artist} · ${t.album}`,
      artworkUrl: t.albumArt,
      isDownloaded: downloadedMusicIds.has(t.id),
      onPlay: () => {
        playTrack(t, mockTracks);
        setShowSearch(false);
      },
    }));
  }, [
    query,
    activeTab,
    downloadedOnly,
    downloadedVideoIds,
    downloadedMusicIds,
    playTrack,
    setShowSearch,
    setSelectedVideo,
    setActiveTab,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-40 flex flex-col bg-background"
    >
      {/* Search bar */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos, music..."
            className="w-full h-11 pl-9 pr-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowSearch(false)}
          className="text-sm font-semibold text-primary"
        >
          Cancel
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 px-4 mb-3">
        {(["video", "music"] as Tab[]).map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setTabActive(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all ${
              activeTab === tab
                ? "text-white"
                : "text-muted-foreground bg-secondary"
            }`}
            style={
              activeTab === tab
                ? {
                    background:
                      "linear-gradient(90deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
                  }
                : undefined
            }
          >
            {tab === "video" ? "Videos" : "Music"}
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex gap-2 px-4 mb-3">
        <button
          type="button"
          onClick={() => setDownloadedOnly((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
            downloadedOnly
              ? "bg-primary/20 text-primary border-primary/30"
              : "bg-secondary text-muted-foreground border-border"
          }`}
        >
          <Download className="w-3 h-3" />
          Downloaded Only
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4">
        <AnimatePresence mode="wait">
          {results.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 pt-16 text-center"
            >
              <Search className="w-10 h-10 text-muted-foreground opacity-30" />
              <p className="text-sm text-muted-foreground">
                {query
                  ? `No results for "${query}"`
                  : downloadedOnly
                    ? "No downloaded content yet"
                    : "Start typing to search"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-1"
            >
              <p className="text-xs text-muted-foreground mb-2">
                {results.length} result{results.length !== 1 ? "s" : ""}
              </p>
              {results.map((result, i) => (
                <motion.button
                  key={result.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={result.onPlay}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors focus:outline-none"
                >
                  <img
                    src={result.artworkUrl}
                    alt={result.title}
                    className={`w-12 h-12 object-cover shrink-0 ${
                      result.type === "music" ? "rounded-lg" : "rounded-md"
                    }`}
                    style={{
                      aspectRatio: result.type === "video" ? "2/3" : "1/1",
                      width: 48,
                      height: result.type === "video" ? 72 : 48,
                    }}
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {result.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {result.subtitle}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {result.isDownloaded ? (
                      <Badge className="text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary border-0">
                        <Download className="w-2.5 h-2.5 mr-1" />
                        Downloaded
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0.5 text-muted-foreground"
                      >
                        <Wifi className="w-2.5 h-2.5 mr-1" />
                        Stream
                      </Badge>
                    )}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="h-8" />
      </div>
    </motion.div>
  );
}
