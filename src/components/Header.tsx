import { Link, useRouterState } from "@tanstack/react-router";
import { Droplet, Menu, X, Home, Search, Siren, HeartHandshake, PlusCircle, LogIn } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useLanguage();
  const headerRef = useRef<HTMLElement>(null);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape and on click outside the header
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm"
    >
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4">
        <Link to="/" className="group flex min-w-0 items-center gap-2 text-primary">
          <Droplet className="h-7 w-7 shrink-0 fill-primary transition-transform duration-200 group-hover:scale-110" />
          <span className="truncate text-2xl font-extrabold tracking-tight text-foreground md:text-[1.7rem]">
            BloodConnect
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="btn p-2 text-foreground hover:bg-secondary"
            aria-label={t("nav.menu")}
            aria-expanded={open}
            aria-controls="primary-nav"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="primary-nav"
        className={`menu-panel ${open ? "is-open" : ""}`}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 pb-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`nav-link inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t(link.labelKey)}
              </Link>
            );
          })}
          <Link
            to="/auth"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-2 px-3 py-2 text-sm"
          >
            <LogIn className="h-4 w-4" />
            {t("nav.login")}
          </Link>
        </nav>
      </div>
    </header>
  );
}
