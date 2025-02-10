import * as React from "react";

type SelectionBoxProps = {
  start: { x: number; y: number };
  current: { x: number; y: number };
};

export const SelectionBox: React.FC<SelectionBoxProps> = ({
  start,
  current,
}) => {
  const left = Math.min(start.x, current.x);
  const top = Math.min(start.y, current.y);
  const width = Math.abs(current.x - start.x);
  const height = Math.abs(current.y - start.y);

  return (
    <div
      className="absolute border border-blue-400 bg-blue-50 bg-opacity-20 pointer-events-none z-0"
      style={{
        left,
        top,
        width,
        height,
      }}
    />
  );
};
