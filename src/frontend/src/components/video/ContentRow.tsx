import { useApp } from "@/AppContext";
import type { VideoContent } from "@/types";
import { motion } from "motion/react";

interface ContentRowProps {
  title: string;
  videos: VideoContent[];
  showProgress?: boolean;
  onSelect: (video: VideoContent) => void;
}

function formatProgress(seconds: number, runtime: string): number {
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
    <div className="mb-6 xl:mb-8">
      <h3 className="text-sm md:text-base lg:text-lg xl:text-xl font-bold text-foreground px-4 xl:px-8 mb-3 xl:mb-4 uppercase tracking-wider">
        {title}
      </h3>
      <div className="flex gap-3 xl:gap-4 overflow-x-auto scrollbar-hide px-4 xl:px-8 snap-x snap-mandatory pb-1">
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
              className="shrink-0 snap-start relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg
                w-[45%] sm:w-[30%] md:w-[22%] lg:w-[16%] xl:w-[13%] 2xl:w-[11%]"
            >
              <div
                className="relative rounded-lg overflow-hidden aspect-[2/3] w-full bg-muted
                group-hover:scale-105 transition-transform duration-200 group-focus-visible:scale-105
                xl:group-hover:ring-2 xl:group-hover:ring-primary/60 xl:group-hover:ring-offset-2 xl:group-hover:ring-offset-background"
              >
                <img
                  src={video.posterUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Downloaded badge */}
                {downloaded && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3 h-3 fill-white"
                      aria-hidden="true"
                    >
                      <title>Downloaded</title>
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
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

                {/* Audio languages badge */}
                {video.audioTracks && video.audioTracks.length > 1 && (
                  <div className="absolute top-1.5 left-1.5">
                    <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-black/70 text-white/90">
                      {video.audioTracks.length} LANG
                    </span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="w-10 h-10 xl:w-12 xl:h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 xl:w-6 xl:h-6 fill-black ml-0.5"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <title>Play</title>
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                </div>
              </div>

              <p className="mt-1.5 text-xs md:text-sm xl:text-sm text-muted-foreground font-medium truncate text-left leading-tight">
                {video.title}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
