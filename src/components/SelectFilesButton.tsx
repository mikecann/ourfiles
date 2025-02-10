import * as React from "react";
import { Button } from "./ui/button";
import { Plus, LayoutDashboard } from "lucide-react";

type ActionButtonsProps = {
  onAddClick: () => void;
};

export const AddItemsButton: React.FC<ActionButtonsProps> = ({
  onAddClick,
}) => {
  return (
    <>
      <Button
        size="icon"
        variant="outline"
        onClick={onAddClick}
        className="fixed bottom-8 right-8  rounded-full w-20 h-20 shadow-lg bg-white hover:bg-gray-50 border-gray-200 p-0 flex items-center justify-center"
      >
        <Plus className="w-10 h-10 text-gray-200" />
      </Button>
    </>
  );
};
