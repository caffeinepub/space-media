import { useApp } from "@/AppContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Subtitles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0)
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function parseDuration(runtime: string): number {
  const match = runtime.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/);
  const hours = Number.parseInt(match?.[1] ?? "0");
  const mins = Number.parseInt(match?.[2] ?? "0");
  return (hours * 60 + mins) * 60;
}

function VideoPlayerInner() {
  const { videoPlayer, closeVideoPlayer, setVideoProgress, setSubtitleLang } =
    useApp();
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasShownResume, setHasShownResume] = useState(false);
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const video = videoPlayer.currentVideo!;
  const totalDuration = parseDuration(video.runtime);
  const progress = videoPlayer.progress;
  const progressPercent =
    totalDuration > 0 ? (progress / totalDuration) * 100 : 0;

  // Show resume toast
  useEffect(() => {
    if (!hasShownResume && video.resumePosition && video.resumePosition > 60) {
      toast.info(`Resuming from ${formatTime(video.resumePosition)}`);
      setHasShownResume(true);
    }
  }, [video, hasShownResume]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls) {
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
      controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
    return () => {
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    };
  }, [showControls]);

  // Simulate playback progress
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setVideoProgress(progress + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, progress, setVideoProgress]);

  function handleTap() {
    setShowControls((v) => !v);
  }

  function handleSeek(val: number[]) {
    const newProgress = (val[0] / 100) * totalDuration;
    setVideoProgress(newProgress);
  }

  const subtitleOptions = ["Off", ...video.subtitles];

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={handleTap}
      onKeyDown={() => {}}
      role="presentation"
    >
      {/* Simulated video (dark bg with poster) */}
      <img
        src={video.backdropUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />

      {/* Player chrome overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex flex-col"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={() => {}}
            role="presentation"
          >
            {/* Top bar */}
            <div
              className="flex items-center justify-between px-4 pt-4 pb-2"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
              }}
            >
              <button
                type="button"
                onClick={closeVideoPlayer}
                className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <p className="text-white text-sm font-semibold">
                  {video.title}
                </p>
                <p className="text-white/60 text-xs">{video.genre}</p>
              </div>

              {/* Subtitles selector */}
              <div
                onClick={(e) => e.stopPropagation()}
                onKeyDown={() => {}}
                role="presentation"
              >
                <Select
                  value={videoPlayer.subtitleLang}
                  onValueChange={setSubtitleLang}
                >
                  <SelectTrigger className="w-10 h-9 border-0 bg-black/50 text-white p-0 justify-center [&>svg]:hidden">
                    <Subtitles className="w-5 h-5" />
                  </SelectTrigger>
                  <SelectContent>
                    {subtitleOptions.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Center play/pause */}
            <div className="flex-1 flex items-center justify-center gap-12">
              <button
                type="button"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors relative"
                onClick={() => setVideoProgress(Math.max(0, progress - 15))}
                aria-label="Rewind 15 seconds"
              >
                <ChevronLeft className="w-6 h-6" />
                <span className="text-[8px] absolute bottom-1 text-white/70">
                  15
                </span>
              </button>

              <button
                type="button"
                className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                onClick={() => setIsPlaying((v) => !v)}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 text-black fill-black" />
                ) : (
                  <Play className="w-7 h-7 text-black fill-black ml-1" />
                )}
              </button>

              <button
                type="button"
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors relative"
                onClick={() =>
                  setVideoProgress(Math.min(totalDuration - 1, progress + 15))
                }
                aria-label="Fast forward 15 seconds"
              >
                <ChevronRight className="w-6 h-6" />
                <span className="text-[8px] absolute bottom-1 text-white/70">
                  15
                </span>
              </button>
            </div>

            {/* Bottom controls */}
            <div
              className="px-4 pb-8 pt-2 space-y-2"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
              }}
            >
              {/* Subtitle display */}
              {videoPlayer.subtitleLang !== "Off" && (
                <div className="text-center mb-2">
                  <span className="text-white bg-black/60 px-3 py-1 rounded text-sm">
                    ♪ {videoPlayer.subtitleLang} subtitles active ♪
                  </span>
                </div>
              )}

              {/* Seek bar */}
              <div
                onClick={(e) => e.stopPropagation()}
                onKeyDown={() => {}}
                role="presentation"
                className="px-1"
              >
                <Slider
                  value={[progressPercent]}
                  onValueChange={handleSeek}
                  min={0}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Time labels */}
              <div className="flex justify-between text-xs text-white/70 px-1">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(totalDuration)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always-visible thin progress at very bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
        <div
          className="h-full transition-all"
          style={{
            width: `${progressPercent}%`,
            background:
              "linear-gradient(90deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
          }}
        />
      </div>
    </div>
  );
}

export default function VideoPlayer() {
  const { videoPlayer } = useApp();
  if (!videoPlayer.currentVideo) return null;
  return <VideoPlayerInner />;
}
