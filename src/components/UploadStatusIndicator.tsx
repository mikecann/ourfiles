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
    width: 16,
    height: 16,
    borderRadius: 8,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1.5px solid white",
    boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
  };

  if (state.kind === "created")
    return (
      <div
        style={{
          ...baseStyle,
          background: "#fbbf24", // yellow-400
        }}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 16 16"
          fill="none"
          style={{ color: "white" }}
        >
          <path
            d="M8 3v10M3 8h10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );

  if (state.kind === "uploading")
    return (
      <div
        style={{
          ...baseStyle,
          background: "white",
        }}
      >
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
        <svg
          width="8"
          height="8"
          viewBox="0 0 16 16"
          fill="none"
          style={{ color: "#3b82f6" }}
        >
          <path
            d="M8 3v7M8 10l3-3M8 10l-3-3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );

  if (state.kind === "uploaded")
    return (
      <div
        style={{
          ...baseStyle,
          background: "#22c55e", // green-500
        }}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 16 16"
          fill="none"
          style={{ color: "white" }}
        >
          <path
            d="M3 8l4 4 6-8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );

  // TypeScript will ensure we've handled all cases
  const _exhaustiveCheck: never = state;
  return null;
};
