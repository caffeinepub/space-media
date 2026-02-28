import { useApp } from "@/AppContext";
import { formatDuration } from "@/mockData";
import {
  ChevronDown,
  Heart,
  MoreHorizontal,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import UpNextQueue from "./UpNextQueue";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const BG_IMAGES: Record<string, string> = {
  "blue-moon": "/assets/uploads/BLUE-MOON-L-1.jpg",
  "red-nebula": "/assets/generated/red-nebula-bg.dim_1080x1920.jpg",
};

interface MusicPlayerProps {
  onClose: () => void;
}

export default function MusicPlayer({ onClose }: MusicPlayerProps) {
  const {
    musicPlayer,
    pauseMusic,
    resumeMusic,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
    setMusicProgress,
    settings,
  } = useApp();

  const [liked, setLiked] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const { currentTrack, isPlaying, progress, shuffle, repeat, queue } =
    musicPlayer;

  if (!currentTrack) return null;

  const playerBg = settings.playerBg ?? "blue-moon";
  const progressPercent =
    currentTrack.duration > 0 ? (progress / currentTrack.duration) * 100 : 0;

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setMusicProgress(pct * currentTrack!.duration);
  }

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 280, damping: 32 }}
      className="fixed inset-0 z-40 overflow-hidden"
    >
      {/* ── Background Images (crossfade) ────────────────────── */}
      {Object.entries(BG_IMAGES).map(([id, src]) => (
        <motion.img
          key={id}
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ opacity: playerBg === id ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ zIndex: 0 }}
        />
      ))}

      {/* ── Gradient overlays ─────────────────────────────────── */}
      {/* Top vignette for chevron readability */}
      <div
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"
        style={{ zIndex: 1 }}
      />
      {/* Bottom vignette behind the glass card */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* ── Close button ──────────────────────────────────────── */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close player"
        className="absolute top-12 left-4 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors focus-visible:ring-2 focus-visible:ring-white"
      >
        <ChevronDown className="w-5 h-5" />
      </button>

      {/* ── Glassmorphism card ────────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 mx-4 mb-6 md:mx-auto md:max-w-lg rounded-[28px] p-5 md:p-7"
        style={{
          zIndex: 10,
          backdropFilter: "blur(28px) saturate(1.4)",
          WebkitBackdropFilter: "blur(28px) saturate(1.4)",
          background: "rgba(255,255,255,0.10)",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      >
        {/* ── Top row: heart / title / menu ──────────────── */}
        <div className="flex items-start gap-3 mb-5">
          {/* Heart */}
          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            aria-label={liked ? "Unlike" : "Like"}
            className="shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center rounded-full transition-all focus-visible:ring-2 focus-visible:ring-white"
          >
            <Heart
              className={`w-5 h-5 transition-all duration-200 ${liked ? "scale-110" : ""}`}
              style={{
                color: liked ? "#ff4f6b" : "rgba(255,255,255,0.75)",
                fill: liked ? "#ff4f6b" : "none",
              }}
            />
          </button>

          {/* Title + subtitle */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.p
                key={`title-${currentTrack.id}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="text-xl font-semibold text-white leading-tight truncate"
                style={{
                  fontFamily:
                    "-apple-system, 'SF Pro Display', system-ui, sans-serif",
                }}
              >
                {currentTrack.title}
              </motion.p>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={`artist-${currentTrack.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className="text-sm text-white/60 mt-0.5 truncate"
                style={{
                  fontFamily:
                    "-apple-system, 'SF Pro Text', system-ui, sans-serif",
                }}
              >
                {currentTrack.artist}
                {currentTrack.album ? ` · ${currentTrack.album}` : ""}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* More menu */}
          <button
            type="button"
            aria-label="More options"
            className="shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all focus-visible:ring-2 focus-visible:ring-white"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* ── Progress section ────────────────────────────── */}
        <div className="mb-4">
          {/* Thin progress bar */}
          <div
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercent}
            aria-label="Track progress"
            tabIndex={0}
            className="relative h-1 rounded-full bg-white/20 cursor-pointer group"
            onClick={handleSeek}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight")
                setMusicProgress(
                  Math.min(currentTrack.duration, progress + 10),
                );
              if (e.key === "ArrowLeft")
                setMusicProgress(Math.max(0, progress - 10));
            }}
          >
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
            {/* Draggable thumb indicator — appears on hover */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ left: `calc(${progressPercent}% - 6px)` }}
            />
          </div>
          {/* Time labels */}
          <div className="flex justify-between mt-1.5">
            <span
              className="text-xs text-white/50"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {formatTime(progress)}
            </span>
            <span
              className="text-xs text-white/50"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {formatDuration(currentTrack.duration)}
            </span>
          </div>
        </div>

        {/* ── Controls row ────────────────────────────────── */}
        <div className="flex items-center justify-between mt-1">
          {/* Shuffle */}
          <button
            type="button"
            onClick={toggleShuffle}
            aria-label="Shuffle"
            className="w-10 h-10 flex items-center justify-center rounded-full transition-all focus-visible:ring-2 focus-visible:ring-white"
          >
            <Shuffle
              className="w-5 h-5 transition-colors"
              style={{ color: shuffle ? "#fff" : "rgba(255,255,255,0.40)" }}
            />
          </button>

          {/* Previous */}
          <button
            type="button"
            onClick={prevTrack}
            aria-label="Previous track"
            className="w-11 h-11 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-all active:scale-90 focus-visible:ring-2 focus-visible:ring-white"
          >
            <SkipBack className="w-6 h-6 fill-white text-white" />
          </button>

          {/* Play / Pause — large center button */}
          <button
            type="button"
            onClick={isPlaying ? pauseMusic : resumeMusic}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 md:w-8 md:h-8 text-black fill-black" />
            ) : (
              <Play className="w-7 h-7 md:w-8 md:h-8 text-black fill-black ml-1" />
            )}
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={nextTrack}
            aria-label="Next track"
            className="w-11 h-11 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-all active:scale-90 focus-visible:ring-2 focus-visible:ring-white"
          >
            <SkipForward className="w-6 h-6 fill-white text-white" />
          </button>

          {/* Repeat */}
          <button
            type="button"
            onClick={toggleRepeat}
            aria-label={`Repeat: ${repeat}`}
            className="w-10 h-10 flex items-center justify-center rounded-full transition-all focus-visible:ring-2 focus-visible:ring-white"
          >
            {repeat === "one" ? (
              <Repeat1 className="w-5 h-5" style={{ color: "#fff" }} />
            ) : (
              <Repeat
                className="w-5 h-5 transition-colors"
                style={{
                  color: repeat === "all" ? "#fff" : "rgba(255,255,255,0.40)",
                }}
              />
            )}
          </button>
        </div>

        {/* ── Up Next Queue (collapsible) ──────────────────── */}
        {queue.length > 1 && (
          <div className="mt-4 border-t border-white/10 pt-3">
            <UpNextQueue
              queue={queue}
              currentTrackId={currentTrack.id}
              isOpen={showQueue}
              onToggle={() => setShowQueue((v) => !v)}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
