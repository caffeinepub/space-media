import { useApp } from "@/AppContext";
import { Button } from "@/components/ui/button";
import type { VideoContent } from "@/types";
import { Info, Play } from "lucide-react";
import { motion } from "motion/react";

interface HeroBannerProps {
  video: VideoContent;
  onMoreInfo: (video: VideoContent) => void;
}

export default function HeroBanner({ video, onMoreInfo }: HeroBannerProps) {
  const { playVideo } = useApp();

  return (
    <div
      className="relative w-full"
      style={{ height: "58vw", minHeight: 220, maxHeight: 320 }}
    >
      {/* Backdrop image */}
      <img
        src={video.backdropUrl}
        alt={video.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 10%, oklch(var(--background) / 0.3) 50%, oklch(var(--background)) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, oklch(var(--background) / 0.8), transparent 60%)",
        }}
      />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Genre badge */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
                color: "white",
              }}
            >
              Featured
            </span>
            <span className="text-xs text-white/70">{video.genre}</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white font-display leading-tight mb-1">
            {video.title}
          </h2>

          {/* Meta */}
          <div className="flex items-center gap-2 text-xs text-white/60 mb-3">
            <span>{video.year}</span>
            <span>·</span>
            <span>{video.rating}</span>
            <span>·</span>
            <span>{video.runtime}</span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => playVideo(video)}
              className="flex-1 h-9 font-semibold text-sm gap-1.5"
              style={{
                background: "rgba(255,255,255,0.95)",
                color: "#0a0a0a",
                border: "none",
              }}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Play
            </Button>
            <Button
              size="sm"
              onClick={() => onMoreInfo(video)}
              variant="outline"
              className="flex-1 h-9 font-semibold text-sm gap-1.5 bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/20"
            >
              <Info className="w-3.5 h-3.5" />
              More Info
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
