import { MapPin, Droplet, CheckCircle2, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { PublicDonor } from "@/lib/donors.functions";
import { ContactRequestDialog } from "@/components/ContactRequestDialog";

interface DonorCardProps {
  donor: PublicDonor;
  showRequestButton?: boolean;
}

export function DonorCard({ donor, showRequestButton = true }: DonorCardProps) {
  const updated = donor.created_at
    ? formatDistanceToNow(new Date(donor.created_at), { addSuffix: true })
    : "Unknown";

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm card-hover">
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
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          Updated {updated}
        </span>
      </div>

      {donor.note && <p className="mt-4 text-sm text-muted-foreground">{donor.note}</p>}

      {showRequestButton && (
        <div className="mt-auto pt-5">
          <ContactRequestDialog donor={donor} />
        </div>
      )}
    </div>
  );
}
