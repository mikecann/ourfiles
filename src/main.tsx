import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import App from "./App.tsx";
import "./index.css";

const convexUrl =
  localStorage.getItem("convexUrl") ?? import.meta.env.VITE_CONVEX_URL;
const convex = new ConvexReactClient(convexUrl);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme="light"
    >
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
