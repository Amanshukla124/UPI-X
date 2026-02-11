import { Outlet } from "react-router-dom";
import BottomTabBar from "./BottomTabBar";

const MobileLayout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 pb-16 safe-top">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
};

export default MobileLayout;
