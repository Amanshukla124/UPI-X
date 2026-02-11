import { Home, ScanLine, Wallet, Clock, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/scan-pay", icon: ScanLine, label: "Scan" },
  { to: "/wallet", icon: Wallet, label: "Wallet" },
  { to: "/history", icon: Clock, label: "History" },
  { to: "/menu", icon: Menu, label: "Menu" },
];

const BottomTabBar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-0.5 w-16 h-full text-xs transition-colors",
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomTabBar;
