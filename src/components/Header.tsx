import { Link, useRouterState } from "@tanstack/react-router";
import { Droplet, Menu, X, Home, Search, Siren, HeartHandshake, PlusCircle, LogIn } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";

const navLinks = [
  { to: "/", labelKey: "nav.home", icon: Home },
  { to: "/donors", labelKey: "nav.donors", icon: Search },
  { to: "/requests", labelKey: "nav.requests", icon: Siren },
  { to: "/donate", labelKey: "nav.donate", icon: HeartHandshake },
  { to: "/request-blood", labelKey: "nav.requestBlood", icon: PlusCircle },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="group flex items-center gap-2 text-primary">
          <Droplet className="h-7 w-7 fill-primary transition-transform duration-200 group-hover:scale-110" />
          <span className="text-2xl font-extrabold tracking-tight text-foreground md:text-[1.7rem]">
            BloodConnect
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {t(link.labelKey)}
              </Link>
            );
          })}
          <LanguageToggle className="ml-2" />
          <Link
            to="/auth"
            className="btn btn-primary ml-2 px-3 py-2 text-sm"
          >
            <LogIn className="h-4 w-4" />
            {t("nav.login")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="btn p-2 text-foreground hover:bg-secondary"
            aria-label={t("nav.menu")}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {t(link.labelKey)}
                </Link>
              );
            })}
            <Link
              to="/auth"
              onClick={() => setMobileOpen(false)}
              className="btn btn-primary mt-2 px-3 py-2 text-sm"
            >
              <LogIn className="h-4 w-4" />
              {t("nav.login")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
