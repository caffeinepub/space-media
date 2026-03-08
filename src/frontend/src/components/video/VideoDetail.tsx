import { useApp } from "@/AppContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockVideos } from "@/mockData";
import type { DownloadedItem, Episode, Season, VideoContent } from "@/types";
import {
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  Clock,
  Download,
  Globe,
  Play,
  Plus,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
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
    getSeriesResumeInfo,
  } = useApp();

  const downloaded = isDownloaded(video.id);
  const audioLang = videoPlayer.audioLang;

  const moreLikeThis = useMemo(
    () =>
      mockVideos
        .filter(
          (v) =>
            v.id !== video.id && v.id !== "v4p2" && v.genre === video.genre,
        )
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

  // Resume info for series
  const resumeInfo = useMemo(() => {
    if (video.contentType !== "series") return null;
    return getSeriesResumeInfo(video.id);
  }, [video.id, video.contentType, getSeriesResumeInfo]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col h-full overflow-y-auto scrollbar-hide bg-background"
    >
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

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <DesktopMetaPanel
            video={video}
            downloaded={downloaded}
            audioLang={audioLang}
            moreLikeThis={moreLikeThis}
            resumeInfo={resumeInfo}
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
          resumeInfo={resumeInfo}
          onPlay={() => playVideo(video)}
          onDownload={handleDownload}
          onSetAudioLang={setAudioLang}
          onSelect={onSelect}
        />
      </div>
    </motion.div>
  );
}

// ─── Panel wrappers ───────────────────────────────────────────────────────────

interface MetaPanelProps {
  video: VideoContent;
  downloaded: boolean;
  audioLang: string;
  moreLikeThis: VideoContent[];
  resumeInfo: {
    seasonNumber: number;
    episodeId: string;
    seconds: number;
  } | null;
  onPlay: () => void;
  onDownload: () => void;
  onSetAudioLang: (lang: string) => void;
  onSelect: (video: VideoContent) => void;
}

function MobileMetaPanel(props: MetaPanelProps) {
  return (
    <>
      <h1 className="text-2xl font-bold font-display text-foreground mb-2">
        {props.video.title}
      </h1>
      <MetaContent {...props} />
    </>
  );
}

function DesktopMetaPanel(props: MetaPanelProps) {
  return (
    <div className="px-6 lg:px-10 xl:px-12 py-8 xl:py-12">
      <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold font-display text-foreground mb-3">
        {props.video.title}
      </h1>
      <MetaContent {...props} />
    </div>
  );
}

// ─── Combined Glossy Season + Language Selector ───────────────────────────────

interface GlossySelectorProps {
  video: VideoContent;
  selectedSeasonIndex: number;
  audioLang: string;
  onSeasonChange: (index: number) => void;
  onSetAudioLang: (lang: string) => void;
  onSelect: (video: VideoContent) => void;
}

