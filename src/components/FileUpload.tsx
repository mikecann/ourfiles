import * as React from "react";
import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { SelectedItem } from "./SelectedItem";
import { UnselectedItem } from "./UnselectedItem";
import { SelectFilesButton } from "./SelectFilesButton";
import { DropZoneOverlay } from "./DropZoneOverlay";
import { EmptyState } from "./EmptyState";
import { Id } from "../../convex/_generated/dataModel";
import {
  useOptimisticCreateFile,
  useOptimisticUpdateFilePosition,
} from "../hooks/useOptimisticFiles";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const FileUpload: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<Id<"files"> | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const files = useQuery(api.files.list) ?? [];
  const createFile = useOptimisticCreateFile();
  const updateFilePosition = useOptimisticUpdateFilePosition();

  const hasFiles = files.length > 0;

  const unselectedFiles = files.filter((file) => file._id !== selectedFileId);

  const onDrop = useCallback(
    (acceptedFiles: File[], event: React.DragEvent) => {
      const dropPosition = { x: event.pageX, y: event.pageY };
      setSelectedFileId(null);

      acceptedFiles.forEach((file, index) => {
        createFile({
          name: file.name,
          size: file.size,
          type: file.type,
          position: {
            x: dropPosition.x + index * 20,
            y: dropPosition.y + index * 20,
          },
        });
      });
    },
    [createFile],
  );

  const { getRootProps, isDragActive } = useDropzone({
    onDrop: (files, _, event) => onDrop(files, event as React.DragEvent),
    noClick: true,
  });

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) setSelectedFileId(null);
  };

  const handleFileClick = (fileId: Id<"files">, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFileId(fileId === selectedFileId ? null : fileId);
  };

  const handleSelectFilesClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    files.forEach((file, index) => {
      createFile({
        name: file.name,
        size: file.size,
        type: file.type,
        position: {
          x: centerX + index * 20,
          y: centerY + index * 20,
        },
      });
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div
      {...getRootProps()}
      ref={containerRef}
      onClick={handleContainerClick}
      className={`
        min-h-screen pt-20 flex items-center justify-center relative
        ${isDragActive ? "bg-blue-50" : "bg-gray-50"}
        transition-colors duration-200 ease-in-out
      `}
    >
      <SelectFilesButton onClick={handleSelectFilesClick} />

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {unselectedFiles.map((file) => (
        <UnselectedItem
          key={file._id}
          file={file}
          onClick={(e) => handleFileClick(file._id, e)}
        />
      ))}

      {selectedFileId && (
        <SelectedItem
          file={files.find((file) => file._id === selectedFileId)!}
          onDragEnd={(newPosition) => {
            updateFilePosition({
              id: selectedFileId,
              position: newPosition,
            });
          }}
        />
      )}

      {hasFiles ? null : <EmptyState />}

      {isDragActive && <DropZoneOverlay />}
    </div>
  );
};
