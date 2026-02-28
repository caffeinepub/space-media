import { useApp } from "@/AppContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import type { StudioMusic, StudioVideo } from "@/types";
import { Eye, EyeOff, Film, Music, Pencil, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import StudioDeleteModal from "./StudioDeleteModal";

type FilterType = "all" | "videos" | "music" | "published" | "unpublished";

interface StudioLibraryProps {
  onEditVideo: (id: string) => void;
  onEditMusic: (id: string) => void;
}

type LibraryItem =
  | ({ kind: "video" } & StudioVideo)
  | ({ kind: "music" } & StudioMusic);

function getStatusBadge(
  item: StudioVideo | StudioMusic,
  kind: "video" | "music",
) {
  if (kind === "video") {
    const v = item as StudioVideo;
    switch (v.processingStatus) {
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Processing
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-destructive/20 text-destructive">
            Failed
          </span>
        );
      case "ready":
        return v.isPublished ? (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
            Published
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
            Draft
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
            Unpublished
          </span>
        );
    }
  }
  return (item as StudioMusic).isPublished ? (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
      Published
    </span>
  ) : (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
      Draft
    </span>
  );
}

export default function StudioLibrary({
  onEditVideo,
  onEditMusic,
}: StudioLibraryProps) {
  const {
    studioVideos,
    studioMusic,
    deleteStudioVideo,
    deleteStudioMusic,
    updateStudioVideo,
    updateStudioMusic,
  } = useApp();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
    kind: "video" | "music";
  } | null>(null);

  const allItems: LibraryItem[] = useMemo(() => {
    const videos: LibraryItem[] = studioVideos.map((v) => ({
      kind: "video",
      ...v,
    }));
    const music: LibraryItem[] = studioMusic.map((m) => ({
      kind: "music",
      ...m,
    }));
    return [...videos, ...music].sort((a, b) => b.dateAdded - a.dateAdded);
  }, [studioVideos, studioMusic]);

  const filtered = useMemo(() => {
    let items = allItems;
    if (filter === "videos") items = items.filter((i) => i.kind === "video");
    else if (filter === "music")
      items = items.filter((i) => i.kind === "music");
    else if (filter === "published") items = items.filter((i) => i.isPublished);
    else if (filter === "unpublished")
      items = items.filter((i) => !i.isPublished);

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          (i.kind === "music" &&
            (i as StudioMusic).artist.toLowerCase().includes(q)) ||
          i.genre.toLowerCase().includes(q),
      );
    }
    return items;
  }, [allItems, filter, search]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((i) => i.id)));
    }
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    if (deleteTarget.kind === "video") deleteStudioVideo(deleteTarget.id);
    else deleteStudioMusic(deleteTarget.id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteTarget.id);
      return next;
    });
    toast.success(`"${deleteTarget.title}" deleted`);
    setDeleteTarget(null);
  }

  function handleBulkDelete() {
    const toDelete = filtered.filter((i) => selectedIds.has(i.id));
    for (const item of toDelete) {
      if (item.kind === "video") deleteStudioVideo(item.id);
      else deleteStudioMusic(item.id);
    }
    toast.success(`${toDelete.length} item(s) deleted`);
    setSelectedIds(new Set());
  }

  function handleBulkUnpublish() {
    const toUpdate = filtered.filter((i) => selectedIds.has(i.id));
    for (const item of toUpdate) {
      if (item.kind === "video")
        updateStudioVideo(item.id, { isPublished: false });
      else updateStudioMusic(item.id, { isPublished: false });
    }
    toast.success(`${toUpdate.length} item(s) unpublished`);
    setSelectedIds(new Set());
  }

  function togglePublish(item: LibraryItem) {
    const next = !item.isPublished;
    if (item.kind === "video") {
      updateStudioVideo(item.id, {
        isPublished: next,
        processingStatus: next ? "ready" : "unpublished",
      });
    } else {
      updateStudioMusic(item.id, { isPublished: next });
    }
    toast.success(
      next ? `"${item.title}" published` : `"${item.title}" unpublished`,
    );
  }

  const filterTabs: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "videos", label: "Videos" },
    { id: "music", label: "Music" },
    { id: "published", label: "Published" },
    { id: "unpublished", label: "Unpublished" },
  ];

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 lg:px-6 xl:px-8 pt-4 pb-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base xl:text-lg font-bold text-foreground">
            Content Library
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              {studioVideos.length} videos
            </span>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              {studioMusic.length} music
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, artist, genre..."
            className="pl-9 h-9 bg-secondary border-border text-sm"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {filterTabs.map(({ id, label }) => (
            <button
              type="button"
              key={id}
              onClick={() => setFilter(id)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                filter === id
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 px-4 lg:px-6 py-2.5 bg-purple-500/10 border-b border-purple-500/20">
          <span className="text-xs font-semibold text-purple-400 flex-1">
            {selectedIds.size} selected
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleBulkUnpublish}
            className="h-7 text-xs text-muted-foreground hover:text-foreground px-2"
          >
            Unpublish
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleBulkDelete}
            className="h-7 text-xs text-destructive hover:text-destructive px-2"
          >
            Delete
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedIds(new Set())}
            className="h-7 text-xs text-muted-foreground px-2"
          >
            Clear
          </Button>
        </div>
      )}

      {/* Desktop table header — visible on lg+ */}
      {filtered.length > 0 && (
        <div className="hidden lg:flex items-center gap-3 px-6 xl:px-8 py-2 bg-secondary/40 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
          <Checkbox
            checked={
              filtered.length > 0 && selectedIds.size === filtered.length
            }
            onCheckedChange={selectAll}
            className="shrink-0"
          />
          <div className="w-12 xl:w-16 shrink-0" />
          <div className="flex-1">Title</div>
          <div className="w-20 shrink-0">Type</div>
          <div className="w-24 xl:w-28 shrink-0">Status</div>
          <div className="w-16 shrink-0 hidden xl:block">Lang</div>
          <div className="w-16 shrink-0">Duration</div>
          <div className="w-28 shrink-0 hidden xl:block">Date Added</div>
          <div className="w-24 shrink-0 text-right">Actions</div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Film className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm">No content found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {/* Mobile: select all row */}
            <div className="lg:hidden flex items-center gap-3 px-4 py-2 bg-secondary/40">
              <Checkbox
                checked={
                  filtered.length > 0 && selectedIds.size === filtered.length
                }
                onCheckedChange={selectAll}
                className="shrink-0"
              />
              <span className="text-xs text-muted-foreground">Select all</span>
            </div>

            {filtered.map((item) => {
              const isVideo = item.kind === "video";
              const audioCount = isVideo
                ? ((item as StudioVideo).audioTracks?.length ?? 0)
                : 0;

              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 px-4 lg:px-6 xl:px-8 py-3 hover:bg-secondary/30 transition-colors ${
                    selectedIds.has(item.id) ? "bg-purple-500/5" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <Checkbox
                    checked={selectedIds.has(item.id)}
                    onCheckedChange={() => toggleSelect(item.id)}
                    className="shrink-0"
                  />

                  {/* Thumbnail */}
                  <div
                    className={`shrink-0 rounded overflow-hidden bg-muted ${
                      isVideo
                        ? "w-10 h-[60px] lg:w-12 lg:h-[72px] xl:w-16 xl:h-[96px]"
                        : "w-10 h-10 lg:w-12 lg:h-12 xl:w-16 xl:h-16"
                    }`}
                  >
                    <img
                      src={
                        isVideo
                          ? (item as StudioVideo).posterUrl
                          : (item as StudioMusic).coverArt
                      }
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info — mobile layout */}
                  <div className="flex-1 min-w-0 lg:hidden">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <Badge
                        variant="secondary"
                        className="text-[10px] h-4 px-1.5 gap-1"
                      >
                        {isVideo ? (
                          <Film className="w-2.5 h-2.5" />
                        ) : (
                          <Music className="w-2.5 h-2.5" />
                        )}
                        {isVideo ? "Video" : "Music"}
                      </Badge>
                      {getStatusBadge(item, item.kind)}
                      {isVideo && audioCount > 0 && (
                        <span className="text-[10px] text-muted-foreground">
                          {audioCount} lang
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">
                        {item.duration}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        ·
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDate(item.dateAdded)}
                      </span>
                    </div>
                  </div>

                  {/* Info — desktop table layout */}
                  <div className="hidden lg:block flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {item.title}
                    </p>
                    {item.kind === "music" && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {(item as StudioMusic).artist}
                      </p>
                    )}
                  </div>

                  {/* Type — desktop */}
                  <div className="hidden lg:block w-20 shrink-0">
                    <Badge
                      variant="secondary"
                      className="text-[10px] h-5 px-1.5 gap-1"
                    >
                      {isVideo ? (
                        <Film className="w-2.5 h-2.5" />
                      ) : (
                        <Music className="w-2.5 h-2.5" />
                      )}
                      {isVideo ? "Video" : "Music"}
                    </Badge>
                  </div>

                  {/* Status — desktop */}
                  <div className="hidden lg:block w-24 xl:w-28 shrink-0">
                    {getStatusBadge(item, item.kind)}
                  </div>

                  {/* Lang count — desktop xl */}
                  <div className="hidden xl:block w-16 shrink-0">
                    {isVideo && audioCount > 0 ? (
                      <span className="text-xs text-muted-foreground">
                        {audioCount} lang
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>

                  {/* Duration — desktop */}
                  <div className="hidden lg:block w-16 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {item.duration}
                    </span>
                  </div>

                  {/* Date — desktop xl */}
                  <div className="hidden xl:block w-28 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(item.dateAdded)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 lg:w-24 lg:justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        isVideo ? onEditVideo(item.id) : onEditMusic(item.id)
                      }
                      className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePublish(item)}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={item.isPublished ? "Unpublish" : "Publish"}
                    >
                      {item.isPublished ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          id: item.id,
                          title: item.title,
                          kind: item.kind,
                        })
                      }
                      className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <StudioDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        itemTitle={deleteTarget?.title ?? ""}
      />
    </div>
  );
}
