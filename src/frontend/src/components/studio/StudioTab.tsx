import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clapperboard, Film, Library, Music, Plus } from "lucide-react";
import { useState } from "react";
import StudioEditMusic from "./StudioEditMusic";
import StudioEditVideo from "./StudioEditVideo";
import StudioLibrary from "./StudioLibrary";
import StudioUploadMusic from "./StudioUploadMusic";
import StudioUploadVideo from "./StudioUploadVideo";

type StudioView =
  | { screen: "library" }
  | { screen: "upload-video" }
  | { screen: "upload-music" }
  | { screen: "edit-video"; id: string }
  | { screen: "edit-music"; id: string };

export default function StudioTab() {
  const [view, setView] = useState<StudioView>({ screen: "library" });

  const goLibrary = () => setView({ screen: "library" });

  const isLibrary = view.screen === "library";

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Studio Top Bar */}
      {isLibrary && (
        <div
          className="flex items-center justify-between px-4 lg:px-6 xl:px-8 py-3 xl:py-4 border-b border-border shrink-0"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.14 0.04 290 / 0.8), oklch(0.12 0.02 270 / 0.6))",
          }}
        >
          <div className="flex items-center gap-2 xl:gap-3">
            <div className="w-8 h-8 xl:w-10 xl:h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Clapperboard className="w-4 h-4 xl:w-5 xl:h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-sm xl:text-base font-bold text-foreground leading-none">
                Studio
              </h1>
              <p className="text-[10px] xl:text-xs text-muted-foreground">
                Manager Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="h-8 xl:h-9 text-xs xl:text-sm gap-1.5 bg-purple-600 hover:bg-purple-700 text-white border-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Upload
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-card border-border"
              >
                <DropdownMenuItem
                  onClick={() => setView({ screen: "upload-video" })}
                  className="gap-2 text-sm"
                >
                  <Film className="w-4 h-4 text-purple-400" />
                  Upload Video
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setView({ screen: "upload-music" })}
                  className="gap-2 text-sm"
                >
                  <Music className="w-4 h-4 text-purple-400" />
                  Upload Music
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      {isLibrary && (
        <div className="flex items-center gap-1 px-4 lg:px-6 xl:px-8 py-2 border-b border-border shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold">
            <Library className="w-3.5 h-3.5" />
            Content Library
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {view.screen === "library" && (
          <StudioLibrary
            onEditVideo={(id) => setView({ screen: "edit-video", id })}
            onEditMusic={(id) => setView({ screen: "edit-music", id })}
          />
        )}
        {view.screen === "upload-video" && (
          <StudioUploadVideo onBack={goLibrary} />
        )}
        {view.screen === "upload-music" && (
          <StudioUploadMusic onBack={goLibrary} />
        )}
        {view.screen === "edit-video" && (
          <StudioEditVideo id={view.id} onBack={goLibrary} />
        )}
        {view.screen === "edit-music" && (
          <StudioEditMusic id={view.id} onBack={goLibrary} />
        )}
      </div>
    </div>
  );
}
