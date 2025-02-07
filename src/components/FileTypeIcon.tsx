import * as React from "react";
import {
  Image,
  FileText,
  FileVideo,
  FileAudio,
  FileArchive,
  FilePlus,
  FileCode,
} from "lucide-react";

type FileTypeIconProps = {
  type: string;
  className?: string;
};

export const FileTypeIcon: React.FC<FileTypeIconProps> = ({
  type,
  className = "",
}) => {
  // Helper to get icon based on mime type or extension
  const getIconForType = (type: string) => {
    // Image files
    if (
      type.startsWith("image/") ||
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(type)
    )
      return <Image className={className} />;

    // PDF files
    if (type === "application/pdf" || type.endsWith(".pdf"))
      return <FileText className={className} />;

    // Code files
    if (/\.(js|ts|jsx|tsx|html|css|json)$/i.test(type))
      return <FileCode className={className} />;

    // Text files
    if (type.startsWith("text/") || /\.(txt|md)$/i.test(type))
      return <FileText className={className} />;

    // Video files
    if (
      type.startsWith("video/") ||
      /\.(mp4|mov|avi|wmv|flv|webm)$/i.test(type)
    )
      return <FileVideo className={className} />;

    // Audio files
    if (type.startsWith("audio/") || /\.(mp3|wav|ogg|m4a)$/i.test(type))
      return <FileAudio className={className} />;

    // Archive files
    if (/\.(zip|rar|7z|tar|gz)$/i.test(type))
      return <FileArchive className={className} />;

    // Default file icon
    return <FilePlus className={className} />;
  };

  return getIconForType(type);
};
