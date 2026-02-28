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
  Loader2,
  MicVocal,
  Plus,
  Star,
  Trash2,
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

export default function StudioUploadVideo({ onBack }: StudioUploadVideoProps) {
  const { addStudioVideo, updateStudioVideo } = useApp();

  // Metadata
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("Sci-Fi");
  const [ageRating, setAgeRating] = useState("PG-13");
  const [primaryLang, setPrimaryLang] = useState("en");
  const [posterUrl, setPosterUrl] = useState("");
  const [videoFileName, setVideoFileName] = useState("");

  // Audio tracks
  const [audioTracks, setAudioTracks] = useState<AudioTrackForm[]>([]);
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [newTrackLang, setNewTrackLang] = useState("en");
  const [newTrackLabel, setNewTrackLabel] = useState("Stereo");
  const [newTrackDefault, setNewTrackDefault] = useState(false);
  const [newTrackFile, setNewTrackFile] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingDone, setProcessingDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Title is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

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
    // Only one can be default
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
      // If we deleted the default, set first as default
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const newId = uuidv4();
    const primaryLangObj = LANGUAGES.find((l) => l.code === primaryLang);
    const finalAudioTracks: AudioTrack[] = audioTracks.map((t) => ({
      id: uuidv4(),
      language: t.language,
      langCode: t.langCode,
      audioLabel: t.audioLabel,
      isDefault: t.isDefault,
    }));

    // If no audio tracks added, add a default one from primary language
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
    };

    addStudioVideo(newVideo);
    setIsProcessing(true);

    // Simulate HLS processing
    await new Promise((r) => setTimeout(r, 3000));

    updateStudioVideo(newId, {
      processingStatus: "ready",
      isPublished: true,
      duration: "1h 30m",
    });

    setIsProcessing(false);
    setProcessingDone(true);
    toast.success(`"${title}" uploaded and published!`);

    setTimeout(() => {
      onBack();
    }, 1500);
  }

  if (isProcessing) {
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

  if (processingDone) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Upload Complete!</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Returning to library...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-foreground">Upload Video</h2>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto scrollbar-hide"
      >
        <div className="px-4 py-4 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((p) => ({ ...p, title: "" }));
              }}
              placeholder="Enter video title"
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
              placeholder="Video description..."
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

            {/* Track list */}
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

            {/* Add track inline form */}
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
