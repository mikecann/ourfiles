import * as React from "react";
import { MainMenu } from "./MainMenu";

export const TopRightItems: React.FC = () => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <MainMenu />
    </div>
  );
};
