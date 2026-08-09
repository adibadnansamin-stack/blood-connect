import { Droplet, Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex flex-col gap-2">
            <Link to="/" className="flex items-center gap-2 text-primary">
              <Droplet className="h-5 w-5 fill-primary" />
              <span className="font-semibold tracking-tight text-foreground">BloodConnect</span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Connecting blood donors with those in need. Every donation can save a life.
            </p>
          </div>

          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Created by</span>
            <span>Adib Adnan</span>
            <span>CSTE-20</span>
            <span>Noakhali Science and Technology University</span>
          </div>
        </div>

        <p className="mt-8 rounded-lg border border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-card-foreground">Important:</span> BloodConnect helps
          connect blood donors and people requesting blood. Blood availability, donor eligibility,
          and medical suitability should be confirmed independently with the relevant hospital or
          medical professional.
        </p>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} BloodConnect. All rights reserved.</p>

          <p className="inline-flex items-center gap-1">
            Made with <Heart className="h-4 w-4 fill-primary text-primary" /> for humanity
          </p>
        </div>
      </div>
    </footer>
  );
}
