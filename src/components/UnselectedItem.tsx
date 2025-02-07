import * as React from "react";
import { FileIcon } from "./FileIcon";
import { Doc } from "../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type UnselectedItemProps = {
  file: Doc<"files">;
  onClick: (e: React.MouseEvent) => void;
};

export const UnselectedItem: React.FC<UnselectedItemProps> = ({
  file,
  onClick,
}) => {
  const downloadUrl = useQuery(api.files.getDownloadUrl, { id: file._id });
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    // Set up the drag data for external drops
    if (downloadUrl && file.uploadState.kind === "uploaded") {
      e.dataTransfer.effectAllowed = "copy";
      e.dataTransfer.setData(
        "DownloadURL",
        `${file.type}:${file.name}:${downloadUrl}`,
      );
    }
  };

  return (
    <FileIcon
      file={file}
      onMouseDown={onClick}
      isSelected={false}
      onDragStart={handleDragStart}
      onDragEnd={() => setIsDragging(false)}
      draggable={true}
    />
  );
};
