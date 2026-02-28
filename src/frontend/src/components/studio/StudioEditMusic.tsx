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
import { ChevronLeft, Music, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const GENRES = [
  "Pop",
  "Rock",
  "Electronic",
  "Ambient",
  "Classical",
  "Jazz",
  "Hip-Hop",
  "Indie",
  "Orchestral",
  "Acoustic",
  "R&B",
  "Country",
];

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
  { code: "inst", name: "Instrumental" },
];

interface StudioEditMusicProps {
  id: string;
  onBack: () => void;
}

export default function StudioEditMusic({ id, onBack }: StudioEditMusicProps) {
  const { studioMusic, updateStudioMusic } = useApp();

  const music = studioMusic.find((m) => m.id === id);

  const [title, setTitle] = useState(music?.title ?? "");
  const [artist, setArtist] = useState(music?.artist ?? "");
  const [album, setAlbum] = useState(music?.album ?? "");
  const [genre, setGenre] = useState(music?.genre ?? "Electronic");
  const [language, setLanguage] = useState(
    LANGUAGES.find((l) => l.name === music?.language)?.code ?? "en",
  );
  const [coverArt, setCoverArt] = useState(music?.coverArt ?? "");
  const [isPublished, setIsPublished] = useState(music?.isPublished ?? false);
  const [saving, setSaving] = useState(false);

  if (!music) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Track not found.
      </div>
    );
  }

  function handleReplaceAudio() {
    toast.success("Audio file replaced (mock)");
  }

  async function handleSave() {
    setSaving(true);
    const langName =
      LANGUAGES.find((l) => l.code === language)?.name ?? "English";
    updateStudioMusic(id, {
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim(),
      genre,
      language: langName,
      coverArt,
      isPublished,
    });
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    toast.success("Changes saved!");
    onBack();
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
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-foreground truncate">
            Edit: {music.title}
          </h2>
          <p className="text-[10px] text-muted-foreground">Music Editor</p>
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
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
            <img
              src={music.coverArt}
              alt={music.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-sm font-bold text-foreground truncate">
              {music.title}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {music.artist}
            </p>
            <span
              className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                music.isPublished
                  ? "bg-green-500/20 text-green-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {music.isPublished ? "Published" : "Draft"}
            </span>
          </div>
        </div>

        <div className="px-4 pb-4 space-y-4">
          {/* Replace audio button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleReplaceAudio}
            className="w-full h-9 text-xs gap-2 border-border text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Replace Audio File (mock)
          </Button>

          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 bg-secondary border-border"
            />
          </div>

          {/* Artist */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Artist</Label>
            <Input
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="h-10 bg-secondary border-border"
            />
          </div>

          {/* Album */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Album</Label>
            <Input
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              className="h-10 bg-secondary border-border"
            />
          </div>

          {/* Genre + Language */}
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
              <Label className="text-xs text-muted-foreground">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
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
          </div>

          {/* Cover art URL */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Cover Art URL
            </Label>
            <div className="flex gap-2">
              {coverArt && (
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                  <img
                    src={coverArt}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <Input
                value={coverArt}
                onChange={(e) => setCoverArt(e.target.value)}
                className="flex-1 h-10 bg-secondary border-border text-sm"
                placeholder="https://..."
              />
            </div>
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

          <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
            <Music className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-foreground">Duration</p>
              <p className="text-xs text-muted-foreground">{music.duration}</p>
            </div>
          </div>

          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
