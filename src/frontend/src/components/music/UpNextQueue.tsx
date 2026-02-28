import { useApp } from "@/AppContext";
import { formatDuration } from "@/mockData";
import type { MusicTrack } from "@/types";
import { ChevronDown, Music } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface UpNextQueueProps {
  queue: MusicTrack[];
  currentTrackId: string | null;
  isOpen: boolean;
  onToggle: () => void;
}

export default function UpNextQueue({
  queue,
  currentTrackId,
  isOpen,
  onToggle,
}: UpNextQueueProps) {
  const { playTrack } = useApp();

  const currentIdx = queue.findIndex((t) => t.id === currentTrackId);
  const upNext = queue.slice(currentIdx + 1, currentIdx + 8);

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full py-3 text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded"
      >
        <span className="text-sm font-semibold">Up Next</span>
        <motion.div
          animate={{ rotate: isOpen ? 0 : -90 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {upNext.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground opacity-60">
                <Music className="w-6 h-6" />
                <p className="text-xs">No more tracks in queue</p>
              </div>
            ) : (
              <div className="space-y-1">
                {upNext.map((track, i) => (
                  <motion.button
                    key={track.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => playTrack(track, queue)}
                    className="w-full flex items-center gap-3 py-2 px-1 rounded-lg hover:bg-secondary/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <img
                      src={track.albumArt}
                      alt={track.album}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate text-foreground">
                        {track.title}
                      </p>
                      <p className="text-xs truncate text-muted-foreground">
                        {track.artist}
                      </p>
                    </div>
                    <span className="text-xs shrink-0 text-muted-foreground">
                      {formatDuration(track.duration)}
                    </span>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
