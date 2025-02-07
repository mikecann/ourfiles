import * as React from "react";
import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { SelectedItem } from "./SelectedItem";
import { UnselectedItem } from "./UnselectedItem";
import { SelectFilesButton } from "./SelectFilesButton";
import { DropZoneOverlay } from "./DropZoneOverlay";
import { EmptyState } from "./EmptyState";

export type DroppedFile = {
  id: string;
  file: File;
  position: { x: number; y: number };
};

export const FileUpload: React.FC = () => {
  const [droppedFiles, setDroppedFiles] = useState<DroppedFile[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasFiles = droppedFiles.length > 0;

  const unselectedFiles = droppedFiles.filter(
    (_, index) => index !== selectedFileIndex,
  );

  const onDrop = useCallback(
    (acceptedFiles: File[], event: React.DragEvent) => {
      const dropPosition = { x: event.pageX, y: event.pageY };
      setSelectedFileIndex(null);

      const newFiles = acceptedFiles.map((file, index) => ({
        id: crypto.randomUUID(),
        file,
        position: {
          x: dropPosition.x + index * 20,
          y: dropPosition.y + index * 20,
        },
      }));

      setDroppedFiles((prev) => [...prev, ...newFiles]);
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files, _, event) => onDrop(files, event as React.DragEvent),
    noClick: true,
  });

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) setSelectedFileIndex(null);
  };

  const handleFileClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFileIndex(index === selectedFileIndex ? null : index);
  };

  const handleSelectFilesClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const newFiles = files.map((file, index) => ({
      id: crypto.randomUUID(),
      file,
      position: {
        x: centerX + index * 20,
        y: centerY + index * 20,
      },
    }));

    setDroppedFiles((prev) => [...prev, ...newFiles]);
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

      {unselectedFiles.map((droppedFile) => (
        <UnselectedItem
          key={droppedFile.id}
          droppedFile={droppedFile}
          onClick={(e) => handleFileClick(droppedFiles.indexOf(droppedFile), e)}
        />
      ))}

      {selectedFileIndex !== null && (
        <SelectedItem
          droppedFile={droppedFiles[selectedFileIndex]}
          onClick={(e) => handleFileClick(selectedFileIndex, e)}
        />
      )}

      {hasFiles ? null : <EmptyState />}

      {isDragActive && <DropZoneOverlay />}
    </div>
  );
};
