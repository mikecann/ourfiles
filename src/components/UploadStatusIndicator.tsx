import * as React from "react";
import { Doc } from "../../convex/_generated/dataModel";

type UploadState = Doc<"files">["uploadState"];

export const UploadStatusIndicator: React.FC<{ file: Doc<"files"> }> = ({
  file,
}) => {
  const state = file.uploadState;

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 10,
  };

  if (state.kind === "created")
    return (
      <div
        style={{
          ...baseStyle,
          background: "#fbbf24", // yellow-400
        }}
      />
    );

  if (state.kind === "uploading")
    return (
      <div style={baseStyle}>
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "2px solid #3b82f6",
            borderTopColor: "transparent",
            animation: "spin 1s linear infinite",
            opacity: state.progress === 0 ? 0.5 : 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 2,
            background: "white",
            borderRadius: "50%",
          }}
        />
      </div>
    );

  if (state.kind === "uploaded")
    return (
      <div
        style={{
          ...baseStyle,
          background: "#22c55e", // green-500
        }}
      />
    );

  // TypeScript will ensure we've handled all cases
  const _exhaustiveCheck: never = state;
  return null;
};
