import { useApp } from "@/AppContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockVideos } from "@/mockData";
import type { DownloadedItem, VideoContent } from "@/types";
import {
  CheckCircle,
  ChevronLeft,
  Clock,
  Download,
  Globe,
  Play,
  Plus,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { toast } from "sonner";
import ContentRow from "./ContentRow";

interface VideoDetailProps {
  video: VideoContent;
  onBack: () => void;
  onSelect: (video: VideoContent) => void;
}

export default function VideoDetail({
  video,
  onBack,
  onSelect,
}: VideoDetailProps) {
  const {
    playVideo,
    isDownloaded,
    addDownload,
    passenger,
    videoPlayer,
    setAudioLang,
  } = useApp();

  const downloaded = isDownloaded(video.id);
  const audioLang = videoPlayer.audioLang;

  const moreLikeThis = useMemo(
    () =>
      mockVideos
        .filter((v) => v.id !== video.id && v.genre === video.genre)
        .slice(0, 8),
    [video.id, video.genre],
  );

  function handleDownload() {
    if (downloaded) return;
    const role = passenger?.role ?? "tourist";
    const days =
      role === "scientist" || role === "staff"
        ? 180
        : role === "manager"
          ? 365
          : 30;
    const item: DownloadedItem = {
      id: video.id,
      title: video.title,
      mediaType: "video",
      artworkUrl: video.posterUrl,
      downloadedAt: Date.now(),
      expiresAt: Date.now() + days * 24 * 60 * 60 * 1000,
      licenseStatus: "valid",
      genre: video.genre,
      language: video.language,
      artist: "",
      album: "",
      tags: video.tags ?? [],
      passengerId: passenger?.id ?? "",
      sizeBytes: 4_800_000_000,
    };
    addDownload(item);
    toast.success(`"${video.title}" saved to downloads`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col h-full overflow-y-auto scrollbar-hide bg-background"
    >
      {/* ── Mobile: stacked. md+: two-column with backdrop full-height on left ── */}

      {/* Mobile backdrop header */}
      <div
        className="md:hidden relative w-full"
        style={{ height: "56vw", minHeight: 200, maxHeight: 320 }}
      >
        <img
          src={video.backdropUrl}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(var(--background) / 0.3) 0%, oklch(var(--background)) 100%)",
          }}
        />
        <button
          type="button"
          onClick={onBack}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm text-white hover:bg-black/70 transition-colors focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop two-column layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        {/* Left: backdrop */}
        <div className="relative w-[38%] lg:w-[42%] xl:w-[45%] shrink-0 self-stretch">
          <img
            src={video.backdropUrl}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, transparent 50%, oklch(var(--background)) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, oklch(var(--background) / 0.2) 0%, transparent 30%)",
            }}
          />
          <button
            type="button"
            onClick={onBack}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm text-white hover:bg-black/70 transition-colors focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Right: metadata */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <DesktopMetaPanel
            video={video}
            downloaded={downloaded}
            audioLang={audioLang}
            moreLikeThis={moreLikeThis}
            onPlay={() => playVideo(video)}
            onDownload={handleDownload}
            onSetAudioLang={setAudioLang}
            onSelect={onSelect}
          />
        </div>
      </div>

      {/* Mobile metadata panel */}
      <div className="md:hidden px-4 pb-6">
        <MobileMetaPanel
          video={video}
          downloaded={downloaded}
          audioLang={audioLang}
          moreLikeThis={moreLikeThis}
          onPlay={() => playVideo(video)}
          onDownload={handleDownload}
          onSetAudioLang={setAudioLang}
          onSelect={onSelect}
        />
      </div>
    </motion.div>
  );
}

// ─── Shared Meta Content ──────────────────────────────────────────────────────

interface MetaPanelProps {
  video: VideoContent;
  downloaded: boolean;
  audioLang: string;
  moreLikeThis: VideoContent[];
  onPlay: () => void;
  onDownload: () => void;
  onSetAudioLang: (lang: string) => void;
  onSelect: (video: VideoContent) => void;
}

function MobileMetaPanel({
  video,
  downloaded,
  audioLang,
  moreLikeThis,
  onPlay,
  onDownload,
  onSetAudioLang,
  onSelect,
}: MetaPanelProps) {
  return (
    <>
      <h1 className="text-2xl font-bold font-display text-foreground mb-2">
        {video.title}
      </h1>
      <MetaContent
        video={video}
        downloaded={downloaded}
        audioLang={audioLang}
        moreLikeThis={moreLikeThis}
        onPlay={onPlay}
        onDownload={onDownload}
        onSetAudioLang={onSetAudioLang}
        onSelect={onSelect}
      />
    </>
  );
}

function DesktopMetaPanel({
  video,
  downloaded,
  audioLang,
  moreLikeThis,
  onPlay,
  onDownload,
  onSetAudioLang,
  onSelect,
}: MetaPanelProps) {
  return (
    <div className="px-6 lg:px-10 xl:px-12 py-8 xl:py-12">
      <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-display text-foreground mb-3">
        {video.title}
      </h1>
      <MetaContent
        video={video}
        downloaded={downloaded}
        audioLang={audioLang}
        moreLikeThis={moreLikeThis}
        onPlay={onPlay}
        onDownload={onDownload}
        onSetAudioLang={onSetAudioLang}
        onSelect={onSelect}
      />
    </div>
  );
}

function MetaContent({
  video,
  downloaded,
  audioLang,
  moreLikeThis,
  onPlay,
  onDownload,
  onSetAudioLang,
  onSelect,
}: MetaPanelProps) {
  return (
    <>
      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Badge variant="secondary" className="text-xs">
          {video.rating}
        </Badge>
        <span className="text-xs text-muted-foreground">{video.year}</span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {video.runtime}
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Globe className="w-3 h-3" />
          {video.language}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm lg:text-base text-muted-foreground leading-relaxed mb-4">
        {video.description}
      </p>

      {/* Audio language selector */}
      {video.audioTracks && video.audioTracks.length > 1 && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wider font-semibold">
            Audio
          </p>
          <div className="flex gap-2 flex-wrap">
            {video.audioTracks.map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={() => onSetAudioLang(track.langCode)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  audioLang === track.langCode
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-muted-foreground border-border hover:border-foreground/40"
                }`}
              >
                {track.language}
                {track.isDefault && (
                  <span className="ml-1 opacity-60">· default</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Subtitle chips */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">
          Subtitles
        </p>
        <div className="flex flex-wrap gap-2">
          {video.subtitles.map((lang) => (
            <span
              key={lang}
              className="text-xs px-2.5 py-1 rounded-full bg-secondary text-foreground border border-border"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2 max-w-sm">
        <Button
          onClick={onPlay}
          className="w-full h-11 lg:h-12 font-semibold gap-2"
          style={{
            background:
              "linear-gradient(135deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
            border: "none",
            color: "white",
          }}
        >
          <Play className="w-4 h-4 fill-white" />
          Play Now
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={onDownload}
            variant={downloaded ? "secondary" : "outline"}
            className="flex-1 h-10 font-semibold gap-2 text-sm"
            disabled={downloaded}
          >
            {downloaded ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-400" />
                Downloaded
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-10 font-semibold gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            My List
          </Button>
        </div>
      </div>

      {/* More like this */}
      {moreLikeThis.length > 0 && (
        <div className="mt-6">
          <ContentRow
            title="More Like This"
            videos={moreLikeThis}
            onSelect={onSelect}
          />
        </div>
      )}
    </>
  );
}
