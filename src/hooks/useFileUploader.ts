import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

export function useFileUploader() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const startUpload = useMutation(api.files.startUpload);
  const updateUploadProgress = useMutation(api.files.updateUploadProgress);
  const completeUpload = useMutation(api.files.completeUpload);
  const setErrorState = useMutation(api.files.setErrorState);

  const getErrorMessage = (xhr: XMLHttpRequest): string => {
    try {
      const response = JSON.parse(xhr.responseText);
      if (response.message) return response.message;
      if (response.error) return response.error;
    } catch (e) {
      // If we can't parse the response, fall back to status text
    }
    return xhr.statusText || `Upload failed with status ${xhr.status}`;
  };

  const uploadFile = async (file: File, fileId: Id<"files">) => {
    try {
      // First mark the file as uploading
      await startUpload({ id: fileId });

      // Then generate upload URL and upload the file
      const uploadUrl = await generateUploadUrl();

      // Create a promise that resolves when the upload is complete
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", uploadUrl);
        xhr.setRequestHeader(
          "Content-Type",
          file.type || "application/octet-stream",
        );

        let lastUpdate = 0;
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const now = Date.now();
            if (now - lastUpdate >= 1000) {
              const progress = Math.round((event.loaded / event.total) * 100);
              void updateUploadProgress({ id: fileId, progress });
              lastUpdate = now;
            }
          }
        };

        xhr.onload = async () => {
          if (xhr.status === 200) {
            const { storageId } = JSON.parse(xhr.responseText);
            await completeUpload({ id: fileId, storageId });
            resolve(undefined);
          } else {
            reject(new Error(getErrorMessage(xhr)));
          }
        };

        xhr.onerror = () => {
          const message = getErrorMessage(xhr);
          reject(new Error(message || "Network error during upload"));
        };
        xhr.send(file);
      });
    } catch (error) {
      console.error("Upload failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      await setErrorState({ id: fileId, message: errorMessage });
      toast.error(`Failed to upload ${file.name}`, {
        description: errorMessage,
      });
    }
  };

  return { uploadFile };
}
