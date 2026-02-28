import { useApp } from "@/AppContext";
import { Slider } from "@/components/ui/slider";
import { formatDuration } from "@/mockData";
import {
  ChevronDown,
  Heart,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import UpNextQueue from "./UpNextQueue";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

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
    setVolume,
  } = useApp();
  const [liked, setLiked] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const { currentTrack, isPlaying, progress, shuffle, repeat, volume, queue } =
    musicPlayer;

  if (!currentTrack) return null;

  const progressPercent =
    currentTrack.duration > 0 ? (progress / currentTrack.duration) * 100 : 0;

  function handleSeek(val: number[]) {
    const newProgress = (val[0] / 100) * currentTrack!.duration;
    setMusicProgress(newProgress);
  }

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 35 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      {/* Card — full screen mobile, centered card on md+ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        className="bg-card border border-border shadow-card-lg
          w-full h-full
          md:w-[480px] md:h-auto md:max-h-[90vh] md:rounded-3xl md:overflow-hidden
          flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-secondary text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Close player"
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          <div className="text-center">
            <p
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "oklch(var(--theme-accent))" }}
            >
              Now Playing
            </p>
          </div>

          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            className="w-8 h-8 rounded-full flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={liked ? "Unlike" : "Like"}
          >
            <Heart
              className={`w-5 h-5 transition-all ${liked ? "fill-current" : ""}`}
              style={{
                color: liked
                  ? "oklch(0.62 0.25 25)"
                  : "oklch(var(--muted-foreground))",
                fill: liked ? "oklch(0.62 0.25 25)" : "none",
              }}
            />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-6">
          {/* Album art */}
          <motion.div
            key={currentTrack.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex justify-center my-6"
          >
            <div className="w-56 h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-card-lg">
              <img
                src={currentTrack.albumArt}
                alt={currentTrack.album}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Track info */}
          <div className="text-center mb-6">
            <AnimatePresence mode="wait">
              <motion.h2
                key={`title-${currentTrack.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-xl font-bold font-display mb-1 text-foreground"
              >
                {currentTrack.title}
              </motion.h2>
            </AnimatePresence>
            <p className="text-sm font-medium text-muted-foreground">
              {currentTrack.artist}
            </p>
            <p className="text-xs mt-0.5 text-muted-foreground/70">
              {currentTrack.album}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-2">
            <Slider
              value={[progressPercent]}
              onValueChange={handleSeek}
              min={0}
              max={100}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs mt-1 text-muted-foreground">
              <span>{formatTime(progress)}</span>
              <span>{formatDuration(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Main controls */}
          <div className="flex items-center justify-between mb-6 px-2">
            <button
              type="button"
              onClick={toggleShuffle}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary"
              style={{
                color: shuffle
                  ? "oklch(var(--theme-accent))"
                  : "oklch(var(--muted-foreground))",
              }}
              aria-label="Shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={prevTrack}
              className="w-12 h-12 flex items-center justify-center rounded-full transition-colors hover:bg-secondary text-foreground focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Previous track"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>

            <button
              type="button"
              onClick={isPlaying ? pauseMusic : resumeMusic}
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-glow transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
                color: "white",
              }}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-white" />
              ) : (
                <Play className="w-7 h-7 fill-white ml-1" />
              )}
            </button>

            <button
              type="button"
              onClick={nextTrack}
              className="w-12 h-12 flex items-center justify-center rounded-full transition-colors hover:bg-secondary text-foreground focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Next track"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>

            <button
              type="button"
              onClick={toggleRepeat}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-primary"
              style={{
                color:
                  repeat !== "none"
                    ? "oklch(var(--theme-accent))"
                    : "oklch(var(--muted-foreground))",
              }}
              aria-label={`Repeat: ${repeat}`}
            >
              {repeat === "one" ? (
                <Repeat1 className="w-5 h-5" />
              ) : (
                <Repeat className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3 mb-6 px-2">
            <Volume2 className="w-4 h-4 shrink-0 text-muted-foreground" />
            <Slider
              value={[volume * 100]}
              onValueChange={(val) => setVolume(val[0] / 100)}
              min={0}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>

          {/* Up Next Queue */}
          <div className="border-t border-border pt-1">
            <UpNextQueue
              queue={queue}
              currentTrackId={currentTrack.id}
              isOpen={showQueue}
              onToggle={() => setShowQueue((v) => !v)}
            />
          </div>

          <div className="h-8" />
        </div>
      </motion.div>
    </motion.div>
  );
}
