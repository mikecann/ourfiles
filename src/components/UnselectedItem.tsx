import * as React from "react";
import { FileIcon } from "./FileIcon";
import { Doc } from "../../convex/_generated/dataModel";
import { useFileDownloadDrag } from "../hooks/useFileDownloadDrag";

type UnselectedItemProps = {
  file: Doc<"files">;
  onClick: (e: React.MouseEvent) => void;
  isDragSelecting?: boolean;
};

export const UnselectedItem: React.FC<UnselectedItemProps> = ({
  file,
  onClick,
  isDragSelecting,
}) => {
  const { handleDragStart, handleDragEnd, canDownload } = useFileDownloadDrag({
    files: [file],
    singleFile: true,
  });

  return (
    <FileIcon
      file={file}
      onMouseDown={onClick}
      isSelected={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      draggable={canDownload}
      animate={true}
      disableTooltip={isDragSelecting}
    />
  );
};
