import { User, Shield, HelpCircle, Globe, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/contexts/I18nContext";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const { logout } = useAuth();
  const { t, language } = useI18n();
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: t("menu.profile"), desc: t("menu.profile_desc"), route: null },
    { icon: Shield, label: t("menu.security"), desc: t("menu.security_desc"), route: null },
    { icon: HelpCircle, label: t("menu.support"), desc: t("menu.support_desc"), route: "/support" },
    { icon: Globe, label: t("menu.language"), desc: language === "hi" ? "हिंदी" : "English", route: "/language" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/splash", { replace: true });
  };

  return (
    <div className="flex flex-col p-4 gap-6">
      <header className="pt-2">
        <h1 className="text-2xl font-bold">{t("menu.title")}</h1>
      </header>

      <div className="flex flex-col gap-2">
        {menuItems.map(({ icon: Icon, label, desc, route }) => (
          <button
            key={label}
            onClick={() => route && navigate(route)}
            className="flex items-center gap-3 rounded-xl bg-card p-4 text-left transition-colors active:bg-muted"
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      <button onClick={handleLogout} className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-destructive mt-4 active:bg-destructive/20 transition-colors">
        <LogOut className="h-5 w-5" />
        <span className="text-sm font-medium">{t("menu.logout")}</span>
      </button>
    </div>
  );
};

export default Menu;
