import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.tsx";
import "./index.css";
import { SettingsProvider } from "./contexts/SettingsContext";
import { ConvexProviderWrapper } from "./components/ConvexProviderWrapper";

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
