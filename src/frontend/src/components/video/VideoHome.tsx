import { useApp } from "@/AppContext";
import StatusPill from "@/components/shared/StatusPill";
import { mockVideos } from "@/mockData";
import type { VideoContent } from "@/types";
import { Search, Star } from "lucide-react";
import { motion } from "motion/react";
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
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h1 className="text-xl font-bold font-display gradient-text">
          Space Media
        </h1>
        <div className="flex items-center gap-2">
          <StatusPill />
          <button
            type="button"
            onClick={handleOpenSearch}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-secondary hover:bg-muted transition-colors"
            aria-label="Search videos"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <HeroBanner video={featuredVideo} onMoreInfo={onSelectVideo} />

      {/* Genre Filter */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-4">
        {GENRES.map((genre) => (
          <button
            type="button"
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
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
      <div className="h-24" />
    </div>
  );
}
