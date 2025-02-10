import { useOptimisticCreateFile } from "./useOptimisticFiles";
import { useFileUploader } from "./useFileUploader";
import { toast } from "sonner";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useFileCreator() {
  const createFile = useOptimisticCreateFile();
  const { uploadFile } = useFileUploader();
  const config = useQuery(api.constants.getConfig);

  const createAndUploadFiles = async (
    files: File[],
    getPosition: (index: number) => { x: number; y: number },
  ) => {
    if (!config) return [];

    // Filter out files that are too large
    const validFiles = [];
    for (const file of files) {
      if (file.size > config.maxFileSize) {
        toast.error(
          `File ${file.name} exceeds maximum size of ${config.maxFileSize / 1024 / 1024}MB`,
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
    for (let i = 0; i < validFiles.length; i++)
      void uploadFile(validFiles[i], fileIds[i]);

    return fileIds;
  };

  return { createAndUploadFiles };
}
