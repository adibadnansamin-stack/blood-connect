import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-border bg-background p-0.5 ${className}`}
      role="group"
      aria-label={t("lang.label")}
    >
      <Globe className="ml-2 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
          lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("bn")}
        aria-pressed={lang === "bn"}
        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
          lang === "bn" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        বাংলা
      </button>
    </div>
  );
}
