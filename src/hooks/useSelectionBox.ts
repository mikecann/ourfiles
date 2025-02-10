import * as React from "react";
import { Id } from "../../convex/_generated/dataModel";

type Position = { x: number; y: number };

export const useSelectionBox = ({
  files,
  onSelectionChange,
}: {
  files: { _id: Id<"files">; position: Position }[];
  onSelectionChange: (selectedIds: Set<Id<"files">>) => void;
}) => {
  const [isDragSelecting, setIsDragSelecting] = React.useState(false);
  const [selectionStart, setSelectionStart] = React.useState<Position>({
    x: 0,
    y: 0,
  });
  const [selectionCurrent, setSelectionCurrent] = React.useState<Position>({
    x: 0,
    y: 0,
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    if (e.button !== 0 || e.target !== e.currentTarget) return;
    setIsDragSelecting(true);
    setSelectionStart({ x: e.pageX, y: e.pageY });
    setSelectionCurrent({ x: e.pageX, y: e.pageY });
    onSelectionChange(new Set());
  };

  const updateSelection = (current: Position) => {
    // Calculate selection box bounds
    const left = Math.min(selectionStart.x, current.x);
    const right = Math.max(selectionStart.x, current.x);
    const top = Math.min(selectionStart.y, current.y);
    const bottom = Math.max(selectionStart.y, current.y);

    // Find files that intersect with the selection box
    const selectedIds = new Set<Id<"files">>();
    for (const file of files) {
      const fileLeft = file.position.x - 20;
      const fileRight = file.position.x + 20;
      const fileTop = file.position.y - 20;
      const fileBottom = file.position.y + 20;

      if (
        fileLeft < right &&
        fileRight > left &&
        fileTop < bottom &&
        fileBottom > top
      )
        selectedIds.add(file._id);
    }
    onSelectionChange(selectedIds);
  };

  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragSelecting) return;

      // Clamp coordinates to window boundaries
      const x = Math.max(0, Math.min(e.pageX, window.innerWidth));
      const y = Math.max(0, Math.min(e.pageY, window.innerHeight));

      setSelectionCurrent({ x, y });
      updateSelection({ x, y });
    };

    const handleGlobalMouseUp = () => setIsDragSelecting(false);

    if (isDragSelecting) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragSelecting, selectionStart, files]);

  return {
    isDragSelecting,
    selectionStart,
    selectionCurrent,
    handleMouseDown,
  };
};
