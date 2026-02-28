import { useApp } from "@/AppContext";
import StatusPill from "@/components/shared/StatusPill";
import { mockVideos } from "@/mockData";
import type { VideoContent } from "@/types";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import ContentRow from "./ContentRow";
import HeroBanner from "./HeroBanner";

const GENRES = ["All", "Sci-Fi", "Action", "Drama", "Documentary", "Comedy"];

interface VideoHomeProps {
  onSelectVideo: (video: VideoContent) => void;
}

export default function VideoHome({ onSelectVideo }: VideoHomeProps) {
  const { setShowSearch, setSearchInitialTab } = useApp();
  const [selectedGenre, setSelectedGenre] = useState("All");

  const featuredVideo = mockVideos[0];

  const continueWatching = useMemo(
    () => mockVideos.filter((v) => v.resumePosition && v.resumePosition > 0),
    [],
  );

  const trending = useMemo(() => mockVideos.slice(1, 8), []);
  const recentlyAdded = useMemo(() => mockVideos.slice(-5), []);

  const genreFiltered = useMemo(() => {
    if (selectedGenre === "All") return mockVideos;
    return mockVideos.filter((v) => v.genre === selectedGenre);
  }, [selectedGenre]);

  function handleOpenSearch() {
    setSearchInitialTab("video");
    setShowSearch(true);
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide bg-background">
      {/* Hero Banner with overlaid top bar (Netflix-style) */}
      <div className="relative">
        <HeroBanner video={featuredVideo} onMoreInfo={onSelectVideo} />

        {/* Top bar absolutely overlaid on hero so it doesn't push content down */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 xl:px-8 pt-4 pb-2 xl:pt-6">
          <h1 className="text-xl xl:text-2xl font-bold font-display text-white drop-shadow-sm">
            Space Media
          </h1>
          <div className="flex items-center gap-2">
            <StatusPill />
            <button
              type="button"
              onClick={handleOpenSearch}
              className="w-9 h-9 xl:w-10 xl:h-10 rounded-full flex items-center justify-center bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              aria-label="Search videos"
            >
              <Search className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Genre Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 xl:px-8 py-4 xl:py-5">
        {GENRES.map((genre) => (
          <button
            type="button"
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`shrink-0 px-4 py-1.5 xl:px-5 xl:py-2 rounded-full text-xs md:text-sm xl:text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-primary ${
              selectedGenre === genre
                ? "text-white shadow-glow-sm"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
            style={
              selectedGenre === genre
                ? {
                    background:
                      "linear-gradient(90deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
                  }
                : undefined
            }
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Content Rows */}
      {continueWatching.length > 0 && (
        <ContentRow
          title="Continue Watching"
          videos={continueWatching}
          showProgress
          onSelect={onSelectVideo}
        />
      )}

      <ContentRow
        title="Trending Now"
        videos={trending}
        onSelect={onSelectVideo}
      />

      {selectedGenre !== "All" && (
        <ContentRow
          title={`${selectedGenre} Films`}
          videos={genreFiltered}
          onSelect={onSelectVideo}
        />
      )}

      <ContentRow
        title="Recently Added"
        videos={recentlyAdded}
        onSelect={onSelectVideo}
      />

      {/* Spacer for mini player + bottom nav */}
      <div className="h-24 md:h-10" />
    </div>
  );
}
