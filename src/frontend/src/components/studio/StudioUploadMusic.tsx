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
import type { StudioMusic } from "@/types";
import { ChevronLeft, Music, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
function uuidv4(): string {
  return crypto.randomUUID();
}

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

interface StudioUploadMusicProps {
  onBack: () => void;
}

export default function StudioUploadMusic({ onBack }: StudioUploadMusicProps) {
  const { addStudioMusic } = useApp();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("Electronic");
  const [language, setLanguage] = useState("en");
  const [coverArtUrl, setCoverArtUrl] = useState("");
  const [audioFileName, setAudioFileName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Title is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const newId = uuidv4();
    const langName =
      LANGUAGES.find((l) => l.code === language)?.name ?? "English";

    const newMusic: StudioMusic = {
      id: newId,
      title: title.trim(),
      artist: artist.trim() || "Unknown Artist",
      album: album.trim() || "Single",
      genre,
      language: langName,
      coverArt:
        coverArtUrl.trim() ||
        `https://picsum.photos/seed/${newId.slice(0, 8)}/300/300`,
      dateAdded: Date.now(),
      duration: "—",
      isPublished: true,
    };

    await new Promise((r) => setTimeout(r, 500));

    addStudioMusic(newMusic);
    setSubmitting(false);
    toast.success(`"${title}" uploaded!`);
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
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-foreground">Upload Music</h2>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto scrollbar-hide"
      >
        <div className="px-4 py-4 space-y-4">
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
              placeholder="Track title"
              className="h-10 bg-secondary border-border"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Artist */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Artist</Label>
            <Input
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Artist name"
              className="h-10 bg-secondary border-border"
            />
          </div>

          {/* Album */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Album</Label>
            <Input
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              placeholder="Album name (optional)"
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
              Cover Art URL (optional)
            </Label>
            <Input
              value={coverArtUrl}
              onChange={(e) => setCoverArtUrl(e.target.value)}
              placeholder="https://... or leave blank"
              className="h-10 bg-secondary border-border text-sm"
            />
          </div>

          {/* Audio file */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Audio File (MP3 / AAC)
            </Label>
            <label className="flex items-center gap-3 h-10 px-3 rounded-md bg-secondary border border-border cursor-pointer hover:border-purple-500/50 transition-colors">
              <Upload className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground truncate flex-1">
                {audioFileName || "Select audio file..."}
              </span>
              <input
                type="file"
                accept="audio/*,.mp3,.m4a,.aac"
                className="hidden"
                onChange={(e) =>
                  setAudioFileName(e.target.files?.[0]?.name ?? "")
                }
              />
            </label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-11 font-semibold gap-2 bg-purple-600 hover:bg-purple-700 text-white"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Music
              </>
            )}
          </Button>
          <div className="h-4" />
        </div>
      </form>
    </div>
  );
}
