import * as React from "react";
import { useDropzone } from "react-dropzone";
import { useFileCreator } from "./useFileCreator";

export const useFileHandlers = () => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { createAndUploadFiles } = useFileCreator();

  const onDrop = React.useCallback(
    async (acceptedFiles: File[], event: React.DragEvent) => {
      const dropPosition = { x: event.pageX, y: event.pageY };
      await createAndUploadFiles(acceptedFiles, (index) => ({
        x: dropPosition.x + index * 20,
        y: dropPosition.y + index * 20,
      }));
    },
    [createAndUploadFiles],
  );

  const { getRootProps, isDragActive } = useDropzone({
    onDrop: (files, _, event) => {
      void onDrop(files, event as React.DragEvent);
    },
    noClick: true,
  });

  const handleSelectFilesClick = () => fileInputRef.current?.click();

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

  return {
    fileInputRef,
    getRootProps,
    isDragActive,
    handleSelectFilesClick,
    handleFileInputChange,
  };
};
