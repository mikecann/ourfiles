import * as React from "react";
import { Doc } from "../../convex/_generated/dataModel";
import { UploadStatusIndicator } from "./UploadStatusIndicator";
import { FileTypeIcon } from "./FileTypeIcon";

type FileIconProps = {
  file: Doc<"files">;
  isSelected: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  onDragStart?: (e: React.DragEvent) => void;
  onDrag?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  tooltip?: React.ReactNode;
  draggable?: boolean;
};

export const FileIcon: React.FC<FileIconProps> = ({
  file,
  isSelected,
  onClick,
  onMouseDown,
  style,
  onDragStart,
  onDrag,
  onDragEnd,
  tooltip,
  draggable,
}) => {
  return (
    <div
      className="absolute flex flex-col items-center gap-1 cursor-pointer select-none pointer-events-auto"
      style={{
        left: file.position.x - 20, // Center the icon on drop position
        top: file.position.y - 20,
        ...style,
      }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
    >
      {tooltip}
      <div className="relative">
        <div
          className={`
            w-10 h-10 rounded-lg shadow-sm border flex items-center justify-center relative overflow-hidden
            transition-all duration-200
            ${
              isSelected
                ? "bg-blue-50 border-blue-400 ring-2 ring-blue-400 ring-opacity-50"
                : "bg-white hover:bg-gray-50"
            }
          `}
          onClick={onClick}
          onMouseDown={onMouseDown}
        >
          <FileTypeIcon
            type={file.type}
            className={isSelected ? "text-blue-400" : "text-gray-300"}
          />
          {(file.uploadState.kind === "uploading" ||
            file.uploadState.kind === "errored") && (
            <div
              className={`absolute bottom-0 left-0 right-0 h-1 ${
                file.uploadState.kind === "errored"
                  ? "bg-red-100"
                  : "bg-blue-100"
              }`}
            >
              <div
                className={`h-full transition-all duration-200 ${
                  file.uploadState.kind === "errored"
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
                style={{
                  width:
                    file.uploadState.kind === "uploading"
                      ? `${file.uploadState.progress}%`
                      : "100%",
                }}
              />
            </div>
          )}
        </div>
        <UploadStatusIndicator file={file} />
      </div>
      <span
        className={`
          text-xs max-w-[100px] truncate
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
