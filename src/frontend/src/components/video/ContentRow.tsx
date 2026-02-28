import { useApp } from "@/AppContext";
import type { VideoContent } from "@/types";
import { CheckCircle, Download } from "lucide-react";
import { motion } from "motion/react";

interface ContentRowProps {
  title: string;
  videos: VideoContent[];
  showProgress?: boolean;
  onSelect: (video: VideoContent) => void;
}

function formatProgress(seconds: number, runtime: string): number {
  // Parse runtime like "1h 45m" to seconds
  const match = runtime.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/);
  const hours = Number.parseInt(match?.[1] ?? "0");
  const mins = Number.parseInt(match?.[2] ?? "0");
  const total = (hours * 60 + mins) * 60;
  if (!total) return 0;
  return Math.min((seconds / total) * 100, 100);
}

export default function ContentRow({
  title,
  videos,
  showProgress,
  onSelect,
}: ContentRowProps) {
  const { isDownloaded } = useApp();

  if (!videos.length) return null;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-foreground px-4 mb-3 uppercase tracking-wider">
        {title}
      </h3>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 snap-x-mandatory pb-1">
        {videos.map((video, i) => {
          const downloaded = isDownloaded(video.id);
          const progress =
            showProgress && video.resumePosition
              ? formatProgress(video.resumePosition, video.runtime)
              : 0;

          return (
            <motion.button
              key={video.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelect(video)}
              className="shrink-0 w-[120px] snap-start relative group focus:outline-none"
            >
              <div className="relative rounded-lg overflow-hidden poster-ratio w-full bg-muted">
                <img
                  src={video.posterUrl}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Downloaded badge */}
                {downloaded && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}

                {/* Progress bar */}
                {showProgress && progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${progress}%`,
                        background:
                          "linear-gradient(90deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
                      }}
                    />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 fill-black ml-0.5"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <title>Play</title>
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                </div>
              </div>

              <p className="mt-1.5 text-xs text-muted-foreground font-medium truncate text-left leading-tight">
                {video.title}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
