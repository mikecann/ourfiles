import * as React from "react";
import { MainMenu } from "./MainMenu";

type TopRightItemsProps = {
  onDashboardClick: () => void;
};

export const TopRightItems: React.FC<TopRightItemsProps> = ({
  onDashboardClick,
}) => {
  return (
    <div className="fixed top-4 right-4 flex items-center gap-2">
      <MainMenu onDashboardClick={onDashboardClick} />
    </div>
  );
};
