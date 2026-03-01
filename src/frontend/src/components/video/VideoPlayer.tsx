import { useApp } from "@/AppContext";
import { Slider } from "@/components/ui/slider";
import { Check, ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
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

// ─── Language Panel ──────────────────────────────────────────────────────────

interface LangPanelProps {
  tab: "audio" | "subtitles";
  onTabChange: (tab: "audio" | "subtitles") => void;
  audioTracks: Array<{
    id: string;
    language: string;
    langCode: string;
    audioLabel?: string;
    isDefault?: boolean;
  }>;
  subtitleOptions: string[];
  currentAudioLang: string;
  currentSubtitleLang: string;
  onSelectAudio: (langCode: string) => void;
  onSelectSubtitle: (lang: string) => void;
  onClose: () => void;
}

function LangPanel({
  tab,
  onTabChange,
  audioTracks,
  subtitleOptions,
  currentAudioLang,
  currentSubtitleLang,
  onSelectAudio,
  onSelectSubtitle,
  onClose,
}: LangPanelProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      onKeyDown={() => {}}
      role="presentation"
    >
      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Panel card */}
      <motion.div
        className="relative w-full max-w-lg mx-auto bg-[#1a1a1a] rounded-t-[28px] overflow-hidden shadow-2xl"
        style={{ maxHeight: "75vh" }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={() => {}}
        role="presentation"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <h2 className="text-white text-base font-semibold tracking-wide">
            Audio &amp; Subtitles
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex mx-5 mb-1 bg-white/5 rounded-xl p-1 gap-1">
          <button
            type="button"
            onClick={() => onTabChange("audio")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "audio"
                ? "bg-white text-black shadow"
                : "text-white/60 hover:text-white"
            }`}
          >
            Audio
          </button>
          <button
            type="button"
            onClick={() => onTabChange("subtitles")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === "subtitles"
                ? "bg-white text-black shadow"
                : "text-white/60 hover:text-white"
            }`}
          >
            Subtitles
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto pb-8" style={{ maxHeight: "52vh" }}>
          {tab === "audio" && (
            <ul className="px-3 pt-1">
              {audioTracks.length === 0 ? (
                <li className="px-4 py-6 text-center text-white/40 text-sm">
                  No audio tracks available
                </li>
              ) : (
                audioTracks.map((track) => {
                  const isActive = track.langCode === currentAudioLang;
                  return (
                    <li key={track.id}>
                      <button
                        type="button"
                        onClick={() => onSelectAudio(track.langCode)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl mb-0.5 transition-all text-left ${
                          isActive
                            ? "bg-white/15 border border-white/20"
                            : "hover:bg-white/8"
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-semibold truncate ${isActive ? "text-white" : "text-white/90"}`}
                          >
                            {track.language}
                            {track.isDefault ? (
                              <span className="ml-2 text-[10px] font-normal text-white/40 uppercase tracking-wider">
                                Default
                              </span>
                            ) : null}
                          </p>
                          {track.audioLabel && (
                            <p className="text-xs text-white/40 mt-0.5">
                              {track.audioLabel}
                            </p>
                          )}
                        </div>
                        {isActive && (
                          <Check className="w-4 h-4 text-white ml-3 flex-shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          )}

          {tab === "subtitles" && (
            <ul className="px-3 pt-1">
              {subtitleOptions.map((lang) => {
                const isActive = lang === currentSubtitleLang;
                return (
                  <li key={lang}>
                    <button
                      type="button"
                      onClick={() => onSelectSubtitle(lang)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl mb-0.5 transition-all text-left ${
                        isActive
                          ? "bg-white/15 border border-white/20"
                          : "hover:bg-white/8"
                      }`}
                    >
                      <p
                        className={`text-sm font-medium ${
                          lang === "Off"
                            ? isActive
                              ? "text-white"
                              : "text-white/60"
                            : isActive
                              ? "text-white font-semibold"
                              : "text-white/90"
                        }`}
                      >
                        {lang === "Off" ? "Off" : lang}
                      </p>
                      {isActive && (
                        <Check className="w-4 h-4 text-white ml-3 flex-shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Player Inner ─────────────────────────────────────────────────────────────

function VideoPlayerInner() {
  const {
    videoPlayer,
    closeVideoPlayer,
    setVideoProgress,
    setSubtitleLang,
    setAudioLang,
  } = useApp();
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasShownResume, setHasShownResume] = useState(false);
  const [showLangPanel, setShowLangPanel] = useState(false);
  const [langPanelTab, setLangPanelTab] = useState<"audio" | "subtitles">(
    "audio",
  );
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const video = videoPlayer.currentVideo!;
  const totalDuration = parseDuration(video.runtime);
  const progress = videoPlayer.progress;
  const progressPercent =
    totalDuration > 0 ? (progress / totalDuration) * 100 : 0;

  const audioTracks = video.audioTracks ?? [];
  const currentAudioLang = videoPlayer.audioLang;
  const subtitleOptions = ["Off", ...video.subtitles];

  // Derive the display name of the current audio track
  const currentAudioTrack = audioTracks.find(
    (t) => t.langCode === currentAudioLang,
  );
  const audioDisplayName = currentAudioTrack?.language ?? currentAudioLang;

  // Show resume toast
  useEffect(() => {
    if (!hasShownResume && video.resumePosition && video.resumePosition > 60) {
      toast.info(`Resuming from ${formatTime(video.resumePosition)}`);
      setHasShownResume(true);
    }
  }, [video, hasShownResume]);

  // Auto-hide controls — paused while lang panel is open
  useEffect(() => {
    if (showLangPanel) {
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
      return;
    }
    if (showControls) {
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
      controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
    return () => {
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    };
  }, [showControls, showLangPanel]);

  // Simulate playback progress
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setVideoProgress(progress + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, progress, setVideoProgress]);

  function handleTap() {
    if (showLangPanel) return;
    setShowControls((v) => !v);
  }

  function handleSeek(val: number[]) {
    const newProgress = (val[0] / 100) * totalDuration;
    setVideoProgress(newProgress);
  }

  function openAudioPanel(e: React.MouseEvent) {
    e.stopPropagation();
    setLangPanelTab("audio");
    setShowLangPanel(true);
    // Keep controls visible
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
  }

  function openSubtitlePanel(e: React.MouseEvent) {
    e.stopPropagation();
    setLangPanelTab("subtitles");
    setShowLangPanel(true);
    setShowControls(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
  }

  function handleSelectAudio(langCode: string) {
    setAudioLang(langCode);
    const trackName =
      audioTracks.find((t) => t.langCode === langCode)?.language ?? langCode;
    toast.success(`Audio: ${trackName}`);
    setShowLangPanel(false);
  }

  function handleSelectSubtitle(lang: string) {
    setSubtitleLang(lang);
    if (lang === "Off") {
      toast.success("Subtitles off");
    } else {
      toast.success(`Subtitles: ${lang}`);
    }
    setShowLangPanel(false);
  }

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

              {/* Language pill buttons */}
              <div className="flex items-center gap-2">
                {audioTracks.length > 0 && (
                  <button
                    type="button"
                    onClick={openAudioPanel}
                    className="px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium border border-white/20 backdrop-blur-sm hover:bg-black/80 transition-colors flex items-center gap-1.5"
                    aria-label={`Audio: ${audioDisplayName}`}
                  >
                    <span className="opacity-60 text-[10px] uppercase tracking-wider">
                      Audio
                    </span>
                    <span>{audioDisplayName}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={openSubtitlePanel}
                  className="px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium border border-white/20 backdrop-blur-sm hover:bg-black/80 transition-colors flex items-center gap-1.5"
                  aria-label={`Subtitles: ${videoPlayer.subtitleLang}`}
                >
                  <span className="opacity-60 text-[10px] uppercase tracking-wider">
                    CC
                  </span>
                  <span>
                    {videoPlayer.subtitleLang === "Off"
                      ? "Off"
                      : videoPlayer.subtitleLang}
                  </span>
                </button>
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

      {/* Language panel (portal-like, above everything) */}
      <AnimatePresence>
        {showLangPanel && (
          <LangPanel
            tab={langPanelTab}
            onTabChange={setLangPanelTab}
            audioTracks={audioTracks}
            subtitleOptions={subtitleOptions}
            currentAudioLang={currentAudioLang}
            currentSubtitleLang={videoPlayer.subtitleLang}
            onSelectAudio={handleSelectAudio}
            onSelectSubtitle={handleSelectSubtitle}
            onClose={() => setShowLangPanel(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VideoPlayer() {
  const { videoPlayer } = useApp();
  if (!videoPlayer.currentVideo) return null;
  return <VideoPlayerInner />;
}
