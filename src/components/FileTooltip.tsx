import * as React from "react";

type FileTooltipProps = {
  name: string;
  size: number;
  type: string;
};

export const FileTooltip: React.FC<FileTooltipProps> = ({ size, type }) => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 -top-1 -translate-y-full pointer-events-none flex flex-col items-center animate-popIn">
      <div className="bg-white rounded-lg shadow-lg p-3 border text-sm w-[200px]">
        <div className="flex flex-col gap-1">
          <div className="text-gray-600">
            Size: {(size / 1024).toFixed(1)} KB
          </div>
          <div className="text-gray-600">Type: {type || "Unknown"}</div>
        </div>
      </div>
      {/* Triangle pointer */}
      <div
        className="w-0 h-0"
        style={{
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: "8px solid white",
        }}
      />
    </div>
  );
};
