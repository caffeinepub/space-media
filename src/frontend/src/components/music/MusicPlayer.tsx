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
      className="fixed inset-0 z-40 flex flex-col"
      style={{ backgroundColor: "oklch(0.97 0 0)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{
            backgroundColor: "oklch(0.90 0.01 270)",
            color: "oklch(0.30 0.01 270)",
          }}
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
          className="w-8 h-8 rounded-full flex items-center justify-center"
        >
          <Heart
            className="w-5 h-5 transition-all"
            style={{
              color: liked ? "oklch(0.62 0.25 25)" : "oklch(0.55 0.01 270)",
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
          <div
            className="w-56 h-56 rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.25)" }}
          >
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
              className="text-xl font-bold font-display mb-1"
              style={{ color: "oklch(0.10 0.01 270)" }}
            >
              {currentTrack.title}
            </motion.h2>
          </AnimatePresence>
          <p
            className="text-sm font-medium"
            style={{ color: "oklch(0.35 0.01 270)" }}
          >
            {currentTrack.artist}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "oklch(0.60 0.01 270)" }}
          >
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
          <div
            className="flex justify-between text-xs mt-1"
            style={{ color: "oklch(0.55 0.01 270)" }}
          >
            <span>{formatTime(progress)}</span>
            <span>{formatDuration(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Main controls */}
        <div className="flex items-center justify-between mb-6 px-2">
          <button
            type="button"
            onClick={toggleShuffle}
            className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
            style={{
              color: shuffle
                ? "oklch(var(--theme-accent))"
                : "oklch(0.50 0.01 270)",
            }}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={prevTrack}
            className="w-12 h-12 flex items-center justify-center rounded-full transition-colors hover:bg-black/5"
            style={{ color: "oklch(0.15 0.01 270)" }}
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>

          <button
            type="button"
            onClick={isPlaying ? pauseMusic : resumeMusic}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
              color: "white",
            }}
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
            className="w-12 h-12 flex items-center justify-center rounded-full transition-colors hover:bg-black/5"
            style={{ color: "oklch(0.15 0.01 270)" }}
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>

          <button
            type="button"
            onClick={toggleRepeat}
            className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
            style={{
              color:
                repeat !== "none"
                  ? "oklch(var(--theme-accent))"
                  : "oklch(0.50 0.01 270)",
            }}
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
          <Volume2
            className="w-4 h-4 shrink-0"
            style={{ color: "oklch(0.55 0.01 270)" }}
          />
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
        <div
          className="border-t pt-1"
          style={{ borderColor: "oklch(0.88 0.01 270)" }}
        >
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
  );
}
