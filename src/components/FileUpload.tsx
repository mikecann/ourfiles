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
  useOptimisticRemoveFile,
} from "../hooks/useOptimisticFiles";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { DeleteFileDialog } from "./DeleteFileDialog";

export const FileUpload: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<Id<"files"> | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const files = useQuery(api.files.list) ?? [];
  const createFile = useOptimisticCreateFile();
  const updateFilePosition = useOptimisticUpdateFilePosition();
  const removeFile = useOptimisticRemoveFile();
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const startUpload = useMutation(api.files.startUpload);
  const updateUploadProgress = useMutation(api.files.updateUploadProgress);
  const completeUpload = useMutation(api.files.completeUpload);

  const hasFiles = files.length > 0;

  const unselectedFiles = files.filter((file) => file._id !== selectedFileId);

  const handleFileUpload = async (file: File, fileId: Id<"files">) => {
    try {
      const uploadUrl = await generateUploadUrl();
      await startUpload({ id: fileId });

      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok)
        throw new Error(`Upload failed with status ${result.status}`);

      const { storageId } = await result.json();
      await completeUpload({ id: fileId, storageId });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[], event: React.DragEvent) => {
      const dropPosition = { x: event.pageX, y: event.pageY };
      setSelectedFileId(null);

      for (const [index, file] of acceptedFiles.entries()) {
        const fileId = await createFile({
          name: file.name,
          size: file.size,
          type: file.type,
          position: {
            x: dropPosition.x + index * 20,
            y: dropPosition.y + index * 20,
          },
        });

        handleFileUpload(file, fileId);
      }
    },
    [
      createFile,
      generateUploadUrl,
      startUpload,
      updateUploadProgress,
      completeUpload,
    ],
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

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (const [index, file] of files.entries()) {
      const fileId = await createFile({
        name: file.name,
        size: file.size,
        type: file.type,
        position: {
          x: centerX + index * 20,
          y: centerY + index * 20,
        },
      });

      handleFileUpload(file, fileId);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedFileId && !showDeleteConfirm)
        setShowDeleteConfirm(true);
    },
    [selectedFileId, showDeleteConfirm],
  );

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleConfirmDelete = () => {
    if (!selectedFileId) return;
    removeFile({ id: selectedFileId });
    setSelectedFileId(null);
    setShowDeleteConfirm(false);
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

      <DeleteFileDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
