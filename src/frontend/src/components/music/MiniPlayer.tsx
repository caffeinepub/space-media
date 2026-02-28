import { useApp } from "@/AppContext";
import { Pause, Play, SkipForward } from "lucide-react";
import { motion } from "motion/react";

interface MiniPlayerProps {
  onExpand: () => void;
}

export default function MiniPlayer({ onExpand }: MiniPlayerProps) {
  const { musicPlayer, pauseMusic, resumeMusic, nextTrack } = useApp();
  const { currentTrack, isPlaying, progress } = musicPlayer;

  if (!currentTrack) return null;

  const progressPercent =
    currentTrack.duration > 0 ? (progress / currentTrack.duration) * 100 : 0;

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 60, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 35 }}
      className="relative overflow-hidden"
      style={{
        backgroundColor: "oklch(0.14 0.03 290)",
        borderTop: "1px solid oklch(0.22 0.03 290)",
      }}
    >
      {/* Progress indicator */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10">
        <div
          className="h-full transition-all duration-1000"
          style={{
            width: `${progressPercent}%`,
            background:
              "linear-gradient(90deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
          }}
        />
      </div>

      <button
        type="button"
        onClick={onExpand}
        className="w-full flex items-center gap-3 px-4 py-3 focus:outline-none"
      >
        {/* Album art */}
        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-md">
          <img
            src={currentTrack.albumArt}
            alt={currentTrack.album}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Track info */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold text-foreground truncate">
            {currentTrack.title}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {currentTrack.artist}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              isPlaying ? pauseMusic() : resumeMusic();
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-foreground"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextTrack();
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-foreground"
            aria-label="Next track"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>
        </div>
      </button>
    </motion.div>
  );
}
