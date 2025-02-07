import { useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";

type UseFileDownloadDragProps = {
  files: Doc<"files">[];
  singleFile?: boolean;
};

export function useFileDownloadDrag({
  files,
  singleFile,
}: UseFileDownloadDragProps) {
  const [isDragging, setIsDragging] = useState(false);

  // Only use uploaded files
  const uploadedFiles = files.filter((f) => f.uploadState.kind === "uploaded");

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    if (!uploadedFiles.length) return;

    e.dataTransfer.effectAllowed = "copy";

    // If single file or only one file is selected, use simple format
    if (singleFile || uploadedFiles.length === 1) {
      const file = uploadedFiles[0];
      if (file.uploadState.kind === "uploaded") {
        e.dataTransfer.setData(
          "DownloadURL",
          `${file.type}:${file.name}:${file.uploadState.url}`,
        );
      }
      return;
    }

    // For multiple files, combine all download URLs
    const downloadList = uploadedFiles
      .map((file) => {
        if (file.uploadState.kind !== "uploaded") return null;
        return `${file.type}:${file.name}:${file.uploadState.url}`;
      })
      .filter(Boolean);

    if (downloadList.length) {
      e.dataTransfer.setData("DownloadURL", downloadList.join("\n"));
    }
  };

  const handleDragEnd = () => setIsDragging(false);

  return {
    isDragging,
    handleDragStart,
    handleDragEnd,
    canDownload: uploadedFiles.length > 0,
  };
}
