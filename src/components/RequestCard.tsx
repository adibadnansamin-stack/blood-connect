import { Phone, Mail, MapPin, Droplet, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";
import { URGENCY_OPTIONS } from "@/lib/blood-data";

interface RequestCardProps {
  request: Tables<"blood_requests">;
}

const urgencyLabel = (value: string) =>
  URGENCY_OPTIONS.find((u) => u.value === value)?.label ?? value;

const urgencyClasses: Record<string, string> = {
  urgent: "bg-destructive/15 text-destructive",
  within_24h: "bg-warning/15 text-warning-foreground",
  within_week: "bg-warning/15 text-warning-foreground",
  planned: "bg-info/15 text-info",
};


export function RequestCard({ request }: RequestCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm card-hover">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">{request.patient_name}</h3>
          <div className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {request.location}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-center rounded-lg bg-primary px-3 py-2 text-primary-foreground">
          <Droplet className="h-4 w-4" />
          <span className="text-sm font-bold">{request.blood_group}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${
            urgencyClasses[request.urgency] ?? "bg-muted text-muted-foreground"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          {urgencyLabel(request.urgency)}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-muted-foreground">
          {request.created_at ? formatDistanceToNow(new Date(request.created_at), { addSuffix: true }) : "Recently"}
        </span>
      </div>

      <div className="mt-4 space-y-1.5 text-sm">
        {request.phone && (
          <a
            href={`tel:${request.phone}`}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <Phone className="h-4 w-4" />
            {request.phone}
          </a>
        )}
        {request.email && (
          <a
            href={`mailto:${request.email}`}
            className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <Mail className="h-4 w-4" />
            {request.email}
          </a>
        )}
      </div>

      {request.note && <p className="mt-4 text-sm text-muted-foreground">{request.note}</p>}
    </div>
  );
}
