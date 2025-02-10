import * as React from "react";
import { FileSelectionProvider } from "./FileSelectionContext";
import { FileOperationsProvider } from "./FileOperationsContext";
import { UIStateProvider } from "./UIStateContext";

export const FileAppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <FileSelectionProvider>
    <FileOperationsProvider>
      <UIStateProvider>{children}</UIStateProvider>
    </FileOperationsProvider>
  </FileSelectionProvider>
);
