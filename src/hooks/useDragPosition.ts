import * as React from "react";
import { Id } from "../../convex/_generated/dataModel";

type Position = { x: number; y: number };
type FileUpdate = { id: Id<"files">; position: Position };
type RelativePosition = { id: Id<"files">; offsetX: number; offsetY: number };

export const useDragPosition = ({
  basePosition,
  baseId,
  relativeFiles,
  onDragEnd,
}: {
  basePosition: Position;
  baseId: Id<"files">;
  relativeFiles: { id: Id<"files">; position: Position }[];
  onDragEnd: (updates: FileUpdate[]) => void;
}) => {
  const [dragPosition, setDragPosition] = React.useState<Position>({
    x: 0,
    y: 0,
  });
  const [mouseOffset, setMouseOffset] = React.useState<Position>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = React.useState(false);

  // Calculate relative positions of all files to the dragged file
  const relativePositions = React.useMemo<RelativePosition[]>(() => {
    if (relativeFiles.length === 0) return [];
    return relativeFiles
      .filter((f) => f.id !== baseId)
      .map((f) => ({
        id: f.id,
        offsetX: f.position.x - basePosition.x,
        offsetY: f.position.y - basePosition.y,
      }));
  }, [relativeFiles, basePosition, baseId]);

  const handleDragStart = (e: React.DragEvent | React.TouchEvent) => {
    setIsDragging(true);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;
    setMouseOffset({ x: offsetX, y: offsetY });

    const newPosition = {
      x: clientX - offsetX + 20,
      y: clientY - offsetY + 20,
    };
    setDragPosition(newPosition);

    if ("dataTransfer" in e) {
      const dragImage = new Image();
      dragImage.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      e.dataTransfer.setDragImage(dragImage, 0, 0);
    }
  };

  const handleDrag = (e: React.DragEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    // Skip if no coordinates (can happen during drag)
    if (!clientX || !clientY) return;

    const newPosition = {
      x: clientX - mouseOffset.x + 20,
      y: clientY - mouseOffset.y + 20,
    };
    setDragPosition(newPosition);
  };

  const handleDragEnd = (e: React.DragEvent | React.TouchEvent) => {
    setIsDragging(false);

    const clientX =
      "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY =
      "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;

    // If dropped inside the window, update positions
    if (
      clientX > 0 &&
      clientY > 0 &&
      clientX < window.innerWidth &&
      clientY < window.innerHeight
    ) {
      const newPosition = {
        x: clientX - mouseOffset.x + 20,
        y: clientY - mouseOffset.y + 20,
      };

      // Create updates for all selected files
      const updates: FileUpdate[] = [
        { id: baseId, position: newPosition },
        ...relativePositions.map(({ id, offsetX, offsetY }) => ({
          id,
          position: {
            x: newPosition.x + offsetX,
            y: newPosition.y + offsetY,
          },
        })),
      ];
      onDragEnd(updates);
    }
  };

  return {
    dragPosition,
    isDragging,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    relativePositions,
  };
};
