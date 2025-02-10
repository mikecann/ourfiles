import * as React from "react";
import { SelectedItem } from "./SelectedItem";
import { UnselectedItem } from "./UnselectedItem";
import { AddItemsButton } from "./SelectFilesButton";
import { DropZoneOverlay } from "./DropZoneOverlay";
import { EmptyState } from "./EmptyState";
import { SelectionBox } from "./SelectionBox";
import { Id } from "../../convex/_generated/dataModel";
import { TopRightItems } from "./TopRightItems";
import { MultiSelectOverlay } from "./MultiSelectOverlay";
import { DeleteFileDialog } from "./DeleteFileDialog";
import { Toaster } from "./ui/toast";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  useOptimisticUpdateFilePositions,
  useOptimisticRemoveFile,
} from "../hooks/useOptimisticFiles";
import { useSelectionBox } from "../hooks/useSelectionBox";
import { useFileHandlers } from "../hooks/useFileHandlers";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

export const FileUpload: React.FC = () => {
  const [selectedFileIds, setSelectedFileIds] = React.useState<
    Set<Id<"files">>
  >(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const files = useQuery(api.files.list) ?? [];
  const updateFilePositions = useOptimisticUpdateFilePositions();
  const removeFile = useOptimisticRemoveFile();

  const hasFiles = files.length > 0;
  const unselectedFiles = files.filter(
    (file) => !selectedFileIds.has(file._id),
  );
  const selectedFiles = files.filter((file) => selectedFileIds.has(file._id));

  const {
    fileInputRef,
    getRootProps,
    isDragActive,
    handleSelectFilesClick,
    handleFileInputChange,
  } = useFileHandlers();

  const { isDragSelecting, selectionStart, selectionCurrent, handleMouseDown } =
    useSelectionBox({
      files,
      onSelectionChange: setSelectedFileIds,
    });

  useKeyboardShortcuts({
    selectedIds: selectedFileIds,
    onDelete: () => setShowDeleteConfirm(true),
    onClearSelection: () => setSelectedFileIds(new Set()),
  });

  const handleFileClick = (fileId: Id<"files">, e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.shiftKey) {
      const newSelection = new Set(selectedFileIds);
      if (newSelection.has(fileId)) newSelection.delete(fileId);
      else newSelection.add(fileId);
      setSelectedFileIds(newSelection);
    } else setSelectedFileIds(new Set([fileId]));
  };

  const handleConfirmDelete = () => {
    removeFile({ ids: Array.from(selectedFileIds) });
    setSelectedFileIds(new Set());
    setShowDeleteConfirm(false);
  };

  const handleDashboardClick = () =>
    window.open(import.meta.env.VITE_CONVEX_DASHBOARD_URL, "_blank");

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
        onMouseDown={handleMouseDown}
        className={`
          min-h-screen pt-20 flex items-center justify-center relative
          ${isDragActive ? "bg-blue-50" : "bg-gray-50"}
          transition-colors duration-200 ease-in-out
        `}
      >
        <TopRightItems />

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => void handleFileInputChange(e)}
        />

        {unselectedFiles.map((file) => (
          <UnselectedItem
            key={file._id}
            file={file}
            onClick={(e) => handleFileClick(file._id, e)}
            isDragSelecting={isDragSelecting}
          />
        ))}

        {selectedFiles.map((file) => (
          <SelectedItem
            key={file._id}
            file={file}
            allSelectedFiles={selectedFiles}
            onDragEnd={(updates) => void updateFilePositions({ updates })}
            onDelete={() => setSelectedFileIds(new Set())}
            onClick={(e) => handleFileClick(file._id, e)}
            disableTooltip={selectedFiles.length > 1 || isDragSelecting}
          />
        ))}

        {selectedFiles.length > 1 && (
          <MultiSelectOverlay files={selectedFiles} />
        )}

        <AddItemsButton onAddClick={handleSelectFilesClick} />

        {!hasFiles && <EmptyState />}

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
