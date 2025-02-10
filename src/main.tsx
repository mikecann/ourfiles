import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from "./App.tsx";
import "./index.css";
import { SettingsProvider, useSettings } from "./contexts/SettingsContext";

const ConvexProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { settings } = useSettings();
  const convex = new ConvexReactClient(settings.convexUrl);
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme="light"
    >
      <SettingsProvider>
        <ConvexProviderWrapper>
          <App />
        </ConvexProviderWrapper>
      </SettingsProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
