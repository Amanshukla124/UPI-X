import { User, Shield, HelpCircle, Globe, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { icon: User, label: "Profile", desc: "Manage your account" },
  { icon: Shield, label: "Security", desc: "PIN, biometrics, devices" },
  { icon: HelpCircle, label: "Support", desc: "Help & FAQs" },
  { icon: Globe, label: "Language", desc: "English" },
];

const Menu = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/splash", { replace: true });
  };
  return (
    <div className="flex flex-col p-4 gap-6">
      <header className="pt-2">
        <h1 className="text-2xl font-bold">Menu</h1>
      </header>

      <div className="flex flex-col gap-2">
        {menuItems.map(({ icon: Icon, label, desc }) => (
          <button
            key={label}
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
        <span className="text-sm font-medium">Log Out</span>
      </button>
    </div>
  );
};

export default Menu;
