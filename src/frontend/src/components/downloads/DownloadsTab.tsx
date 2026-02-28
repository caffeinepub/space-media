import { useApp } from "@/AppContext";
import StatusPill from "@/components/shared/StatusPill";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockTracks, mockVideos } from "@/mockData";
import type { DownloadedItem } from "@/types";
import {
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Search,
  SortAsc,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import LicenseExpiredModal from "./LicenseExpiredModal";

type SortOption = "expiring" | "recent" | "size";
type FilterTab = "video" | "music";

function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(0)} MB`;
  return `${bytes} B`;
}

function getDaysRemaining(expiresAt: number): number {
  const diff = expiresAt - Date.now();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function DownloadsTab() {
  const {
    downloads,
    removeDownload,
    renewAllDownloads,
    isConnected,
    playVideo,
    playTrack,
  } = useApp();
  const [query, setQuery] = useState("");
  const [filterTab, setFilterTab] = useState<FilterTab>("video");
  const [sort, setSort] = useState<SortOption>("expiring");
  const [expiredItem, setExpiredItem] = useState<DownloadedItem | null>(null);

  const filtered = useMemo(() => {
    let items = downloads.filter((d) => d.mediaType === filterTab);

    // Search
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.artist.toLowerCase().includes(q) ||
          d.genre.toLowerCase().includes(q) ||
          d.album.toLowerCase().includes(q),
      );
    }

    // Sort
    switch (sort) {
      case "expiring":
        items = [...items].sort((a, b) => a.expiresAt - b.expiresAt);
        break;
      case "recent":
        items = [...items].sort((a, b) => b.downloadedAt - a.downloadedAt);
        break;
      case "size":
        items = [...items].sort((a, b) => b.sizeBytes - a.sizeBytes);
        break;
    }

    return items;
  }, [downloads, filterTab, query, sort]);

  const videoCount = downloads.filter((d) => d.mediaType === "video").length;
  const musicCount = downloads.filter((d) => d.mediaType === "music").length;

  function handleItemClick(item: DownloadedItem) {
    const now = Date.now();
    if (item.expiresAt < now) {
      setExpiredItem(item);
      return;
    }
    // Play the item
    if (item.mediaType === "video") {
      const video = mockVideos.find((v) => v.id === item.id);
      if (video) playVideo(video);
    } else {
      const track = mockTracks.find((t) => t.id === item.id);
      if (track) playTrack(track, mockTracks);
    }
  }

  function handleDelete(id: string, title: string) {
    removeDownload(id);
    toast.success(`"${title}" removed`);
  }

  function handleRenewAll() {
    if (!isConnected) return;
    renewAllDownloads();
    toast.success("All licenses renewed");
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold font-display text-foreground">
            Downloads
          </h1>
          <StatusPill />
        </div>
        {isConnected && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleRenewAll}
            className="gap-1.5 text-xs h-8"
          >
            <RefreshCw className="w-3 h-3" />
            Renew All
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative mx-4 mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search downloads..."
          className="w-full h-10 pl-9 pr-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Tabs + Sort */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex gap-1 bg-secondary rounded-xl p-1">
          <button
            type="button"
            onClick={() => setFilterTab("video")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              filterTab === "video"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground"
            }`}
          >
            Videos
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                filterTab === "video"
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {videoCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("music")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              filterTab === "music"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground"
            }`}
          >
            Music
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                filterTab === "music"
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {musicCount}
            </span>
          </button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs h-8 px-2"
            >
              <SortAsc className="w-3.5 h-3.5" />
              {sort === "expiring"
                ? "Expiring Soon"
                : sort === "recent"
                  ? "Recent"
                  : "Size"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSort("expiring")}>
              Expiring Soon
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("recent")}>
              Recently Downloaded
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort("size")}>
              File Size
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 pt-16 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-1">
                <Search className="w-6 h-6 text-muted-foreground opacity-50" />
              </div>
              <p className="text-sm text-muted-foreground">
                {query ? `No results for "${query}"` : "No downloads yet"}
              </p>
            </motion.div>
          ) : (
            filtered.map((item, i) => {
              const isExpired = item.expiresAt < Date.now();
              const daysLeft = getDaysRemaining(item.expiresAt);

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition-colors ${
                    isExpired
                      ? "bg-destructive/5 border border-destructive/20"
                      : "bg-card"
                  }`}
                >
                  {/* Artwork */}
                  <button
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className="relative shrink-0 focus:outline-none"
                  >
                    <img
                      src={item.artworkUrl}
                      alt={item.title}
                      className={`object-cover ${
                        item.mediaType === "video"
                          ? "w-10 h-14 rounded-md"
                          : "w-12 h-12 rounded-lg"
                      } ${isExpired ? "opacity-50" : ""}`}
                    />
                    {isExpired && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      </div>
                    )}
                  </button>

                  {/* Info */}
                  <button
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className="flex-1 min-w-0 text-left focus:outline-none"
                  >
                    <p className="text-sm font-semibold text-foreground truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.mediaType === "music" ? item.artist : item.genre}
                    </p>

                    {/* License status */}
                    {isExpired ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-destructive mt-1">
                        <AlertTriangle className="w-3 h-3" />
                        LICENSE EXPIRED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs mt-1">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        <span
                          className={`font-medium ${
                            daysLeft <= 7 ? "text-amber-400" : "text-green-400"
                          }`}
                        >
                          {daysLeft <= 0
                            ? "Expires today"
                            : `Expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`}
                        </span>
                      </span>
                    )}

                    {/* File size */}
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {formatBytes(item.sizeBytes)}
                    </p>
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.title)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                    aria-label={`Delete ${item.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
        <div className="h-24" />
      </div>

      {/* License expired modal */}
      <LicenseExpiredModal
        item={expiredItem}
        onClose={() => setExpiredItem(null)}
      />
    </div>
  );
}
