import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSettings } from "../contexts/SettingsContext";

const defaultConvexUrl = import.meta.env.VITE_CONVEX_URL;
const defaultDashboardUrl = import.meta.env.VITE_CONVEX_DASHBOARD_URL;

type SettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { settings, setSettings, resetSettings } = useSettings();
  const [convexUrl, setConvexUrl] = React.useState(settings.convexUrl);
  const [dashboardUrl, setDashboardUrl] = React.useState(settings.dashboardUrl);

  const handleSave = () => {
    setSettings({ convexUrl, dashboardUrl });
    onOpenChange(false);
  };

  const handleReset = () => {
    if (!confirm("Are you sure you want to reset to default settings?")) return;
    resetSettings();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="convexUrl">Convex URL</label>
            <Input
              id="convexUrl"
              value={convexUrl}
              onChange={(e) => setConvexUrl(e.target.value)}
              placeholder={defaultConvexUrl}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="dashboardUrl">Convex Dashboard URL</label>
            <Input
              id="dashboardUrl"
              value={dashboardUrl}
              onChange={(e) => setDashboardUrl(e.target.value)}
              placeholder={defaultDashboardUrl}
            />
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
