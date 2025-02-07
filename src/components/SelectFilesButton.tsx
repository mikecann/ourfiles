import * as React from "react";

type SelectFilesButtonProps = {
  onClick: () => void;
};

export const AddFiles: React.FC<SelectFilesButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 px-4 py-2 bg-white hover:bg-gray-50 
        border rounded-lg text-sm text-gray-600 transition-colors duration-200"
    >
      Add Files
    </button>
  );
};
