import * as React from "react";
import { Id } from "../../convex/_generated/dataModel";
import {
  useOptimisticUpdateFilePositions,
  useOptimisticRemoveFile,
} from "../hooks/useOptimisticFiles";
import { useFileCreator } from "../hooks/useFileCreator";
import { useFileDownloadDrag } from "../hooks/useFileDownloadDrag";

type FileOperationsContextType = {
  updateFilePositions: (
    updates: { id: Id<"files">; position: { x: number; y: number } }[],
  ) => void;
  removeFiles: (ids: Id<"files">[]) => void;
  createAndUploadFiles: (
    files: File[],
    getPosition: (index: number) => { x: number; y: number },
  ) => Promise<Id<"files">[]>;
  handleDragStart: (e: React.DragEvent) => void;
  handleDragEnd: (e: React.DragEvent) => void;
  canDownload: boolean;
};

export const FileOperationsContext =
  React.createContext<FileOperationsContextType>({
    updateFilePositions: () => {},
    removeFiles: () => {},
    createAndUploadFiles: async () => [],
    handleDragStart: () => {},
    handleDragEnd: () => {},
    canDownload: false,
  });

export const useFileOperations = () => React.useContext(FileOperationsContext);

export const FileOperationsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const updateFilePositions = useOptimisticUpdateFilePositions();
  const removeFile = useOptimisticRemoveFile();
  const { createAndUploadFiles } = useFileCreator();
  const { handleDragStart, handleDragEnd, canDownload } = useFileDownloadDrag({
    files: [], // We'll pass this from the parent
    singleFile: true,
  });

  const value = React.useMemo(
    () => ({
      updateFilePositions: (
        updates: { id: Id<"files">; position: { x: number; y: number } }[],
      ) => updateFilePositions({ updates }),
      removeFiles: (ids: Id<"files">[]) => removeFile({ ids }),
      createAndUploadFiles,
      handleDragStart,
      handleDragEnd,
      canDownload,
    }),
    [
      updateFilePositions,
      removeFile,
      createAndUploadFiles,
      handleDragStart,
      handleDragEnd,
      canDownload,
    ],
  );

  return (
    <FileOperationsContext.Provider value={value}>
      {children}
    </FileOperationsContext.Provider>
  );
};
