import * as React from "react";
import { FileIcon } from "./FileIcon";
import type { DroppedFile } from "./FileUpload";

type SelectedItemProps = {
  droppedFile: DroppedFile;
  onDragEnd: (newPosition: { x: number; y: number }) => void;
};

export const SelectedItem: React.FC<SelectedItemProps> = ({
  droppedFile,
  onDragEnd,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragPosition, setDragPosition] = React.useState({ x: 0, y: 0 });
  const [mouseOffset, setMouseOffset] = React.useState({ x: 0, y: 0 });

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);

    // Calculate offset between mouse position and element position
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setMouseOffset({ x: offsetX, y: offsetY });

    setDragPosition({
      x: e.clientX - offsetX + 20, // Add back the centering offset from FileIcon
      y: e.clientY - offsetY + 20,
    });

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
    setIsDragging(false);
    onDragEnd({
      x: e.clientX - mouseOffset.x + 20,
      y: e.clientY - mouseOffset.y + 20,
    });
  };

  return (
    <>
      <FileIcon
        file={droppedFile.file}
        position={droppedFile.position}
        isSelected={true}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      />
      {isDragging && (
        <FileIcon
          file={droppedFile.file}
          position={dragPosition}
          isSelected={true}
          style={{ opacity: 0.5, pointerEvents: "none" }}
        />
      )}
    </>
  );
};
