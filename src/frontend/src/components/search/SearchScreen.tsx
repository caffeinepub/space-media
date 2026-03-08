import { useApp } from "@/AppContext";
import { Badge } from "@/components/ui/badge";
import { mockVideos } from "@/mockData";
import type { VideoContent } from "@/types";
import { Download, Search, Wifi, WifiOff, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  artworkUrl: string;
  isDownloaded: boolean;
  onPlay: () => void;
}

interface SearchScreenProps {
  initialTab?: "video";
}

export default function SearchScreen({
  initialTab: _initialTab = "video",
}: SearchScreenProps) {
  const {
    setShowSearch,
    downloads,
    setSelectedVideo,
    setActiveTab,
    isConnected,
  } = useApp();
  const [query, setQuery] = useState("");
  const [downloadedOnly, setDownloadedOnly] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // When offline, force downloadedOnly to true
  const effectiveDownloadedOnly = !isConnected || downloadedOnly;

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

  const results = useMemo<SearchResult[]>(() => {
    const q = query.toLowerCase().trim();
    let videos = mockVideos;
    if (effectiveDownloadedOnly) {
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
  }, [
    query,
    effectiveDownloadedOnly,
    downloadedVideoIds,
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
      {/* Offline banner */}
      {!isConnected && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border-b border-red-500/20">
          <WifiOff className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <p className="text-xs font-medium text-red-400">
            Offline — showing downloaded content only
          </p>
        </div>
      )}

      {/* Search bar */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isConnected ? "Search videos..." : "Search downloaded videos..."
            }
            data-ocid="search.search_input"
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
          data-ocid="search.cancel.button"
          className="text-sm font-semibold text-primary"
        >
          Cancel
        </button>
      </div>

      {/* Filter row */}
      <div className="flex gap-2 px-4 mb-3">
        <button
          type="button"
          onClick={() => {
            if (isConnected) setDownloadedOnly((v) => !v);
          }}
          disabled={!isConnected}
          data-ocid="search.downloaded_only.toggle"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
            effectiveDownloadedOnly
              ? "bg-primary/20 text-primary border-primary/30"
              : "bg-secondary text-muted-foreground border-border"
          } ${!isConnected ? "opacity-80 cursor-default" : ""}`}
        >
          <Download className="w-3 h-3" />
          Downloaded Only
          {!isConnected && (
            <span className="ml-0.5 text-[10px] opacity-70">(forced)</span>
          )}
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
              data-ocid="search.empty_state"
            >
              <Search className="w-10 h-10 text-muted-foreground opacity-30" />
              <p className="text-sm text-muted-foreground">
                {query
                  ? `No results for "${query}"`
                  : effectiveDownloadedOnly
                    ? !isConnected
                      ? "No downloaded videos available offline"
                      : "No downloaded videos yet"
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
                  data-ocid={`search.item.${i + 1}`}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors focus:outline-none"
                >
                  <img
                    src={result.artworkUrl}
                    alt={result.title}
                    className="rounded-md object-cover shrink-0"
                    style={{
                      width: 48,
                      height: 72,
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
