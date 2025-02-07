import * as React from "react";
import { FileIcon } from "./FileIcon";
import { FileTooltip } from "./FileTooltip";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { useFileDownloadDrag } from "../hooks/useFileDownloadDrag";
import { MultiFileDownloadDialog } from "./MultiFileDownloadDialog";
import { toast } from "sonner";

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

  // Calculate relative positions of all files to the dragged file
  const relativePositions = React.useMemo(() => {
    if (allSelectedFiles.length <= 1) return [];
    const baseX = file.position.x;
    const baseY = file.position.y;
    return allSelectedFiles
      .filter((f) => f._id !== file._id)
      .map((f) => ({
        id: f._id,
        offsetX: f.position.x - baseX,
        offsetY: f.position.y - baseY,
      }));
  }, [allSelectedFiles, file]);

  const handleDragStart = (e: React.DragEvent) => {
    if (!canDownload) return;
    setIsInternalDragging(true);
    // Calculate offset between mouse position and element position
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setMouseOffset({ x: offsetX, y: offsetY });

    const newPosition = {
      x: e.clientX - offsetX + 20,
      y: e.clientY - offsetY + 20,
    };
    setDragPosition(newPosition);

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

    const newPosition = {
      x: e.clientX - mouseOffset.x + 20,
      y: e.clientY - mouseOffset.y + 20,
    };
    setDragPosition(newPosition);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsInternalDragging(false);

    // If dropped inside the window, update positions
    if (
      e.clientX > 0 &&
      e.clientY > 0 &&
      e.clientX < window.innerWidth &&
      e.clientY < window.innerHeight
    ) {
      const newPosition = {
        x: e.clientX - mouseOffset.x + 20,
        y: e.clientY - mouseOffset.y + 20,
      };

      // Create updates for all selected files
      const updates: { id: Id<"files">; position: { x: number; y: number } }[] =
        [
          { id: file._id, position: newPosition },
          ...relativePositions.map(({ id, offsetX, offsetY }) => ({
            id,
            position: {
              x: newPosition.x + offsetX,
              y: newPosition.y + offsetY,
            },
          })),
        ];
      onDragEnd(updates);
    } else {
      // Only handle external drag end when dropping outside the window
      handleExternalDragEnd();
      // Show download toast only when dragging outside
      if (allSelectedFiles.length === 1) {
        toast.success(`Downloaded ${file.name}`);
      }
    }
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
        <>
          <FileIcon
            file={{
              ...file,
              position: dragPosition,
            }}
            isSelected={true}
            style={{ opacity: 0.5, pointerEvents: "none" }}
          />
          {relativePositions.map(({ id, offsetX, offsetY }) => {
            const relativeFile = allSelectedFiles.find((f) => f._id === id);
            if (!relativeFile) return null;
            return (
              <FileIcon
                key={id}
                file={{
                  ...relativeFile,
                  position: {
                    x: dragPosition.x + offsetX,
                    y: dragPosition.y + offsetY,
                  },
                }}
                isSelected={true}
                style={{ opacity: 0.5, pointerEvents: "none" }}
              />
            );
          })}
        </>
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
