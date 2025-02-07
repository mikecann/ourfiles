import * as React from "react";
import { FileIcon } from "./FileIcon";
import type { DroppedFile } from "./FileUpload";

type SelectedItemProps = {
  droppedFile: DroppedFile;
  onClick: (e: React.MouseEvent) => void;
  onDragEnd: (newPosition: { x: number; y: number }) => void;
};

export const SelectedItem: React.FC<SelectedItemProps> = ({
  droppedFile,
  onClick,
  onDragEnd,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragPosition, setDragPosition] = React.useState({ x: 0, y: 0 });

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    setDragPosition({ x: e.clientX, y: e.clientY });

    // Create a transparent drag image
    const dragImage = new Image();
    dragImage.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  const handleDrag = (e: React.DragEvent) => {
    if (e.clientX && e.clientY) setDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    onDragEnd({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <FileIcon
        file={droppedFile.file}
        position={droppedFile.position}
        isSelected={true}
        onClick={onClick}
        style={{ pointerEvents: "auto" }}
      />
      {isDragging && (
        <FileIcon
          file={droppedFile.file}
          position={dragPosition}
          isSelected={true}
          style={{ opacity: 0.5, pointerEvents: "none" }}
        />
      )}
      <div
        className="absolute"
        style={{
          left: droppedFile.position.x - 20,
          top: droppedFile.position.y - 20,
          width: "40px",
          height: "40px",
          cursor: "move",
        }}
        draggable
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      />
    </>
  );
};
