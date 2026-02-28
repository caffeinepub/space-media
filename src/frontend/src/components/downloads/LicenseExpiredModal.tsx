import { useApp } from "@/AppContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DownloadedItem } from "@/types";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface LicenseExpiredModalProps {
  item: DownloadedItem | null;
  onClose: () => void;
}

export default function LicenseExpiredModal({
  item,
  onClose,
}: LicenseExpiredModalProps) {
  const { isConnected, renewDownload } = useApp();

  function handleRenew() {
    if (!item || !isConnected) return;
    renewDownload(item.id);
    toast.success(`License renewed for "${item.title}"`);
    onClose();
  }

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-destructive/15 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <DialogTitle className="text-lg">License Expired</DialogTitle>
          </div>
          <DialogDescription className="text-sm leading-relaxed">
            This downloaded content's offline license has expired. Reconnect to
            the local server to renew.
          </DialogDescription>
        </DialogHeader>

        {item && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
            <img
              src={item.artworkUrl}
              alt={item.title}
              className="w-10 h-10 rounded-md object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {item.mediaType}
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 flex-row">
          <Button variant="outline" onClick={onClose} className="flex-1">
            OK
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex-1">
                  <Button
                    onClick={handleRenew}
                    disabled={!isConnected}
                    className="w-full gap-2"
                    style={
                      isConnected
                        ? {
                            background:
                              "linear-gradient(135deg, oklch(var(--theme-accent)), oklch(var(--theme-accent-2)))",
                            border: "none",
                            color: "white",
                          }
                        : undefined
                    }
                  >
                    <RefreshCw className="w-4 h-4" />
                    Renew
                  </Button>
                </span>
              </TooltipTrigger>
              {!isConnected && (
                <TooltipContent>
                  <p>Connect to server to renew</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
