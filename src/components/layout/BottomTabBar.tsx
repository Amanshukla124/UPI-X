import { Home, ScanLine, Wallet, Clock, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useI18n } from "@/contexts/I18nContext";

const BottomTabBar = () => {
  const { t } = useI18n();

  const tabs = [
    { to: "/", icon: Home, label: t("dashboard.greeting").split(" ")[0] === "सुप्रभात" ? "होम" : "Home" },
    { to: "/scan-pay", icon: ScanLine, label: t("dashboard.greeting").split(" ")[0] === "सुप्रभात" ? "स्कैन" : "Scan" },
    { to: "/wallet", icon: Wallet, label: t("wallet.title") },
    { to: "/history", icon: Clock, label: t("dashboard.greeting").split(" ")[0] === "सुप्रभात" ? "इतिहास" : "History" },
    { to: "/menu", icon: Menu, label: t("menu.title") },
  ];

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
