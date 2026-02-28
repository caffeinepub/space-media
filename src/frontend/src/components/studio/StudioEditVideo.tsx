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
import type { AudioTrack, SubtitleTrack } from "@/types";
import {
  ChevronLeft,
  Link2,
  MicVocal,
  Plus,
  Star,
  Subtitles,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
function uuidv4(): string {
  return crypto.randomUUID();
}
import StudioDeleteModal from "./StudioDeleteModal";

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
const SUBTITLE_LANGS = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Mandarin" },
];

interface StudioEditVideoProps {
  id: string;
  onBack: () => void;
}

export default function StudioEditVideo({ id, onBack }: StudioEditVideoProps) {
  const {
    studioVideos,
    updateStudioVideo,
    addAudioTrackToVideo,
    removeAudioTrackFromVideo,
  } = useApp();

  const video = studioVideos.find((v) => v.id === id);

  const [title, setTitle] = useState(video?.title ?? "");
  const [description, setDescription] = useState(video?.description ?? "");
  const [genre, setGenre] = useState(video?.genre ?? "Sci-Fi");
  const [ageRating, setAgeRating] = useState(video?.ageRating ?? "PG-13");
  const [primaryLang, setPrimaryLang] = useState(
    LANGUAGES.find((l) => l.name === video?.primaryLanguage)?.code ?? "en",
  );
  const [posterUrl, setPosterUrl] = useState(video?.posterUrl ?? "");
  const [isPublished, setIsPublished] = useState(video?.isPublished ?? false);

  // Add audio track form
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [newTrackLang, setNewTrackLang] = useState("en");
  const [newTrackLabel, setNewTrackLabel] = useState("Stereo");
  const [newTrackFile, setNewTrackFile] = useState("");

  // Add subtitle form
  const [showAddSubtitle, setShowAddSubtitle] = useState(false);
  const [newSubLang, setNewSubLang] = useState("en");
  const [subtitles, setSubtitles] = useState<SubtitleTrack[]>(
    video?.subtitles ?? [],
  );

  const [deleteTrackTarget, setDeleteTrackTarget] = useState<string | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  if (!video) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Video not found.
      </div>
    );
  }

  function handleAddTrack() {
    if (!newTrackFile) {
      toast.error("Please select an audio file");
      return;
    }
    const lang = LANGUAGES.find((l) => l.code === newTrackLang);
    const track: AudioTrack = {
      id: uuidv4(),
      language: lang?.name ?? newTrackLang,
      langCode: newTrackLang,
      audioLabel: newTrackLabel,
      isDefault: video?.audioTracks.length === 0,
    };
    addAudioTrackToVideo(id, track);
    setShowAddTrack(false);
    setNewTrackLang("en");
    setNewTrackLabel("Stereo");
    setNewTrackFile("");
    toast.success(`${track.language} audio track added`);
  }

  function handleSetDefaultTrack(trackId: string) {
    const updatedTracks = (video?.audioTracks ?? []).map((t) => ({
      ...t,
      isDefault: t.id === trackId,
    }));
    updateStudioVideo(id, { audioTracks: updatedTracks });
    toast.success("Default audio language updated");
  }

  function handleDeleteTrackConfirm() {
    if (!deleteTrackTarget) return;
    removeAudioTrackFromVideo(id, deleteTrackTarget);
    setDeleteTrackTarget(null);
    toast.success("Audio track removed");
  }

  function handleReplaceAudio() {
    toast.success("Audio file replaced (mock)");
  }

  function handleAddSubtitle() {
    const lang = SUBTITLE_LANGS.find((l) => l.code === newSubLang);
    const sub: SubtitleTrack = {
      id: uuidv4(),
      language: lang?.name ?? newSubLang,
      langCode: newSubLang,
    };
    setSubtitles((prev) => [...prev, sub]);
    setShowAddSubtitle(false);
    toast.success(`${sub.language} subtitle added`);
  }

  function handleDeleteSubtitle(subId: string) {
    setSubtitles((prev) => prev.filter((s) => s.id !== subId));
  }

  async function handleSave() {
    setSaving(true);
    const primaryLangObj = LANGUAGES.find((l) => l.code === primaryLang);
    updateStudioVideo(id, {
      title: title.trim(),
      description: description.trim(),
      genre,
      ageRating,
      primaryLanguage: primaryLangObj?.name ?? "English",
      posterUrl,
      isPublished,
      processingStatus: isPublished ? "ready" : "unpublished",
      subtitles,
    });
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    toast.success("Changes saved!");
    onBack();
  }

  const currentTracks =
    studioVideos.find((v) => v.id === id)?.audioTracks ?? [];

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
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-foreground truncate">
            Edit: {video.title}
          </h2>
          <p className="text-[10px] text-muted-foreground">Video Editor</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          size="sm"
          className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white"
        >
          {saving ? (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Save"
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Preview panel */}
        <div className="flex gap-3 px-4 pt-4 pb-3">
          <div className="w-16 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
            <img
              src={video.posterUrl}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-sm font-bold text-foreground truncate">
              {video.title}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  video.isPublished
                    ? "bg-green-500/20 text-green-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {video.processingStatus === "processing"
                  ? "Processing..."
                  : video.isPublished
                    ? "Published"
                    : "Draft"}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {currentTracks.length} audio track
                {currentTracks.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Link2 className="w-3 h-3" />
              <span className="truncate font-mono">{video.hlsMasterUrl}</span>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4 space-y-4">
          {/* Editable fields */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 bg-secondary border-border"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary border-border text-sm resize-none"
              rows={3}
            />
          </div>

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

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Poster URL</Label>
            <Input
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              className="h-10 bg-secondary border-border text-sm"
              placeholder="https://..."
            />
          </div>

          {/* Published toggle */}
          <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
            <div>
              <p className="text-sm font-semibold text-foreground">Status</p>
              <p className="text-xs text-muted-foreground">
                {isPublished ? "Visible to users" : "Hidden (draft)"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPublished((v) => !v)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                isPublished ? "bg-green-500" : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                  isPublished ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {/* Audio Tracks section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <MicVocal className="w-4 h-4 text-purple-400" />
                Audio Languages
              </h3>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowAddTrack(!showAddTrack)}
                className="h-7 text-xs gap-1 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </Button>
            </div>

            {currentTracks.length === 0 ? (
              <p className="text-xs text-muted-foreground">No audio tracks</p>
            ) : (
              <div className="space-y-2">
                {currentTracks.map((track) => (
                  <div
                    key={track.id}
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
                    </div>
                    <div className="flex items-center gap-1">
                      {!track.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultTrack(track.id)}
                          className="text-[10px] text-muted-foreground hover:text-amber-400 transition-colors px-1"
                        >
                          Set default
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleReplaceAudio}
                        className="text-[10px] text-muted-foreground hover:text-foreground transition-colors px-1"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTrackTarget(track.id)}
                        className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add track form */}
            {showAddTrack && (
              <div className="p-3 bg-secondary rounded-lg space-y-3 border border-purple-500/20">
                <p className="text-xs font-semibold text-purple-400">
                  Add Audio Track
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={newTrackLang} onValueChange={setNewTrackLang}>
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
                <label className="flex items-center gap-2 h-8 px-2 rounded bg-card border border-border cursor-pointer hover:border-purple-500/40 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-muted-foreground" />
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

          {/* Subtitles section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Subtitles className="w-4 h-4 text-blue-400" />
                Subtitles
              </h3>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setShowAddSubtitle(!showAddSubtitle)}
                className="h-7 text-xs gap-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </Button>
            </div>

            {subtitles.length === 0 ? (
              <p className="text-xs text-muted-foreground">No subtitles</p>
            ) : (
              <div className="space-y-1.5">
                {subtitles.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-2 bg-secondary rounded-lg"
                  >
                    <span className="text-xs text-foreground">
                      {sub.language}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSubtitle(sub.id)}
                      className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showAddSubtitle && (
              <div className="flex gap-2">
                <Select value={newSubLang} onValueChange={setNewSubLang}>
                  <SelectTrigger className="flex-1 h-8 text-xs bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBTITLE_LANGS.map((l) => (
                      <SelectItem key={l.code} value={l.code}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddSubtitle}
                  className="h-8 text-xs bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border-0"
                >
                  Add
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAddSubtitle(false)}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="h-4" />
        </div>
      </div>

      {/* Delete audio track modal */}
      <StudioDeleteModal
        isOpen={!!deleteTrackTarget}
        onClose={() => setDeleteTrackTarget(null)}
        onConfirm={handleDeleteTrackConfirm}
        itemTitle="this audio track"
      />
    </div>
  );
}
