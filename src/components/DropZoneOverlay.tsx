import * as React from "react";

export const DropZoneOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50 pointer-events-none">
      <p className="text-lg text-blue-400">Drop files here...</p>
    </div>
  );
};
