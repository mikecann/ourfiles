import * as React from "react";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { FileIcon } from "./FileIcon";

type Position = { x: number; y: number };
type RelativePosition = { id: Id<"files">; offsetX: number; offsetY: number };

export const FileGhostPreview: React.FC<{
  file: Doc<"files">;
  dragPosition: Position;
  relativePositions: RelativePosition[];
  allSelectedFiles: Doc<"files">[];
}> = ({ file, dragPosition, relativePositions, allSelectedFiles }) => (
  <>
    <FileIcon
      file={{
        ...file,
        position: dragPosition,
      }}
      isSelected={true}
      style={{ opacity: 0.5, pointerEvents: "none" }}
      animate={false}
    />
    {relativePositions.map(({ id, offsetX, offsetY }) => {
      const relativeFile = allSelectedFiles.find((f) => f._id === id);
      if (!relativeFile) return null;
      return (
        <FileIcon
          key={id}
          file={{
            ...relativeFile,
            position: {
              x: dragPosition.x + offsetX,
              y: dragPosition.y + offsetY,
            },
          }}
          isSelected={true}
          style={{ opacity: 0.5, pointerEvents: "none" }}
          animate={true}
        />
      );
    })}
  </>
);
