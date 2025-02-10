import * as React from "react";
import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { SelectedItem } from "./SelectedItem";
import { UnselectedItem } from "./UnselectedItem";
import { AddItemsButton } from "./SelectFilesButton";
import { DropZoneOverlay } from "./DropZoneOverlay";
import { EmptyState } from "./EmptyState";
import { SelectionBox } from "./SelectionBox";
import { Id } from "../../convex/_generated/dataModel";
import { HelpCircle } from "lucide-react";
import {
  useOptimisticUpdateFilePosition,
  useOptimisticUpdateFilePositions,
  useOptimisticRemoveFile,
} from "../hooks/useOptimisticFiles";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { DeleteFileDialog } from "./DeleteFileDialog";
import { Toaster } from "./ui/toast";
import { useFileCreator } from "../hooks/useFileCreator";
import { TopRightItems } from "./TopRightItems";
import { MultiSelectOverlay } from "./MultiSelectOverlay";

export const FileUpload: React.FC = () => {
  const [selectedFileIds, setSelectedFileIds] = useState<Set<Id<"files">>>(
    new Set(),
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDragSelecting, setIsDragSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionCurrent, setSelectionCurrent] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const files = useQuery(api.files.list) ?? [];
  const updateFilePositions = useOptimisticUpdateFilePositions();
  const removeFile = useOptimisticRemoveFile();
  const { createAndUploadFiles } = useFileCreator();

  const hasFiles = files.length > 0;

  const unselectedFiles = files.filter(
    (file) => !selectedFileIds.has(file._id),
  );
  const selectedFiles = files.filter((file) => selectedFileIds.has(file._id));

  const onDrop = useCallback(
    async (acceptedFiles: File[], event: React.DragEvent) => {
      const dropPosition = { x: event.pageX, y: event.pageY };
      setSelectedFileIds(new Set());

      await createAndUploadFiles(acceptedFiles, (index) => ({
        x: dropPosition.x + index * 20,
        y: dropPosition.y + index * 20,
      }));
    },
    [createAndUploadFiles],
  );

  const { getRootProps, isDragActive } = useDropzone({
    onDrop: (files, _, event) => onDrop(files, event as React.DragEvent),
    noClick: true,
  });

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || e.target !== containerRef.current) return;
    setIsDragSelecting(true);
    setSelectionStart({ x: e.pageX, y: e.pageY });
    setSelectionCurrent({ x: e.pageX, y: e.pageY });
    setSelectedFileIds(new Set());
  };

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (!isDragSelecting) return;
    setSelectionCurrent({ x: e.pageX, y: e.pageY });

    // Calculate selection box bounds
    const left = Math.min(selectionStart.x, e.pageX);
    const right = Math.max(selectionStart.x, e.pageX);
    const top = Math.min(selectionStart.y, e.pageY);
    const bottom = Math.max(selectionStart.y, e.pageY);

    // Find files that intersect with the selection box
    const selectedIds = new Set<Id<"files">>();
    for (const file of files) {
      const fileLeft = file.position.x - 20;
      const fileRight = file.position.x + 20;
      const fileTop = file.position.y - 20;
      const fileBottom = file.position.y + 20;

      if (
        fileLeft < right &&
        fileRight > left &&
        fileTop < bottom &&
        fileBottom > top
      ) {
        selectedIds.add(file._id);
      }
    }
    setSelectedFileIds(selectedIds);
  };

  const handleContainerMouseUp = () => {
    setIsDragSelecting(false);
  };

  const handleFileClick = (fileId: Id<"files">, e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.shiftKey) {
      // Add or remove from selection
      const newSelection = new Set(selectedFileIds);
      if (newSelection.has(fileId)) newSelection.delete(fileId);
      else newSelection.add(fileId);
      setSelectedFileIds(newSelection);
    } else {
      // Set as single selection
      setSelectedFileIds(new Set([fileId]));
    }
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

    await createAndUploadFiles(files, (index) => ({
      x: centerX + index * 20,
      y: centerY + index * 20,
    }));

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedFileIds.size > 0 && !showDeleteConfirm)
        setShowDeleteConfirm(true);
      if (e.key === "Escape") setSelectedFileIds(new Set());
    },
    [selectedFileIds, showDeleteConfirm],
  );

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragSelecting) return;

      // Clamp coordinates to window boundaries
      const x = Math.max(0, Math.min(e.pageX, window.innerWidth));
      const y = Math.max(0, Math.min(e.pageY, window.innerHeight));

      setSelectionCurrent({ x, y });

      // Calculate selection box bounds
      const left = Math.min(selectionStart.x, x);
      const right = Math.max(selectionStart.x, x);
      const top = Math.min(selectionStart.y, y);
      const bottom = Math.max(selectionStart.y, y);

      // Find files that intersect with the selection box
      const selectedIds = new Set<Id<"files">>();
      for (const file of files) {
        const fileLeft = file.position.x - 20;
        const fileRight = file.position.x + 20;
        const fileTop = file.position.y - 20;
        const fileBottom = file.position.y + 20;

        if (
          fileLeft < right &&
          fileRight > left &&
          fileTop < bottom &&
          fileBottom > top
        ) {
          selectedIds.add(file._id);
        }
      }
      setSelectedFileIds(selectedIds);
    };

    const handleGlobalMouseUp = () => {
      setIsDragSelecting(false);
    };

    if (isDragSelecting) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragSelecting, selectionStart, files]);

  const handleConfirmDelete = () => {
    removeFile({ ids: Array.from(selectedFileIds) });
    setSelectedFileIds(new Set());
    setShowDeleteConfirm(false);
  };

  const handleDashboardClick = () => {
    window.open(import.meta.env.VITE_CONVEX_DASHBOARD_URL, "_blank");
  };

  React.useEffect(() => {
    // Prevent page scrolling when dragging files
    const preventScroll = (e: TouchEvent) => {
      if (e.target instanceof Element && e.target.closest(".file-icon"))
        e.preventDefault();
    };

    document.addEventListener("touchmove", preventScroll, { passive: false });
    return () => document.removeEventListener("touchmove", preventScroll);
  }, []);

  return (
    <>
      <div
        {...getRootProps()}
        ref={containerRef}
        onMouseDown={handleContainerMouseDown}
        className={`
          min-h-screen pt-20 flex items-center justify-center relative
          ${isDragActive ? "bg-blue-50" : "bg-gray-50"}
          transition-colors duration-200 ease-in-out
        `}
      >
        <AddItemsButton onAddClick={handleSelectFilesClick} />

        <TopRightItems onDashboardClick={handleDashboardClick} />

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

        {selectedFiles.map((file) => (
          <SelectedItem
            key={file._id}
            file={file}
            allSelectedFiles={selectedFiles}
            onDragEnd={(updates) => {
              updateFilePositions({ updates });
            }}
            onDelete={() => setSelectedFileIds(new Set())}
            onClick={(e) => handleFileClick(file._id, e)}
            disableTooltip={selectedFiles.length > 1}
          />
        ))}

        {selectedFiles.length > 1 && (
          <MultiSelectOverlay files={selectedFiles} />
        )}

        {hasFiles ? null : <EmptyState />}

        {isDragActive && <DropZoneOverlay />}

        {isDragSelecting && (
          <SelectionBox start={selectionStart} current={selectionCurrent} />
        )}

        <DeleteFileDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          onConfirm={handleConfirmDelete}
          fileCount={selectedFileIds.size}
        />
      </div>
      <Toaster />
    </>
  );
};
