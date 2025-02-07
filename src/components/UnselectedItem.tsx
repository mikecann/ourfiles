import * as React from "react";
import { FileIcon } from "./FileIcon";
import type { DroppedFile } from "./FileUpload";

type UnselectedItemProps = {
  droppedFile: DroppedFile;
  onClick: (e: React.MouseEvent) => void;
};

export const UnselectedItem: React.FC<UnselectedItemProps> = ({
  droppedFile,
  onClick,
}) => {
  return (
    <FileIcon
      file={droppedFile.file}
      position={droppedFile.position}
      onClick={onClick}
      isSelected={false}
    />
  );
};
