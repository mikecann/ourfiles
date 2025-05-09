import * as React from "react";
import { FileIcon } from "./FileIcon";
import { FileTooltip } from "./FileTooltip";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { useFileDownloadDrag } from "../hooks/useFileDownloadDrag";
import { MultiFileDownloadDialog } from "./MultiFileDownloadDialog";
import { toast } from "sonner";
import { useDragPosition } from "../hooks/useDragPosition";
import { FileGhostPreview } from "./FileGhostPreview";
import useIsMobile from "@/hooks/useIsMobile";

type SelectedItemProps = {
  file: Doc<"files">;
  allSelectedFiles: Doc<"files">[];
  onDragEnd: (
    updates: { id: Id<"files">; position: { x: number; y: number } }[],
  ) => void;
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
  const {
    isDragging: isExternalDragging,
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

  const {
    dragPosition,
    isDragging: isInternalDragging,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    relativePositions,
  } = useDragPosition({
    basePosition: file.position,
    baseId: file._id,
    relativeFiles: allSelectedFiles.map((f) => ({
      id: f._id,
      position: f.position,
    })),
    onDragEnd,
  });

  const handleDragStartWrapper = (e: React.DragEvent) => {
    handleDragStart(e);
    if (canDownload) handleExternalDragStart(e);
  };

  const handleDragEndWrapper = (e: React.DragEvent) => {
    handleDragEnd(e);

    // Only handle external drag end when dropping outside the window
    if (
      e.clientX <= 0 ||
      e.clientY <= 0 ||
      e.clientX >= window.innerWidth ||
      e.clientY >= window.innerHeight
    ) {
      handleExternalDragEnd();
      if (allSelectedFiles.length === 1)
        toast.success(`Downloaded ${file.name}`);
    }
  };

  const isMobile = useIsMobile();
  const isTooltipOpen =
    !disableTooltip && !isExternalDragging && !isInternalDragging;
  const isDragDisabled = isMobile && !isTooltipOpen;

  return (
    <>
      <FileIcon
        file={file}
        isSelected={true}
        onClick={onClick}
        onDragStart={isDragDisabled ? undefined : handleDragStartWrapper}
        onDrag={isDragDisabled ? undefined : handleDrag}
        onDragEnd={isDragDisabled ? undefined : handleDragEndWrapper}
        onTouchStart={isDragDisabled ? undefined : handleDragStart}
        onTouchMove={isDragDisabled ? undefined : handleDrag}
        onTouchEnd={isDragDisabled ? undefined : handleDragEnd}
        draggable={true}
        animate={false}
        tooltip={
          isTooltipOpen ? (
            <FileTooltip
              key={file._id}
              fileId={file._id}
              name={file.name}
              size={file.size}
              type={file.type}
              onDelete={onDelete}
              uploadState={file.uploadState}
            />
          ) : undefined
        }
      />

      {isInternalDragging && (
        <FileGhostPreview
          file={file}
          dragPosition={dragPosition}
          relativePositions={relativePositions}
          allSelectedFiles={allSelectedFiles}
        />
      )}

      <MultiFileDownloadDialog
        open={showDownloadDialog}
        onOpenChange={setShowDownloadDialog}
        onConfirm={() => void downloadMultipleFiles()}
        fileCount={fileCount}
      />
    </>
  );
};
