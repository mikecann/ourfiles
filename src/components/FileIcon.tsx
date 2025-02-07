import * as React from "react";

type FileIconProps = {
  file: File;
  position: { x: number; y: number };
  isSelected: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  onDragStart?: (e: React.DragEvent) => void;
  onDrag?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
};

export const FileIcon: React.FC<FileIconProps> = ({
  file,
  position,
  isSelected,
  onClick,
  onMouseDown,
  style,
  onDragStart,
  onDrag,
  onDragEnd,
}) => {
  return (
    <div
      className="absolute flex flex-col items-center gap-1 cursor-pointer pointer-events-none select-none"
      style={{
        left: position.x - 20, // Center the icon on drop position
        top: position.y - 20,
        ...style,
      }}
      draggable={isSelected ? !!onDragStart : false}
      onDragStart={isSelected ? onDragStart : undefined}
      onDrag={isSelected ? onDrag : undefined}
      onDragEnd={isSelected ? onDragEnd : undefined}
    >
      <div
        className={`
          w-10 h-10 rounded-lg shadow-sm border flex items-center justify-center
          transition-all duration-200 pointer-events-auto
          ${
            isSelected
              ? "bg-blue-50 border-blue-400 ring-2 ring-blue-400 ring-opacity-50"
              : "bg-white hover:bg-gray-50"
          }
        `}
        onClick={onClick}
        onMouseDown={onMouseDown}
      >
        <svg
          className={`w-6 h-6 ${isSelected ? "text-blue-400" : "text-gray-400"}`}
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
      <span
        className={`
          text-xs max-w-[100px] truncate pointer-events-auto
          ${isSelected ? "text-blue-500" : "text-gray-600"}
        `}
        onClick={onClick}
        onMouseDown={onMouseDown}
      >
        {file.name}
      </span>
    </div>
  );
};
