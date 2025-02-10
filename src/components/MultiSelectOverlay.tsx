import * as React from "react";
import { Doc } from "../../convex/_generated/dataModel";
import { formatFileSize } from "../utils/formatters";

type MultiSelectOverlayProps = {
  files: Doc<"files">[];
};

export const MultiSelectOverlay: React.FC<MultiSelectOverlayProps> = ({
  files,
}) => {
  // Calculate bounding box of all selected files
  const bounds = React.useMemo(() => {
    if (files.length === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    const ICON_SIZE = 20; // Half of icon width/height
    const NAME_WIDTH = 50; // Half of max filename width (100px)
    const NAME_HEIGHT = 20; // Height of the filename text
    const PADDING = 10; // Padding around the selection
    const EXTRA_RIGHT_PADDING = 5; // Extra padding for the right side

    files.forEach((file) => {
      minX = Math.min(minX, file.position.x - ICON_SIZE);
      minY = Math.min(minY, file.position.y - ICON_SIZE);
      maxX = Math.max(maxX, file.position.x + NAME_WIDTH + EXTRA_RIGHT_PADDING);
      maxY = Math.max(maxY, file.position.y + ICON_SIZE + NAME_HEIGHT);
    });

    return {
      left: minX - PADDING,
      top: minY - PADDING,
      width: maxX - minX + PADDING * 2,
      height: maxY - minY + PADDING * 2,
    };
  }, [files]);

  if (!bounds || files.length <= 1) return null;

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <>
      {/* Dotted selection box */}
      <div
        className="absolute border-2 border-dashed border-blue-300 rounded-lg pointer-events-none select-none"
        style={{
          left: bounds.left,
          top: bounds.top,
          width: bounds.width,
          height: bounds.height,
        }}
      />
      {/* Multi-select tooltip */}
      <div
        className="absolute bg-white rounded-lg shadow-lg p-2 border text-sm pointer-events-none select-none z-10"
        style={{
          left: bounds.left + bounds.width / 2,
          top: bounds.top - 10,
          transform: "translate(-50%, -100%)",
        }}
      >
        <div className="flex flex-col items-center">
          <div className="font-medium text-gray-600 select-none">
            {files.length} {files.length === 1 ? "file" : "files"} selected
          </div>
          <div className="text-gray-500 text-xs">
            Total size: {formatFileSize(totalSize)}
          </div>
        </div>
      </div>
    </>
  );
};