function GlossySelector({
  video,
  selectedSeasonIndex,
  audioLang,
  onSeasonChange,
  onSetAudioLang,
  onSelect,
}: GlossySelectorProps) {
  const [seasonOpen, setSeasonOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const isSeries =
    video.contentType === "series" &&
    video.seasons &&
    video.seasons.length >= 1;
  const isMultiPart =
    video.contentType === "movie" && video.parts && video.parts.length > 1;
  const hasAudioTracks = video.audioTracks && video.audioTracks.length > 1;

  if (!isSeries && !isMultiPart && !hasAudioTracks) return null;

  const glassStyle = {
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    boxShadow:
      "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.10)",
  } as React.CSSProperties;

  const dropdownStyle = {
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    background: "rgba(12,12,18,0.88)",
    border: "1px solid rgba(255,255,255,0.13)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
  } as React.CSSProperties;

  const activeAudioTrack = video.audioTracks?.find(
    (t) => t.langCode === audioLang,
  );
  const activeAudioLabel =
    activeAudioTrack?.language ?? audioLang.toUpperCase();

  // Determine current season/part label
  let topLabel = "";
  let topDetail = "";
  let hasTopDropdown = false;

  if (isSeries && video.seasons) {
    const currentSeason = video.seasons[selectedSeasonIndex];
    topLabel = currentSeason?.label ?? "Season 1";
    topDetail = `${currentSeason?.episodes.length ?? 0} episodes`;
    hasTopDropdown = video.seasons.length > 1;
  } else if (isMultiPart && video.parts) {
    const currentPart = video.parts.find((p) => p.videoId === video.id);
    topLabel = currentPart?.label ?? "Part 1";
    topDetail = video.parts.length > 1 ? `${video.parts.length} parts` : "";
    hasTopDropdown = video.parts.length > 1;
  }

  return (
    <div className="mb-5 space-y-2">
      {/* Row 1: Season / Part selector */}
      {(isSeries || isMultiPart) && (
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => hasTopDropdown && setSeasonOpen((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-foreground transition-all focus-visible:ring-2 focus-visible:ring-primary ${
              hasTopDropdown
                ? "cursor-pointer hover:bg-white/10"
                : "cursor-default"
            }`}
            style={glassStyle}
          >
            <span className="text-xs text-muted-foreground font-normal">
              {isSeries ? "Season" : "Part"}&nbsp;
            </span>
            {topLabel.replace(/Season |Part /i, "")}
            {topDetail && (
              <span className="text-xs text-muted-foreground font-normal ml-1">
                · {topDetail}
              </span>
            )}
            {hasTopDropdown && (
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${seasonOpen ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {hasTopDropdown && (
            <AnimatePresence>
              {seasonOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-1.5 left-0 z-50 min-w-[160px] rounded-xl overflow-hidden"
                  style={dropdownStyle}
                >
                  {isSeries && video.seasons
                    ? video.seasons.map((season, idx) => (
                        <button
                          key={season.seasonNumber}
                          type="button"
                          onClick={() => {
                            onSeasonChange(idx);
                            setSeasonOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${
                            idx === selectedSeasonIndex
                              ? "text-foreground font-semibold"
                              : "text-muted-foreground"
                          }`}
                        >
                          {season.label}
                          <span className="ml-2 text-xs opacity-50">
                            {season.episodes.length} eps
                          </span>
                        </button>
                      ))
                    : isMultiPart && video.parts
                      ? video.parts.map((part) => {
                          const targetVideo = mockVideos.find(
                            (v) => v.id === part.videoId,
                          );
                          const isActive = part.videoId === video.id;
                          return (
                            <button
                              key={part.partNumber}
                              type="button"
                              onClick={() => {
                                setSeasonOpen(false);
                                if (!isActive && targetVideo)
                                  onSelect(targetVideo);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${
                                isActive
                                  ? "text-foreground font-semibold"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {part.label}
                              {isActive && (
                                <span className="ml-2 text-xs opacity-50">
                                  watching
                                </span>
                              )}
                            </button>
                          );
                        })
                      : null}
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {seasonOpen && hasTopDropdown && (
            <div
              role="button"
              tabIndex={-1}
              className="fixed inset-0 z-40"
              onClick={() => setSeasonOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && setSeasonOpen(false)}
            />
          )}
        </div>
      )}

      {/* Row 2: Audio Language selector */}
      {hasAudioTracks && video.audioTracks && (
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => setLangOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-foreground transition-all cursor-pointer hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-primary"
            style={glassStyle}
          >
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-normal">
              Audio&nbsp;
            </span>
            {activeAudioLabel}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {langOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-1.5 left-0 z-50 min-w-[180px] rounded-xl overflow-hidden"
                style={dropdownStyle}
              >
                {video.audioTracks.map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      onSetAudioLang(track.langCode);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/10 flex items-center justify-between gap-3 ${
                      audioLang === track.langCode
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span>{track.language}</span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      {track.isDefault && (
                        <span className="text-[10px] text-amber-400">
                          default
                        </span>
                      )}
                      <span className="text-[10px] opacity-50">
                        {track.audioLabel}
                      </span>
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {langOpen && (
            <div
              role="button"
              tabIndex={-1}
              className="fixed inset-0 z-40"
              onClick={() => setLangOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && setLangOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── Episodes Section ─────────────────────────────────────────────────────────

interface EpisodesSectionProps {
  videoId: string;
  season: Season;
  onPlayEpisode: (episode: Episode) => void;
}

function EpisodesSection({
  videoId,
  season,
  onPlayEpisode,
}: EpisodesSectionProps) {
  const { getEpisodeProgress } = useApp();

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  };
  const rowVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base lg:text-lg font-bold text-foreground">
          Episodes
        </h2>
        <span className="text-xs text-muted-foreground">
          {season.label} · {season.episodes.length} episodes
        </span>
      </div>

      <motion.div
        className="flex flex-col gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {season.episodes.map((episode) => {
          const progress = getEpisodeProgress(
            videoId,
            season.seasonNumber,
            episode.id,
          );
          const watchRatio = progress
            ? Math.min(
                progress.watchedSeconds / Math.max(progress.durationSeconds, 1),
                1,
              )
            : (episode.resumePosition ?? 0);
          const hasProgress = watchRatio > 0.01 && watchRatio < 0.98;

          return (
            <motion.div
              key={episode.id}
              variants={rowVariants}
              className="flex gap-3 cursor-pointer group rounded-xl p-2 -mx-2 transition-colors hover:bg-white/5 active:bg-white/10"
              onClick={() => onPlayEpisode(episode)}
            >
              {/* Thumbnail */}
              <div
                className="relative flex-shrink-0 w-32 md:w-40 lg:w-48 rounded-lg overflow-hidden bg-secondary"
                style={{ aspectRatio: "16/9" }}
              >
                <img
                  src={episode.thumbnailUrl}
                  alt={episode.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Resume progress bar */}
                {hasProgress && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${watchRatio * 100}%` }}
                    />
                  </div>
                )}
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 py-0.5">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-foreground leading-snug line-clamp-1">
                    <span className="text-muted-foreground font-normal mr-1.5">
                      {episode.episodeNumber}.
                    </span>
                    {episode.title}
                  </p>
                  <span className="flex-shrink-0 text-xs text-muted-foreground">
                    {episode.runtime}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {episode.description}
                </p>
                {hasProgress && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="w-12 h-0.5 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-400 rounded-full"
                        style={{ width: `${watchRatio * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(watchRatio * 100)}% watched
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

// ─── MetaContent ─────────────────────────────────────────────────────────────

function MetaContent({
  video,
  downloaded,
  audioLang,
  moreLikeThis,
  resumeInfo,
  onPlay,
  onDownload,
  onSetAudioLang,
  onSelect,
}: MetaPanelProps) {
  const { playVideo, setEpisodeProgress } = useApp();
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(() => {
    if (resumeInfo && video.seasons) {
      const idx = video.seasons.findIndex(
        (s) => s.seasonNumber === resumeInfo.seasonNumber,
      );
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const isSeries =
    video.contentType === "series" && (video.seasons?.length ?? 0) > 0;
  const currentSeason =
    isSeries && video.seasons ? video.seasons[selectedSeasonIndex] : null;

  // Compute resume episode label
  const resumeEpisode = useMemo(() => {
    if (!resumeInfo || !video.seasons) return null;
    const season = video.seasons.find(
      (s) => s.seasonNumber === resumeInfo.seasonNumber,
    );
    return season?.episodes.find((e) => e.id === resumeInfo.episodeId) ?? null;
  }, [resumeInfo, video.seasons]);

  function handlePlayEpisode(episode: Episode) {
    // Save progress simulation: start tracking this episode
    const durationSeconds = episode.durationSeconds ?? 2700; // default 45m
    // Set a small initial progress so it shows as "started"
    setEpisodeProgress(
      video.id,
      currentSeason?.seasonNumber ?? 1,
      episode.id,
      0,
      durationSeconds,
    );
    playVideo(video);
  }

  return (
    <>
      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <Badge variant="secondary" className="text-xs">
          {video.rating}
        </Badge>
        {video.contentType === "series" && (
          <Badge
            variant="outline"
            className="text-xs border-primary/50 text-primary"
          >
            Series
          </Badge>
        )}
        <span className="text-xs text-muted-foreground">{video.year}</span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {video.contentType === "series" && video.seasons
            ? `${video.seasons.reduce((acc, s) => acc + s.episodes.length, 0)} episodes`
            : video.runtime}
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

      {/* Combined glossy season + language selector */}
      <GlossySelector
        video={video}
        selectedSeasonIndex={selectedSeasonIndex}
        audioLang={audioLang}
        onSeasonChange={setSelectedSeasonIndex}
        onSetAudioLang={onSetAudioLang}
        onSelect={onSelect}
      />

      {/* Subtitle chips */}
      {video.subtitles.length > 0 && (
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
      )}

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
          {resumeEpisode
            ? `Resume · S${resumeInfo?.seasonNumber} E${resumeEpisode.episodeNumber}`
            : isSeries
              ? "Play Season"
              : "Play Now"}
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

      {/* Episodes section (series only) */}
      {isSeries && currentSeason && (
        <EpisodesSection
          videoId={video.id}
          season={currentSeason}
          onPlayEpisode={handlePlayEpisode}
        />
      )}

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
