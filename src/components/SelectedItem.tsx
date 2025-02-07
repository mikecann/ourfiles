import * as React from "react";
import { FileIcon } from "./FileIcon";
import { FileTooltip } from "./FileTooltip";
import { Doc } from "../../convex/_generated/dataModel";
import { useFileDownloadDrag } from "../hooks/useFileDownloadDrag";
import { MultiFileDownloadDialog } from "./MultiFileDownloadDialog";

type SelectedItemProps = {
  file: Doc<"files">;
  allSelectedFiles: Doc<"files">[];
  onDragEnd: (newPosition: { x: number; y: number }) => void;
  onDelete?: () => void;
  onClick: (e: React.MouseEvent) => void;
  disableTooltip?: boolean;
};

export const SelectedItem: React.FC<SelectedItemProps> = ({
  file,
  allSelectedFiles,
  onDragEnd,
  onDelete,
  disableTooltip,
  onClick,
}) => {
  const [dragPosition, setDragPosition] = React.useState({ x: 0, y: 0 });
  const [mouseOffset, setMouseOffset] = React.useState({ x: 0, y: 0 });
  const [isInternalDragging, setIsInternalDragging] = React.useState(false);
  const {
    isDragging,
    handleDragStart: handleExternalDragStart,
    handleDragEnd: handleExternalDragEnd,
    canDownload,
    showDownloadDialog,
    setShowDownloadDialog,
    downloadMultipleFiles,
    fileCount,
  } = useFileDownloadDrag({
    files: allSelectedFiles.length > 1 ? allSelectedFiles : [file],
    singleFile: allSelectedFiles.length === 1,
  });

  const handleDragStart = (e: React.DragEvent) => {
    if (!canDownload) return;
    setIsInternalDragging(true);
    // Calculate offset between mouse position and element position
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setMouseOffset({ x: offsetX, y: offsetY });

    setDragPosition({
      x: e.clientX - offsetX + 20,
      y: e.clientY - offsetY + 20,
    });

    // Handle external drag and drop
    handleExternalDragStart(e);

    // Create a transparent drag image
    const dragImage = new Image();
    dragImage.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  const handleDrag = (e: React.DragEvent) => {
    if (!e.clientX || !e.clientY) return;

    setDragPosition({
      x: e.clientX - mouseOffset.x + 20,
      y: e.clientY - mouseOffset.y + 20,
    });
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsInternalDragging(false);
    handleExternalDragEnd();
    // Only update position if dropped inside the window
    if (
      e.clientX > 0 &&
      e.clientY > 0 &&
      e.clientX < window.innerWidth &&
      e.clientY < window.innerHeight
    )
      onDragEnd({
        x: e.clientX - mouseOffset.x + 20,
        y: e.clientY - mouseOffset.y + 20,
      });
  };

  return (
    <>
      <FileIcon
        file={file}
        isSelected={true}
        onClick={onClick}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        draggable={canDownload}
        tooltip={
          !disableTooltip && !isDragging ? (
            <FileTooltip
              key={file._id}
              fileId={file._id}
              name={file.name}
              size={file.size}
              type={file.type}
              onDelete={onDelete}
            />
          ) : undefined
        }
      />
      {isInternalDragging && (
        <FileIcon
          file={{
            ...file,
            position: dragPosition,
          }}
          isSelected={true}
          style={{ opacity: 0.5, pointerEvents: "none" }}
        />
      )}

      <MultiFileDownloadDialog
        open={showDownloadDialog}
        onOpenChange={setShowDownloadDialog}
        onConfirm={downloadMultipleFiles}
        fileCount={fileCount}
      />
    </>
  );
};
