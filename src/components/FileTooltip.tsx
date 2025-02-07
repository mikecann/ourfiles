import * as React from "react";

type FileTooltipProps = {
  file: File;
  position: { x: number; y: number };
};

export const FileTooltip: React.FC<FileTooltipProps> = ({ file, position }) => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: position.x,
        top: position.y - 80, // Position above the file icon
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-3 border text-sm">
        <div className="flex flex-col gap-1">
          <div className="text-gray-600">
            Size: {(file.size / 1024).toFixed(1)} KB
          </div>
          <div className="text-gray-600">Type: {file.type || "Unknown"}</div>
        </div>
      </div>
      {/* Triangle pointer */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
        style={{
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: "8px solid white",
        }}
      />
    </div>
  );
};
