import { Phone, Mail, MapPin, Droplet, CheckCircle2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface DonorCardProps {
  donor: Tables<"donors">;
}

export function DonorCard({ donor }: DonorCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm card-hover">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">{donor.name}</h3>
          <div className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {donor.location}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-center rounded-lg bg-primary px-3 py-2 text-primary-foreground">
          <Droplet className="h-4 w-4" />
          <span className="text-sm font-bold">{donor.blood_group}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        {donor.is_available ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-success">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Available
          </span>
        ) : (
          <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground">Unavailable</span>
        )}

      </div>

      <div className="mt-4 space-y-1.5 text-sm">
        {donor.phone && (
          <a
            href={`tel:${donor.phone}`}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <Phone className="h-4 w-4" />
            {donor.phone}
          </a>
        )}
        {donor.email && (
          <a
            href={`mailto:${donor.email}`}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <Mail className="h-4 w-4" />
            {donor.email}
          </a>
        )}
      </div>

      {donor.note && <p className="mt-4 text-sm text-muted-foreground">{donor.note}</p>}
    </div>
  );
}
