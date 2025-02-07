import * as React from "react";
import { FileIcon } from "./FileIcon";
import type { ConvexFile } from "./FileUpload";

type UnselectedItemProps = {
  file: ConvexFile;
  onClick: (e: React.MouseEvent) => void;
};

export const UnselectedItem: React.FC<UnselectedItemProps> = ({
  file,
  onClick,
}) => {
  return (
    <FileIcon
      name={file.name}
      position={file.position}
      onMouseDown={onClick}
      isSelected={false}
    />
  );
};
