import * as React from "react";
import { FileIcon } from "./FileIcon";
import type { DroppedFile } from "./FileUpload";

type SelectedItemProps = {
  droppedFile: DroppedFile;
  onClick: (e: React.MouseEvent) => void;
};

export const SelectedItem: React.FC<SelectedItemProps> = ({
  droppedFile,
  onClick,
}) => {
  return (
    <FileIcon
      file={droppedFile.file}
      position={droppedFile.position}
      isSelected={true}
      onClick={onClick}
    />
  );
};
