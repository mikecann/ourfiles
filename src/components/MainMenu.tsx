import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Menu, ExternalLink, Settings } from "lucide-react";
import SettingsDialog from "./SettingsDialog";

const defaultDashboardUrl = import.meta.env.VITE_CONVEX_DASHBOARD_URL;

type MainMenuProps = {
  onDashboardClick: () => void;
};

export const MainMenu: React.FC<MainMenuProps> = ({ onDashboardClick }) => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const handleDashboardClick = () => {
    const dashboardUrl =
      localStorage.getItem("convexDashboardUrl") ?? defaultDashboardUrl;
    window.open(dashboardUrl, "_blank");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gray-600"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDashboardClick}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
};
