import { useNavigate } from "react-router-dom";
import { Globe, Check } from "lucide-react";
import { useI18n, type Language } from "@/contexts/I18nContext";
import { toast } from "sonner";

const languages: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
];

const LanguageSettings = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useI18n();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    toast.success(t("lang.changed"));
  };

  return (
    <div className="flex flex-col p-4 gap-6">
      <header className="pt-2">
        <h1 className="text-2xl font-bold">{t("lang.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("lang.select")}</p>
      </header>

      <div className="space-y-2">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={`w-full flex items-center gap-3 rounded-xl border p-4 transition-colors ${
              language === lang.code
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            }`}
          >
            <Globe className={`h-5 w-5 ${language === lang.code ? "text-primary" : "text-muted-foreground"}`} />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">{lang.native}</p>
              <p className="text-xs text-muted-foreground">{lang.label}</p>
            </div>
            {language === lang.code && (
              <Check className="h-5 w-5 text-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSettings;
