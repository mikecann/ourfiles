import * as React from "react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileIcon } from "./FileIcon";

type DroppedFile = {
  file: File;
  position: { x: number; y: number };
};

export const FileUpload: React.FC = () => {
  const [droppedFiles, setDroppedFiles] = useState<DroppedFile[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], event: React.DragEvent) => {
      const dropPosition = { x: event.pageX, y: event.pageY };

      const newFiles = acceptedFiles.map((file, index) => ({
        file,
        position: {
          x: dropPosition.x + index * 20, // Offset each file slightly
          y: dropPosition.y + index * 20,
        },
      }));

      setDroppedFiles((prev) => [...prev, ...newFiles]);
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files, _, event) => onDrop(files, event as React.DragEvent),
  });

  return (
    <div
      {...getRootProps()}
      className={`
        min-h-screen pt-20 flex items-center justify-center
        ${isDragActive ? "bg-blue-50" : "bg-gray-50"}
        transition-colors duration-200 ease-in-out
      `}
    >
      <input {...getInputProps()} />

      <div
        className={`
        w-96 aspect-square
        border-2 border-dashed rounded-lg
        ${isDragActive ? "border-blue-400 bg-white/80" : "border-gray-200 bg-white/50"}
        flex flex-col items-center justify-center gap-3
        p-8
      `}
      >
        <svg
          className={`w-10 h-10 ${isDragActive ? "text-blue-400" : "text-gray-300"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p
          className={`text-sm ${isDragActive ? "text-blue-400" : "text-gray-400"}`}
        >
          {isDragActive
            ? "Drop files here..."
            : "Drag and drop files anywhere, or click to select"}
        </p>
      </div>

      {droppedFiles.map((droppedFile, index) => (
        <FileIcon
          key={`${droppedFile.file.name}-${index}`}
          file={droppedFile.file}
          position={droppedFile.position}
        />
      ))}
    </div>
  );
};
