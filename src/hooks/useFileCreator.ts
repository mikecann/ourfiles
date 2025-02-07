import { useOptimisticCreateFile } from "./useOptimisticFiles";
import { useFileUploader } from "./useFileUploader";

export function useFileCreator() {
  const createFile = useOptimisticCreateFile();
  const { uploadFile } = useFileUploader();

  const createAndUploadFiles = async (
    files: File[],
    getPosition: (index: number) => { x: number; y: number },
  ) => {
    const fileInfos = files.map((file, index) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      position: getPosition(index),
    }));

    const fileIds = await createFile({ files: fileInfos });

    // Start uploads for each file
    for (let i = 0; i < files.length; i++) {
      uploadFile(files[i], fileIds[i]);
    }

    return fileIds;
  };

  return { createAndUploadFiles };
}
