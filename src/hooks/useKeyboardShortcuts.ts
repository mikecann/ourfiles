import * as React from "react";
import { Id } from "../../convex/_generated/dataModel";

export const useKeyboardShortcuts = ({
  selectedIds,
  onDelete,
  onClearSelection,
}: {
  selectedIds: Set<Id<"files">>;
  onDelete: () => void;
  onClearSelection: () => void;
}) => {
  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedIds.size > 0) onDelete();
      if (e.key === "Escape") onClearSelection();
    },
    [selectedIds, onDelete, onClearSelection],
  );

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};
