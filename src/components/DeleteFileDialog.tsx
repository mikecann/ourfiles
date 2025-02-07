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

type DeleteFileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  fileCount: number;
};

export const DeleteFileDialog: React.FC<DeleteFileDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  fileCount,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-[300px]">
      <DialogHeader>
        <DialogTitle>
          Delete {fileCount > 1 ? `${fileCount} Files` : "File"}
        </DialogTitle>
        <DialogDescription>
          {fileCount > 1
            ? `Are you sure you want to delete these ${fileCount} files? This action cannot be undone.`
            : "Are you sure you want to delete this file? This action cannot be undone."}
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
        <Button className="flex-1" variant="destructive" onClick={onConfirm}>
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
