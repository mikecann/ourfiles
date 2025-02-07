import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";

export function useFileDownloadDrag({ file }: { file: Doc<"files"> }) {
  const [isDragging, setIsDragging] = useState(false);
  const downloadUrl = useQuery(api.files.getDownloadUrl, { id: file._id });

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    if (downloadUrl && file.uploadState.kind === "uploaded") {
      e.dataTransfer.effectAllowed = "copy";
      e.dataTransfer.setData(
        "DownloadURL",
        `${file.type}:${file.name}:${downloadUrl}`,
      );
    }
  };

  const handleDragEnd = () => setIsDragging(false);

  return {
    isDragging,
    handleDragStart,
    handleDragEnd,
  };
}
