import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";

type UseFileDownloadDragProps = {
  files: Doc<"files">[];
  singleFile?: boolean;
};

export function useFileDownloadDrag({
  files,
  singleFile,
}: UseFileDownloadDragProps) {
  const [isDragging, setIsDragging] = useState(false);

  // Only fetch URLs for uploaded files
  const uploadedFiles = files.filter((f) => f.uploadState.kind === "uploaded");
  const downloadUrls = useQuery(api.files.getDownloadUrl, {
    ids: uploadedFiles.map((f) => f._id),
  });

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    if (!downloadUrls?.length || !uploadedFiles.length) return;

    e.dataTransfer.effectAllowed = "copy";

    // If single file or only one file is selected, use simple format
    if (singleFile || uploadedFiles.length === 1) {
      const file = uploadedFiles[0];
      const url = downloadUrls[0];
      if (url) {
        e.dataTransfer.setData(
          "DownloadURL",
          `${file.type}:${file.name}:${url}`,
        );
      }
      return;
    }

    // For multiple files, combine all download URLs
    const downloadList = uploadedFiles
      .map((file, i) => {
        if (!downloadUrls[i]) return null;
        return `${file.type}:${file.name}:${downloadUrls[i]}`;
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
    canDownload: !!(downloadUrls?.length && uploadedFiles.length),
  };
}
