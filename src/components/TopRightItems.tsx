import * as React from "react";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";

interface Props {
  onDashboardClick: () => void;
}

export const TopRightItems: React.FC<Props> = ({ onDashboardClick }) => {
  return (
    <Button
      variant="outline"
      onClick={onDashboardClick}
      className="fixed top-4 right-4 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50"
    >
      <LayoutDashboard className="w-4 h-4 mr-2" />
      Dashboard
    </Button>
  );
};
