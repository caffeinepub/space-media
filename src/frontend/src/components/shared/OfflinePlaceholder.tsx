import { useApp } from "@/AppContext";
import { mockVideos } from "@/mockData";
import type { DownloadedItem } from "@/types";
import {
  AlertTriangle,
  CheckCircle,
  Play,
  Search,
  WifiOff,
} from "lucide-react";
import { motion } from "motion/react";
import StatusPill from "./StatusPill";

interface OfflinePlaceholderProps {
  context?: "video";
}

function getDaysRemaining(expiresAt: number): number {
  return Math.floor((expiresAt - Date.now()) / (1000 * 60 * 60 * 24));
}

function LicenseBadge({ item }: { item: DownloadedItem }) {
  const isExpired = item.expiresAt < Date.now();
  const daysLeft = getDaysRemaining(item.expiresAt);

  if (isExpired) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-destructive">
        <AlertTriangle className="w-2.5 h-2.5" />
        EXPIRED
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-medium ${
        daysLeft <= 7 ? "text-amber-400" : "text-green-400"
      }`}
    >
      <CheckCircle className="w-2.5 h-2.5" />
      {daysLeft <= 0 ? "Today" : `${daysLeft}d left`}
    </span>
  );
}

export default function OfflinePlaceholder({
  context: _context = "video",
}: OfflinePlaceholderProps) {
  const { downloads, setShowSearch, setSearchInitialTab, playVideo } = useApp();

  const videoDownloads = downloads.filter((d) => d.mediaType === "video");

  function handleSearchClick() {
    setSearchInitialTab("video");
    setShowSearch(true);
  }

  function handleItemClick(item: DownloadedItem) {
    const isExpired = item.expiresAt < Date.now();
    if (isExpired) return;
    const video = mockVideos.find((v) => v.id === item.id);
    if (video) playVideo(video);
  }

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3 xl:px-8 xl:pt-6">
        <h1 className="text-xl xl:text-2xl font-bold font-display text-foreground">
          Video
        </h1>
        <StatusPill />
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-28">
        {/* ── No Internet Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5"
          style={{
            background:
              "linear-gradient(135deg, oklch(var(--card) / 0.65), oklch(var(--card) / 0.35))",
            border: "1px solid oklch(var(--border) / 0.4)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          {/* Icon + heading */}
          <div className="flex items-start gap-4">
            <div
              className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: "oklch(var(--destructive) / 0.15)",
                border: "1px solid oklch(var(--destructive) / 0.3)",
              }}
            >
              <WifiOff className="w-6 h-6 text-destructive" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold font-display text-foreground leading-tight">
                No Internet Connection
              </h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Content is loaded from the server. Only downloaded videos are
                available offline.
              </p>
            </div>
          </div>

          {/* Search bar button */}
          <button
            type="button"
            onClick={handleSearchClick}
            data-ocid="offline.search.button"
            className="mt-4 w-full flex items-center gap-2.5 px-4 h-11 rounded-xl text-sm text-muted-foreground transition-opacity hover:opacity-80 active:opacity-60"
            style={{
              background: "oklch(var(--secondary) / 0.7)",
              border: "1px solid oklch(var(--border) / 0.4)",
            }}
          >
            <Search className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            <span className="flex-1 text-left">Search downloaded videos…</span>
          </button>
        </motion.div>

        {/* ── Available Offline Divider ── */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex-1 h-px"
            style={{ background: "oklch(var(--border) / 0.4)" }}
          />
          <span
            className="text-[10px] font-semibold tracking-widest uppercase"
            style={{ color: "oklch(var(--muted-foreground) / 0.7)" }}
          >
            Available Offline
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "oklch(var(--border) / 0.4)" }}
          />
        </div>

        {/* ── Downloaded Videos ── */}
        {videoDownloads.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col items-center gap-3 py-12 text-center"
            data-ocid="offline.empty_state"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "oklch(var(--secondary) / 0.6)",
              }}
            >
              <Play
                className="w-6 h-6 text-muted-foreground opacity-50"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              No downloaded videos yet
            </p>
            <p className="text-xs text-muted-foreground opacity-60 max-w-48">
              Connect to the server to browse and download videos for offline
              use.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3"
          >
            {videoDownloads.map((item, i) => {
              const isExpired = item.expiresAt < Date.now();
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.08 + i * 0.04 }}
                  onClick={() => handleItemClick(item)}
                  disabled={isExpired}
                  data-ocid={`offline.item.${i + 1}`}
                  className={`relative flex flex-col gap-1.5 text-left group focus:outline-none ${
                    isExpired ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {/* Poster */}
                  <div className="relative overflow-hidden rounded-lg aspect-[2/3]">
                    <img
                      src={item.artworkUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Play overlay */}
                    {!isExpired && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    )}
                    {/* Expired overlay */}
                    {isExpired && (
                      <div className="absolute inset-0 flex items-end justify-center pb-2">
                        <span className="text-[9px] font-bold text-destructive bg-black/60 px-1.5 py-0.5 rounded">
                          EXPIRED
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Title */}
                  <p className="text-[11px] font-semibold text-foreground truncate leading-tight px-0.5">
                    {item.title}
                  </p>
                  {/* License */}
                  <div className="px-0.5">
                    <LicenseBadge item={item} />
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
