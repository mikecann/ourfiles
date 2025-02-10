import { useOptimisticCreateFile } from "./useOptimisticFiles";
import { useFileUploader } from "./useFileUploader";
import { toast } from "sonner";
import { MAX_FILE_SIZE } from "../../convex/constants";

export function useFileCreator() {
  const createFile = useOptimisticCreateFile();
  const { uploadFile } = useFileUploader();

  const createAndUploadFiles = async (
    files: File[],
    getPosition: (index: number) => { x: number; y: number },
  ) => {
    // Filter out files that are too large
    const validFiles = [];
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(
          `File ${file.name} exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        );
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return [];

    const fileInfos = validFiles.map((file, index) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      position: getPosition(index),
    }));

    const fileIds = await createFile({ files: fileInfos });

    // Start uploads for each file
    for (let i = 0; i < validFiles.length; i++) {
      uploadFile(validFiles[i], fileIds[i]);
    }

    return fileIds;
  };

  return { createAndUploadFiles };
}
