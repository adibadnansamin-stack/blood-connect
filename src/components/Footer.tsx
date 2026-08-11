import { Droplet, Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-border bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <Link to="/" className="flex items-center gap-2 text-primary">
              <Droplet className="h-6 w-6 fill-primary" />
              <span className="text-xl font-extrabold tracking-tight text-foreground">BloodConnect</span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">{t("footer.tagline")}</p>
          </div>

          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{t("footer.createdBy")}</span>
            <span>Adib Adnan</span>
            <span>CSTE-20</span>
            <span>{t("footer.university")}</span>
          </div>
        </div>

        <p className="mt-8 rounded-lg border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-card-foreground">{t("disclaimer.label")}</span>{" "}
          {t("disclaimer.body")}
        </p>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} BloodConnect. {t("footer.rights")}
          </p>

          <p className="inline-flex items-center gap-1">
            {t("footer.made")} <Heart className="h-4 w-4 fill-primary text-primary" />{" "}
            {t("footer.humanity")}
          </p>
        </div>
      </div>
    </footer>
  );
}
