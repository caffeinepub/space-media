import { useApp } from "@/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AudioTrack, StudioVideo } from "@/types";
import {
  CheckCircle,
  ChevronLeft,
  Clapperboard,
  Copy,
  Film,
  Loader2,
  MicVocal,
  Plus,
  Star,
  Trash2,
  Tv2,
  Upload,
  Video,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function uuidv4(): string {
  return crypto.randomUUID();
}

const GENRES = [
  "Sci-Fi",
  "Action",
  "Drama",
  "Comedy",
  "Documentary",
  "Thriller",
  "Horror",
  "Romance",
  "Adventure",
  "Animation",
];

const AGE_RATINGS = ["G", "PG", "PG-13", "TV-14", "TV-MA", "R"];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Mandarin" },
  { code: "pt", name: "Portuguese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "it", name: "Italian" },
  { code: "ru", name: "Russian" },
];

const AUDIO_LABELS = ["Stereo", "5.1", "Commentary"];

interface AudioTrackForm {
  tempId: string;
  langCode: string;
  language: string;
  audioLabel: string;
  isDefault: boolean;
  fileName: string;
}

interface StudioUploadVideoProps {
  onBack: () => void;
}

type ContentType = "movie" | "series";
type Step = "type" | "seriesId" | "metadata" | "processing" | "done";

export default function StudioUploadVideo({ onBack }: StudioUploadVideoProps) {
  const { addStudioVideo, updateStudioVideo, studioVideos } = useApp();

  // Step
  const [step, setStep] = useState<Step>("type");
  const [contentType, setContentType] = useState<ContentType>("movie");

  // ── Movie Series ID ──
  const [movieSeriesIdInput, setMovieSeriesIdInput] = useState("");
  const [resolvedMovieSeriesId, setResolvedMovieSeriesId] = useState("");
  const [moviePartNumber, setMoviePartNumber] = useState(1);

  // ── Web Series ID ──
  const [webSeriesIdInput, setWebSeriesIdInput] = useState("");
  const [resolvedSeriesId, setResolvedSeriesId] = useState("");
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [newSeriesGenerated, setNewSeriesGenerated] = useState(false);

  // Metadata
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("Sci-Fi");
  const [ageRating, setAgeRating] = useState("PG-13");
  const [primaryLang, setPrimaryLang] = useState("en");
  const [posterUrl, setPosterUrl] = useState("");
  const [videoFileName, setVideoFileName] = useState("");
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState<number>(1);

  // Audio tracks
  const [audioTracks, setAudioTracks] = useState<AudioTrackForm[]>([]);
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [newTrackLang, setNewTrackLang] = useState("en");
  const [newTrackLabel, setNewTrackLabel] = useState("Stereo");
  const [newTrackDefault, setNewTrackDefault] = useState(false);
  const [newTrackFile, setNewTrackFile] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Derived: existing series in studioVideos ──
  function getExistingSeriesSeasons(seriesId: string): number[] {
    const items = studioVideos.filter(
      (v) => v.seriesId === seriesId && v.contentType === "series",
    );
    const seasons = Array.from(new Set(items.map((v) => v.seasonNumber ?? 1)));
    return seasons.sort((a, b) => a - b);
  }

  function getExistingMovieParts(seriesId: string): number[] {
    const items = studioVideos.filter(
      (v) => v.seriesId === seriesId && v.contentType === "movie",
    );
    const parts = Array.from(new Set(items.map((v) => v.partNumber ?? 1)));
    return parts.sort((a, b) => a - b);
  }

  // ── Step 1: Choose content type ──
  function handleContentTypeNext() {
    setStep("seriesId");
  }

  // ── Step 2: Series / Part ID ──
  function handleSeriesIdNext() {
    if (contentType === "series") {
      const trimmed = webSeriesIdInput.trim();
      if (!trimmed) {
        // Generate a new Series ID
        const newId = `series_${uuidv4().slice(0, 8)}`;
        setResolvedSeriesId(newId);
        setNewSeriesGenerated(true);
        setSelectedSeason(1);
      } else {
        // Validate that it exists
        const existingSeasons = getExistingSeriesSeasons(trimmed);
        if (existingSeasons.length === 0) {
          setErrors({
            seriesId:
              "No web series found with that ID. Leave blank to start a new series.",
          });
          return;
        }
        setResolvedSeriesId(trimmed);
        setNewSeriesGenerated(false);
        // Default to next available season
        const maxSeason = Math.max(...existingSeasons);
        setSelectedSeason(maxSeason + 1);
      }
    } else {
      // Movie
      const trimmed = movieSeriesIdInput.trim();
      if (!trimmed) {
        // Standalone movie or Part 1 — generate new series ID
        const newId = `mseries_${uuidv4().slice(0, 8)}`;
        setResolvedMovieSeriesId(newId);
        setMoviePartNumber(1);
      } else {
        // Link to existing movie series
        const existingParts = getExistingMovieParts(trimmed);
        if (existingParts.length === 0) {
          setErrors({ seriesId: "No movie series found with that ID." });
          return;
        }
        setResolvedMovieSeriesId(trimmed);
        const maxPart = Math.max(...existingParts);
        setMoviePartNumber(maxPart + 1);
      }
    }
    setErrors({});
    setStep("metadata");
  }

  // ── Audio Track helpers ──
  function handleAddTrack() {
    if (!newTrackFile) {
      toast.error("Please select an audio file");
      return;
    }
    const lang = LANGUAGES.find((l) => l.code === newTrackLang);
    const track: AudioTrackForm = {
      tempId: uuidv4(),
      langCode: newTrackLang,
      language: lang?.name ?? newTrackLang,
      audioLabel: newTrackLabel,
      isDefault: newTrackDefault || audioTracks.length === 0,
      fileName: newTrackFile,
    };
    if (track.isDefault) {
      setAudioTracks((prev) => prev.map((t) => ({ ...t, isDefault: false })));
    }
    setAudioTracks((prev) => [...prev, track]);
    setShowAddTrack(false);
    setNewTrackLang("en");
    setNewTrackLabel("Stereo");
    setNewTrackDefault(false);
    setNewTrackFile("");
    toast.success(`${track.language} audio track added`);
  }

  function handleDeleteTrack(tempId: string) {
    setAudioTracks((prev) => {
      const next = prev.filter((t) => t.tempId !== tempId);
      if (
        next.length > 0 &&
        !next.some((t) => t.isDefault) &&
        prev.find((t) => t.tempId === tempId)?.isDefault
      ) {
        next[0].isDefault = true;
      }
      return next;
    });
  }

  function handleSetDefault(tempId: string) {
    setAudioTracks((prev) =>
      prev.map((t) => ({ ...t, isDefault: t.tempId === tempId })),
    );
  }

  // ── Submit ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Title is required";
    if (contentType === "series" && !episodeTitle.trim())
      errs.episodeTitle = "Episode title is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const newId = uuidv4();
    const primaryLangObj = LANGUAGES.find((l) => l.code === primaryLang);
    const finalAudioTracks: AudioTrack[] = audioTracks.map((t) => ({
      id: uuidv4(),
      language: t.language,
      langCode: t.langCode,
      audioLabel: t.audioLabel,
      isDefault: t.isDefault,
    }));

    if (finalAudioTracks.length === 0) {
      finalAudioTracks.push({
        id: uuidv4(),
        language: primaryLangObj?.name ?? "English",
        langCode: primaryLang,
        audioLabel: "Stereo",
        isDefault: true,
      });
    }

    const newVideo: StudioVideo = {
      id: newId,
      title: title.trim(),
      description: description.trim(),
      genre,
      ageRating,
      primaryLanguage: primaryLangObj?.name ?? "English",
      posterUrl:
        posterUrl.trim() ||
        `https://picsum.photos/seed/${newId.slice(0, 8)}/300/450`,
      hlsMasterUrl: `/media/videos/${newId}/master.m3u8`,
      processingStatus: "processing",
      isPublished: false,
      duration: "—",
      dateAdded: Date.now(),
      audioTracks: finalAudioTracks,
      subtitles: [],
      contentType,
      seriesId:
        contentType === "series" ? resolvedSeriesId : resolvedMovieSeriesId,
      seasonNumber: contentType === "series" ? selectedSeason : undefined,
      partNumber: contentType === "movie" ? moviePartNumber : undefined,
      episodeNumber: contentType === "series" ? episodeNumber : undefined,
      episodeTitle: contentType === "series" ? episodeTitle.trim() : undefined,
    };

    addStudioVideo(newVideo);
    setStep("processing");

    await new Promise((r) => setTimeout(r, 3000));

    updateStudioVideo(newId, {
      processingStatus: "ready",
      isPublished: true,
      duration: contentType === "series" ? "45m" : "1h 30m",
    });

    setStep("done");
    toast.success(`"${title}" uploaded and published!`);

    setTimeout(() => {
      onBack();
    }, 2500);
  }

  // ── Render: Processing ──
  if (step === "processing") {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-purple-500/15 flex items-center justify-center mb-4">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">
          Processing Video
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Building HLS multi-audio package...
        </p>
        <div className="w-full max-w-xs space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-green-400" />
            Uploading base video
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-green-400" />
            Creating video renditions (1080p)
          </div>
          <div className="flex items-center gap-2 opacity-70">
            <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" />
            Encoding audio language tracks
          </div>
          <div className="flex items-center gap-2 opacity-40">
            <div className="w-3.5 h-3.5 rounded-full border border-border" />
            Building master.m3u8 manifest
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Done ──
  if (step === "done") {
    const displayId =
      contentType === "series" ? resolvedSeriesId : resolvedMovieSeriesId;
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Upload Complete!</h3>
        <div
          className="w-full max-w-xs rounded-xl p-4 text-left space-y-1"
          style={{
            backdropFilter: "blur(12px)",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.14)",
          }}
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
            {contentType === "series" ? "Series ID" : "Movie Series ID"}
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs text-primary font-mono break-all">
              {displayId}
            </code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(displayId);
                toast.success("ID copied!");
              }}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground pt-1">
            {contentType === "series"
              ? "Paste this ID when uploading more episodes or seasons."
              : "Paste this ID when uploading the next part of this movie."}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">Returning to library...</p>
      </div>
    );
  }

  // ── Render: Step 1 — Content Type ──
  if (step === "type") {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <StepHeader title="Upload Video" onBack={onBack} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
          <div className="text-center">
            <h3 className="text-base font-bold text-foreground mb-1">
              What are you uploading?
            </h3>
            <p className="text-xs text-muted-foreground">
              Choose the content type before continuing
            </p>
          </div>
          <div className="w-full max-w-sm grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setContentType("movie")}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all focus-visible:ring-2 focus-visible:ring-primary ${
                contentType === "movie"
                  ? "border-purple-500 bg-purple-500/15 text-foreground"
                  : "border-border bg-secondary text-muted-foreground hover:border-border/70"
              }`}
            >
              <Film
                className={`w-8 h-8 ${contentType === "movie" ? "text-purple-400" : ""}`}
              />
              <div className="text-center">
                <p className="text-sm font-bold">Movie</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Single film or multi-part
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setContentType("series")}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all focus-visible:ring-2 focus-visible:ring-primary ${
                contentType === "series"
                  ? "border-blue-500 bg-blue-500/15 text-foreground"
                  : "border-border bg-secondary text-muted-foreground hover:border-border/70"
              }`}
            >
              <Tv2
                className={`w-8 h-8 ${contentType === "series" ? "text-blue-400" : ""}`}
              />
              <div className="text-center">
                <p className="text-sm font-bold">Web Series</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Episodes by season
                </p>
              </div>
            </button>
          </div>
          <Button
            onClick={handleContentTypeNext}
            className="w-full max-w-sm h-11 font-semibold bg-purple-600 hover:bg-purple-700 text-white"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // ── Render: Step 2 — Series/Part ID ──
  if (step === "seriesId") {
    if (contentType === "series") {
      const existingSeasons = webSeriesIdInput.trim()
        ? getExistingSeriesSeasons(webSeriesIdInput.trim())
        : [];
      return (
        <div className="flex flex-col h-full overflow-hidden">
          <StepHeader title="Web Series Setup" onBack={() => setStep("type")} />
          <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-6 space-y-5">
            <div
              className="p-4 rounded-xl space-y-1"
              style={{
                background: "rgba(59,130,246,0.08)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Tv2 className="w-4 h-4 text-blue-400" />
                <p className="text-sm font-bold text-foreground">
                  Web Series ID
                </p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                To start a{" "}
                <strong className="text-foreground">new series</strong>, leave
                the field blank — a Series ID will be generated automatically.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                To add episodes to an{" "}
                <strong className="text-foreground">existing series</strong>,
                paste the Series ID below.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Series ID{" "}
                <span className="text-muted-foreground">
                  (optional — paste existing)
                </span>
              </Label>
              <Input
                value={webSeriesIdInput}
                onChange={(e) => {
                  setWebSeriesIdInput(e.target.value);
                  setErrors({});
                }}
                placeholder="e.g. series_a1b2c3d4 or leave blank"
                className="h-10 bg-secondary border-border font-mono text-sm"
              />
              {errors.seriesId && (
                <p className="text-xs text-destructive">{errors.seriesId}</p>
              )}
            </div>

            {existingSeasons.length > 0 && (
              <div
                className="p-3 rounded-lg space-y-2"
                style={{
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                <p className="text-xs font-semibold text-green-400">
                  Series found
                </p>
                <p className="text-xs text-muted-foreground">
                  Existing seasons:{" "}
                  {existingSeasons.map((s) => `Season ${s}`).join(", ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  New episode will be added to Season{" "}
                  {Math.max(...existingSeasons) + 1}
                </p>
              </div>
            )}

            <Button
              onClick={handleSeriesIdNext}
              className="w-full h-11 font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue
            </Button>
          </div>
        </div>
      );
    }

    // Movie
    const existingParts = movieSeriesIdInput.trim()
      ? getExistingMovieParts(movieSeriesIdInput.trim())
      : [];
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <StepHeader title="Movie Series Setup" onBack={() => setStep("type")} />
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-6 space-y-5">
          <div
            className="p-4 rounded-xl space-y-1"
            style={{
              background: "rgba(168,85,247,0.08)",
              border: "1px solid rgba(168,85,247,0.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Film className="w-4 h-4 text-purple-400" />
              <p className="text-sm font-bold text-foreground">
                Movie Series ID
              </p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Uploading a{" "}
              <strong className="text-foreground">
                standalone movie or Part 1
              </strong>
              ? Leave blank — a Movie Series ID will be generated. Keep it to
              link future sequels.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Uploading{" "}
              <strong className="text-foreground">Part 2 or later</strong>?
              Paste the existing Movie Series ID to link it.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Movie Series ID{" "}
              <span className="text-muted-foreground">
                (optional — paste for sequel)
              </span>
            </Label>
            <Input
              value={movieSeriesIdInput}
              onChange={(e) => {
                setMovieSeriesIdInput(e.target.value);
                setErrors({});
              }}
              placeholder="e.g. mseries_a1b2c3d4 or leave blank"
              className="h-10 bg-secondary border-border font-mono text-sm"
            />
            {errors.seriesId && (
              <p className="text-xs text-destructive">{errors.seriesId}</p>
            )}
          </div>

          {existingParts.length > 0 && (
            <div
              className="p-3 rounded-lg space-y-2"
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <p className="text-xs font-semibold text-green-400">
                Movie series found
              </p>
              <p className="text-xs text-muted-foreground">
                Existing parts:{" "}
                {existingParts.map((p) => `Part ${p}`).join(", ")}
              </p>
              <p className="text-xs text-muted-foreground">
                This upload will become Part {Math.max(...existingParts) + 1}
              </p>
            </div>
          )}

          <Button
            onClick={handleSeriesIdNext}
            className="w-full h-11 font-semibold bg-purple-600 hover:bg-purple-700 text-white"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // ── Render: Step 3 — Metadata + Upload ──
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <StepHeader
        title={contentType === "series" ? "Episode Details" : "Movie Details"}
        onBack={() => setStep("seriesId")}
      />

      {/* Series/Part ID banner */}
      {(resolvedSeriesId || resolvedMovieSeriesId) && (
        <div
          className="mx-4 mt-3 px-3 py-2 rounded-lg flex items-center gap-2"
          style={{
            background:
              contentType === "series"
                ? "rgba(59,130,246,0.10)"
                : "rgba(168,85,247,0.10)",
            border: `1px solid ${contentType === "series" ? "rgba(59,130,246,0.22)" : "rgba(168,85,247,0.22)"}`,
          }}
        >
          {contentType === "series" ? (
            <Tv2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          ) : (
            <Film className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              {contentType === "series"
                ? `Series ID · Season ${selectedSeason}`
                : `Movie Series ID · Part ${moviePartNumber}`}
            </p>
            <p className="text-xs font-mono text-foreground truncate">
              {contentType === "series"
                ? resolvedSeriesId
                : resolvedMovieSeriesId}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const id =
                contentType === "series"
                  ? resolvedSeriesId
                  : resolvedMovieSeriesId;
              navigator.clipboard.writeText(id);
              toast.success("ID copied!");
            }}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto scrollbar-hide"
      >
        <div className="px-4 py-4 space-y-5">
          {/* Series-specific: Season selector */}
          {contentType === "series" && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Season</Label>
              <div className="flex gap-2 flex-wrap">
                {[selectedSeason].map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  >
                    Season {s}
                    {newSeriesGenerated && s === 1 && (
                      <span className="ml-1.5 text-[10px] text-blue-400/70">
                        (new series)
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Series-specific: Episode Number + Title */}
          {contentType === "series" && (
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Ep #</Label>
                <Input
                  type="number"
                  min={1}
                  value={episodeNumber}
                  onChange={(e) => setEpisodeNumber(Number(e.target.value))}
                  className="h-10 bg-secondary border-border"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Episode Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={episodeTitle}
                  onChange={(e) => {
                    setEpisodeTitle(e.target.value);
                    setErrors((p) => ({ ...p, episodeTitle: "" }));
                  }}
                  placeholder="Episode title"
                  className="h-10 bg-secondary border-border"
                />
                {errors.episodeTitle && (
                  <p className="text-xs text-destructive">
                    {errors.episodeTitle}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              {contentType === "series" ? "Series Title" : "Title"}{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((p) => ({ ...p, title: "" }));
              }}
              placeholder={
                contentType === "series"
                  ? "Enter series name"
                  : "Enter movie title"
              }
              className="h-10 bg-secondary border-border"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description..."
              className="bg-secondary border-border text-sm resize-none"
              rows={3}
            />
          </div>

          {/* Genre + Age Rating */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Genre</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="h-10 bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Age Rating
              </Label>
              <Select value={ageRating} onValueChange={setAgeRating}>
                <SelectTrigger className="h-10 bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AGE_RATINGS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Primary Language */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Primary Language
            </Label>
            <Select value={primaryLang} onValueChange={setPrimaryLang}>
              <SelectTrigger className="h-10 bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Poster URL */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Poster Image URL (optional)
            </Label>
            <Input
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="https://... or leave blank for default"
              className="h-10 bg-secondary border-border text-sm"
            />
          </div>

          {/* Video file */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Base Video File
            </Label>
            <label className="flex items-center gap-3 h-10 px-3 rounded-md bg-secondary border border-border cursor-pointer hover:border-purple-500/50 transition-colors">
              <Upload className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground truncate flex-1">
                {videoFileName || "Select video file..."}
              </span>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) =>
                  setVideoFileName(e.target.files?.[0]?.name ?? "")
                }
              />
            </label>
          </div>

          {/* Audio Languages section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <MicVocal className="w-4 h-4 text-purple-400" />
                  Audio Languages
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Add multi-language audio tracks for HLS
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowAddTrack(true)}
                className="h-8 text-xs gap-1 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Track
              </Button>
            </div>

            {audioTracks.length > 0 && (
              <div className="space-y-2">
                {audioTracks.map((track) => (
                  <div
                    key={track.tempId}
                    className="flex items-center gap-2 p-2.5 bg-secondary rounded-lg"
                  >
                    <MicVocal className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-foreground">
                          {track.language}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {track.audioLabel}
                        </span>
                        {track.isDefault && (
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-400">
                            <Star className="w-2.5 h-2.5 fill-amber-400" />
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {track.fileName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!track.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(track.tempId)}
                          className="text-[10px] text-muted-foreground hover:text-amber-400 transition-colors px-1"
                        >
                          Set default
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteTrack(track.tempId)}
                        className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showAddTrack && (
              <div className="p-3 bg-secondary rounded-lg space-y-3 border border-purple-500/20">
                <p className="text-xs font-semibold text-purple-400">
                  Add Audio Language
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">
                      Language
                    </Label>
                    <Select
                      value={newTrackLang}
                      onValueChange={setNewTrackLang}
                    >
                      <SelectTrigger className="h-8 text-xs bg-card border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((l) => (
                          <SelectItem key={l.code} value={l.code}>
                            {l.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">
                      Label
                    </Label>
                    <Select
                      value={newTrackLabel}
                      onValueChange={setNewTrackLabel}
                    >
                      <SelectTrigger className="h-8 text-xs bg-card border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {AUDIO_LABELS.map((l) => (
                          <SelectItem key={l} value={l}>
                            {l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <label className="flex items-center gap-2 h-8 px-2 rounded bg-card border border-border cursor-pointer hover:border-purple-500/40 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground truncate flex-1">
                    {newTrackFile || "Select audio file..."}
                  </span>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) =>
                      setNewTrackFile(e.target.files?.[0]?.name ?? "")
                    }
                  />
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newTrackDefault}
                    onChange={(e) => setNewTrackDefault(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-xs text-muted-foreground">
                    Set as default audio language
                  </span>
                </label>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddTrack}
                    className="flex-1 h-8 text-xs bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border-0"
                  >
                    Save Track
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowAddTrack(false)}
                    className="flex-1 h-8 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11 font-semibold gap-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Upload className="w-4 h-4" />
            Upload &amp; Process
          </Button>
          <div className="h-4" />
        </div>
      </form>
    </div>
  );
}

// ─── Shared Step Header ───────────────────────────────────────────────────────

function StepHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
      <button
        type="button"
        onClick={onBack}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-2">
        <Clapperboard className="w-4 h-4 text-purple-400" />
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
      </div>
    </div>
  );
}
