import * as React from "react";

type FileIconProps = {
  file: File;
  position: { x: number; y: number };
};

export const FileIcon: React.FC<FileIconProps> = ({ file, position }) => {
  return (
    <div
      className="absolute flex flex-col items-center gap-1"
      style={{
        left: position.x - 20, // Center the icon on drop position
        top: position.y - 20,
      }}
    >
      <div className="w-10 h-10 bg-white rounded-lg shadow-sm border flex items-center justify-center">
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </div>
      <span className="text-xs text-gray-600 max-w-[100px] truncate">
        {file.name}
      </span>
    </div>
  );
};
