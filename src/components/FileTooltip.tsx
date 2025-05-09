import * as React from "react";
import { Button } from "./ui/button";
import { Trash2, Upload, Check, Clock, Download, XCircle } from "lucide-react";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { useOptimisticRemoveFile } from "../hooks/useOptimisticFiles";
import { DeleteFileDialog } from "./DeleteFileDialog";
import { formatFileSize } from "../utils/formatters";

type FilePreviewProps = {
  type: string;
  url?: string;
};

const FilePreview: React.FC<FilePreviewProps> = ({ type, url }) => {
  if (!url) return null;

  // Image files
  if (type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(type))
    return (
      <div className="w-full aspect-video bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
        <img
          src={url}
          alt="preview"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );

  // Video files
  if (type.startsWith("video/") || /\.(mp4|mov|avi|wmv|flv|webm)$/i.test(type))
    return (
      <div className="w-full aspect-video bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
        <video src={url} controls className="max-w-full max-h-full" />
      </div>
    );

  // Audio files
  if (type.startsWith("audio/") || /\.(mp3|wav|ogg|m4a)$/i.test(type))
    return (
      <div className="w-full bg-gray-50 rounded-lg mb-3 p-3">
        <audio src={url} controls className="w-full" />
      </div>
    );

  // PDF files - show iframe preview
  if (type === "application/pdf" || type.endsWith(".pdf"))
    return (
      <div className="w-full aspect-video bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
        <iframe src={url} className="w-full h-full" />
      </div>
    );

  // Text/Code files - could add a code preview here but might be better as a separate feature
  return null;
};

type FileTooltipProps = {
  fileId: Id<"files">;
  name: string;
  size: number;
  type: string;
  onDelete?: () => void;
  uploadState: Doc<"files">["uploadState"];
};

// Helper to detect mobile devices
function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return (
    /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) ||
    (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)
  );
}

export const FileTooltip: React.FC<FileTooltipProps> = ({
  fileId,
  name,
  size,
  type,
  onDelete,
  uploadState,
}) => {
  const removeFile = useOptimisticRemoveFile();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const handleDelete = () => {
    void removeFile({ ids: [fileId] });
    setShowDeleteDialog(false);
    onDelete?.();
  };

  const handleDownload = () => {
    if (uploadState.kind === "uploaded") {
      window.open(uploadState.url, "_blank");
    }
  };

  const getUploadStateDisplay = () => {
    switch (uploadState.kind) {
      case "created":
        return (
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-3 h-3" />
            Waiting
          </div>
        );
      case "uploading":
        return (
          <div className="flex items-center gap-1 text-blue-500">
            <Upload className="w-3 h-3" />
            {uploadState.progress}%
          </div>
        );
      case "errored":
        return (
          <div className="flex items-center gap-1 text-red-500">
            <XCircle className="w-3 h-3" />
            Error: {uploadState.message}
          </div>
        );
      case "uploaded":
        return (
          <div className="flex items-center gap-1 text-green-500">
            <Check className="w-3 h-3" />
            Uploaded
          </div>
        );
    }
  };

  return (
    <>
      {/* Fullscreen overlay to intercept pointer events (mobile only) */}
      {isMobileDevice() && (
        <div
          className="fixed inset-0 z-40 bg-transparent pointer-events-auto"
          style={{ display: "block" }}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      <div className="absolute left-1/2 -translate-x-1/2 -top-1 -translate-y-full pointer-events-auto flex flex-col items-center animate-popIn z-50">
        <div className="bg-white rounded-lg shadow-lg p-3 border text-sm w-[280px]">
          <div className="flex flex-col">
            {uploadState.kind === "uploaded" && (
              <FilePreview type={type} url={uploadState.url} />
            )}
            <div className="grid grid-cols-2 gap-4 relative">
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">
                  PROPERTIES
                </div>
                <div className="text-gray-600">
                  Size: {formatFileSize(size)}
                </div>
                <div className="text-gray-600">Type: {type || "Unknown"}</div>
              </div>
              <div className="absolute top-0 bottom-0 left-1/2 border-l border-dotted border-gray-200" />
              <div>
                <div className="text-xs font-medium text-gray-500 mb-1">
                  STATE
                </div>
                <div className="text-gray-600">{getUploadStateDisplay()}</div>
              </div>
            </div>
            <div className="bg-gray-200 -mx-3 my-2" />
            <div className="-mx-3 -mb-3 p-2 bg-gray-50 rounded-b-lg flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                onClick={handleDownload}
                disabled={uploadState.kind !== "uploaded"}
              >
                <Download className="w-4 h-4 mr-2" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        </div>
        {/* Triangle pointer */}
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: "8px solid white",
          }}
        />
      </div>

      <DeleteFileDialog
        fileCount={1}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />
    </>
  );
};
