import * as React from "react";
import { FileIcon } from "./FileIcon";
import { Doc } from "../../convex/_generated/dataModel";

type UnselectedItemProps = {
  file: Doc<"files">;
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
