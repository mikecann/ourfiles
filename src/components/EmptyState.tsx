import * as React from "react";

export const EmptyState: React.FC = () => {
  return (
    <div
      className="w-96 aspect-square border-2 border-dashed border-gray-200 rounded-lg
      flex flex-col items-center justify-center gap-3 p-8 bg-white/50 pointer-events-none"
    >
      <svg
        className="w-10 h-10 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <p className="text-sm text-gray-400">Drag and drop files here</p>
    </div>
  );
};
