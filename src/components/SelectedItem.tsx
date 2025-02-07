import * as React from "react";
import { FileIcon } from "./FileIcon";
import { FileTooltip } from "./FileTooltip";
import { Doc } from "../../convex/_generated/dataModel";
import { useFileDownloadDrag } from "../hooks/useFileDownloadDrag";

type SelectedItemProps = {
  file: Doc<"files">;
  onDragEnd: (newPosition: { x: number; y: number }) => void;
  onDelete?: () => void;
};

export const SelectedItem: React.FC<SelectedItemProps> = ({
  file,
  onDragEnd,
  onDelete,
}) => {
  const [dragPosition, setDragPosition] = React.useState({ x: 0, y: 0 });
  const [mouseOffset, setMouseOffset] = React.useState({ x: 0, y: 0 });
  const {
    isDragging,
    handleDragStart: handleExternalDragStart,
    handleDragEnd: handleExternalDragEnd,
  } = useFileDownloadDrag({ file });

  const handleDragStart = (e: React.DragEvent) => {
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
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        tooltip={
          isDragging ? undefined : (
            <FileTooltip
              key={file._id}
              fileId={file._id}
              name={file.name}
              size={file.size}
              type={file.type}
              onDelete={onDelete}
            />
          )
        }
      />
      {isDragging && (
        <FileIcon
          file={file}
          isSelected={true}
          style={{ opacity: 0.5, pointerEvents: "none" }}
        />
      )}
    </>
  );
};
