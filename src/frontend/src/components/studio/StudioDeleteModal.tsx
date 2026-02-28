import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface StudioDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemTitle: string;
}

export default function StudioDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemTitle,
}: StudioDeleteModalProps) {
  function handleConfirm() {
    onConfirm();
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-card border-border max-w-sm mx-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-destructive/15 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <DialogTitle className="text-foreground text-left">
              Delete content?
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-left leading-relaxed">
            This will permanently remove{" "}
            <span className="font-semibold text-foreground">
              &quot;{itemTitle}&quot;
            </span>{" "}
            from the server. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-2 mt-2">
          <Button variant="ghost" onClick={onClose} className="flex-1 h-10">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="flex-1 h-10 bg-destructive hover:bg-destructive/90"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
