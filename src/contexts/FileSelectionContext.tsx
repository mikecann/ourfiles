import * as React from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useSelectionBox } from "../hooks/useSelectionBox";

type FileSelectionContextType = {
  selectedFileIds: Set<Id<"files">>;
  isDragSelecting: boolean;
  selectionStart: { x: number; y: number };
  selectionCurrent: { x: number; y: number };
  handleMouseDown: (e: React.MouseEvent<HTMLElement>) => void;
  handleFileClick: (fileId: Id<"files">, e: React.MouseEvent) => void;
  clearSelection: () => void;
};

export const FileSelectionContext =
  React.createContext<FileSelectionContextType>({
    selectedFileIds: new Set(),
    isDragSelecting: false,
    selectionStart: { x: 0, y: 0 },
    selectionCurrent: { x: 0, y: 0 },
    handleMouseDown: () => {},
    handleFileClick: () => {},
    clearSelection: () => {},
  });

export const useFileSelection = () => React.useContext(FileSelectionContext);

export const FileSelectionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedFileIds, setSelectedFileIds] = React.useState<
    Set<Id<"files">>
  >(new Set());

  const { isDragSelecting, selectionStart, selectionCurrent, handleMouseDown } =
    useSelectionBox({
      files: [], // We'll pass this from the parent
      onSelectionChange: setSelectedFileIds,
    });

  const handleFileClick = React.useCallback(
    (fileId: Id<"files">, e: React.MouseEvent) => {
      e.stopPropagation();
      if (e.shiftKey) {
        const newSelection = new Set(selectedFileIds);
        if (newSelection.has(fileId)) newSelection.delete(fileId);
        else newSelection.add(fileId);
        setSelectedFileIds(newSelection);
      } else setSelectedFileIds(new Set([fileId]));
    },
    [selectedFileIds],
  );

  const clearSelection = React.useCallback(
    () => setSelectedFileIds(new Set()),
    [],
  );

  const value = React.useMemo(
    () => ({
      selectedFileIds,
      isDragSelecting,
      selectionStart,
      selectionCurrent,
      handleMouseDown,
      handleFileClick,
      clearSelection,
    }),
    [
      selectedFileIds,
      isDragSelecting,
      selectionStart,
      selectionCurrent,
      handleMouseDown,
      handleFileClick,
      clearSelection,
    ],
  );

  return (
    <FileSelectionContext.Provider value={value}>
      {children}
    </FileSelectionContext.Provider>
  );
};
