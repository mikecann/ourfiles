import React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useSettings } from "../contexts/SettingsContext";

export const ConvexProviderWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { settings } = useSettings();
  const convex = new ConvexReactClient(settings.convexUrl);
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
};
