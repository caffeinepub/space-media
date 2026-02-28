import { useApp } from "@/AppContext";
import { Button } from "@/components/ui/button";
import type { VideoContent } from "@/types";
import { Info, Play } from "lucide-react";
import { motion } from "motion/react";

interface HeroBannerProps {
  video: VideoContent;
  onMoreInfo: (video: VideoContent) => void;
}

export default function HeroBanner({ video, onMoreInfo }: HeroBannerProps) {
  const { playVideo } = useApp();

  return (
    <div
      className="relative w-full
        h-[clamp(320px,72vw,400px)]
        md:h-[clamp(360px,48vw,460px)]
        lg:h-[clamp(430px,44vw,550px)]
        xl:h-[clamp(530px,42vw,650px)]
        2xl:h-[clamp(600px,40vw,740px)]"
    >
      {/* Backdrop image */}
      <img
        src={video.backdropUrl}
        alt={video.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />

      {/* Top gradient — keeps top bar text readable over the image */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, oklch(var(--background) / 0.65) 0%, transparent 38%)",
        }}
      />

      {/* Bottom gradient — fades image into content below */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 20%, oklch(var(--background) / 0.3) 55%, oklch(var(--background)) 100%)",
        }}
      />

      {/* Side gradient — improves text legibility on left */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, oklch(var(--background) / 0.85), transparent 65%)",
        }}
      />

      {/* Content — pt-14 ensures buttons stay below the overlaid top bar on mobile.
          pb-14 on mobile ensures the action buttons don't get hidden under the genre pills overlay. */}
      <div className="absolute inset-0 flex flex-col justify-end px-4 pb-14 pt-14 md:px-8 md:pb-16 md:pt-0 lg:px-10 lg:pb-14 xl:px-14 xl:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-xl xl:max-w-2xl"
        >
          {/* Genre badge */}
          <div className="flex items-center gap-2 mb-2 xl:mb-3">
            <span
              className="text-xs xl:text-sm font-bold px-2.5 py-0.5 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
                color: "white",
              }}
            >
              Featured
            </span>
            <span className="text-xs xl:text-sm text-white/70">
              {video.genre}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white font-display leading-tight mb-1 xl:mb-2">
            {video.title}
          </h2>

          {/* Description — visible on lg+ */}
          <p className="hidden lg:block text-sm xl:text-base text-white/70 leading-relaxed mb-3 line-clamp-2">
            {video.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-2 text-xs md:text-sm xl:text-base text-white/60 mb-3 xl:mb-5">
            <span>{video.year}</span>
            <span>·</span>
            <span>{video.rating}</span>
            <span>·</span>
            <span>{video.runtime}</span>
            {video.audioTracks && video.audioTracks.length > 1 && (
              <>
                <span>·</span>
                <span className="text-purple-300">
                  {video.audioTracks.length} languages
                </span>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 xl:gap-3">
            <Button
              onClick={() => playVideo(video)}
              className="h-9 md:h-10 xl:h-12 px-5 xl:px-7 font-semibold gap-1.5 focus-visible:ring-2 focus-visible:ring-white text-sm xl:text-base"
              style={{
                background: "rgba(255,255,255,0.95)",
                color: "#0a0a0a",
                border: "none",
              }}
            >
              <Play className="w-3.5 h-3.5 xl:w-4 xl:h-4 fill-current" />
              Play
            </Button>
            <Button
              onClick={() => onMoreInfo(video)}
              variant="outline"
              className="h-9 md:h-10 xl:h-12 px-5 xl:px-7 font-semibold gap-1.5 bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white text-sm xl:text-base"
            >
              <Info className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
              More Info
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
