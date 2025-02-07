import { useState, useEffect } from "react";
import { Doc } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

// Add type declarations for the File System Access API
declare global {
  interface Window {
    showDirectoryPicker(options?: {
      mode?: "read" | "readwrite";
    }): Promise<FileSystemDirectoryHandle>;
  }
}

type UseFileDownloadDragProps = {
  files: Doc<"files">[];
  singleFile?: boolean;
};

export function useFileDownloadDrag({
  files,
  singleFile,
}: UseFileDownloadDragProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);

  // Only use uploaded files
  const uploadedFiles = files.filter((f) => f.uploadState.kind === "uploaded");

  const downloadMultipleFiles = async () => {
    try {
      // Create a directory handle
      const dirHandle = await window.showDirectoryPicker({
        mode: "readwrite",
      });

      const toastId = toast.loading(
        `Downloading ${uploadedFiles.length} files...`,
        {
          description: "Starting download...",
        },
      );

      let completedFiles = 0;

      // Download each file and write it to the directory
      await Promise.all(
        uploadedFiles.map(async (file) => {
          if (file.uploadState.kind !== "uploaded") return;

          try {
            const response = await fetch(file.uploadState.url);
            const blob = await response.blob();

            const fileHandle = await dirHandle.getFileHandle(file.name, {
              create: true,
            });
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();

            completedFiles++;
            toast.loading(`Downloading ${uploadedFiles.length} files...`, {
              id: toastId,
              description: `Downloaded ${completedFiles} of ${uploadedFiles.length} files`,
            });
          } catch (error) {
            console.error(`Failed to download ${file.name}:`, error);
            toast.error(`Failed to download ${file.name}`);
          }
        }),
      );

      toast.success(`Downloaded ${completedFiles} files`, {
        id: toastId,
        description:
          completedFiles === uploadedFiles.length
            ? "All files downloaded successfully"
            : `${uploadedFiles.length - completedFiles} files failed to download`,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Failed to save files:", error);
        toast.error("Failed to download files", {
          description: error.message,
        });
      }
    }
    setShowDownloadDialog(false);
  };

  // Set up drag leave handler
  useEffect(() => {
    if (!isDragging || singleFile || uploadedFiles.length <= 1) return;

    const handleDragLeave = (e: DragEvent) => {
      // Only handle if actually leaving the window
      if (e.relatedTarget === null) {
        setShowDownloadDialog(true);
      }
    };

    window.addEventListener("dragleave", handleDragLeave);
    return () => window.removeEventListener("dragleave", handleDragLeave);
  }, [isDragging, singleFile, uploadedFiles.length]);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    if (!uploadedFiles.length) return;

    // If single file or only one file is selected, use simple format
    if (singleFile || uploadedFiles.length === 1) {
      const file = uploadedFiles[0];
      if (file.uploadState.kind === "uploaded") {
        e.dataTransfer.effectAllowed = "copy";
        e.dataTransfer.setData(
          "DownloadURL",
          `${file.type}:${file.name}:${file.uploadState.url}`,
        );

        // Show only success toast when drag ends
        const handleDragEnd = () => {
          toast.success(`Downloaded ${file.name}`);
          window.removeEventListener("dragend", handleDragEnd);
        };
        window.addEventListener("dragend", handleDragEnd, { once: true });
      }
      return;
    }

    // For multiple files, just set the effect
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/plain", "multiple files");
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return {
    isDragging,
    handleDragStart,
    handleDragEnd,
    showDownloadDialog,
    setShowDownloadDialog,
    downloadMultipleFiles,
    fileCount: uploadedFiles.length,
    canDownload: uploadedFiles.length > 0,
  };
}
