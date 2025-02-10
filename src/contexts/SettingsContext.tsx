import * as React from "react";

const storageKeys = {
  CONVEX_URL: "convexUrl",
  DASHBOARD_URL: "convexDashboardUrl",
} as const;

const envDefaults = {
  CONVEX_URL: import.meta.env.VITE_CONVEX_URL,
  DASHBOARD_URL: import.meta.env.VITE_CONVEX_DASHBOARD_URL,
} as const;

type Settings = {
  convexUrl: string;
  dashboardUrl: string;
};

type SettingsContextType = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  resetSettings: () => void;
};

const defaultSettings: Settings = {
  convexUrl: envDefaults.CONVEX_URL,
  dashboardUrl: envDefaults.DASHBOARD_URL,
};

const loadSettings = (): Settings => {
  const convexUrl = localStorage.getItem(storageKeys.CONVEX_URL);
  const dashboardUrl = localStorage.getItem(storageKeys.DASHBOARD_URL);

  return {
    convexUrl: convexUrl ?? envDefaults.CONVEX_URL,
    dashboardUrl: dashboardUrl ?? envDefaults.DASHBOARD_URL,
  };
};

const SettingsContext = React.createContext<SettingsContextType | null>(null);

export const useSettings = () => {
  const context = React.useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within SettingsProvider");
  return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettingsState] = React.useState<Settings>(loadSettings);

  const setSettings = (newSettings: Settings) => {
    localStorage.setItem(storageKeys.CONVEX_URL, newSettings.convexUrl);
    localStorage.setItem(storageKeys.DASHBOARD_URL, newSettings.dashboardUrl);
    setSettingsState(newSettings);
    window.location.reload();
  };

  const resetSettings = () => {
    localStorage.removeItem(storageKeys.CONVEX_URL);
    localStorage.removeItem(storageKeys.DASHBOARD_URL);
    setSettingsState(defaultSettings);
    window.location.reload();
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
