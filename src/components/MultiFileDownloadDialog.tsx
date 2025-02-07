import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

type MultiFileDownloadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  fileCount: number;
};

export const MultiFileDownloadDialog: React.FC<
  MultiFileDownloadDialogProps
> = ({ open, onOpenChange, onConfirm, fileCount }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-[400px]">
      <DialogHeader>
        <DialogTitle>Download {fileCount} Files</DialogTitle>
        <DialogDescription>
          To download multiple files, you'll need to select a destination
          folder. Click continue to choose where to save the files.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex flex-row gap-2">
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button className="flex-1" onClick={onConfirm}>
          Continue
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
