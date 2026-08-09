import { useState, type ReactNode } from "react";
import { Phone, Mail, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ContactDialogProps {
  name: string;
  bloodGroup: string;
  location: string;
  phone: string | null;
  email: string | null;
  kind: "donor" | "request";
  trigger: ReactNode;
}

export function ContactDialog({
  name,
  bloodGroup,
  location,
  phone,
  email,
  kind,
  trigger,
}: ContactDialogProps) {
  const [revealed, setRevealed] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setRevealed(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {kind === "donor" ? "Contact donor" : "Contact requester"} — {name}
          </DialogTitle>
          <DialogDescription>
            {bloodGroup} · {location}
          </DialogDescription>
        </DialogHeader>

        {!revealed ? (
          <div className="space-y-4">
            <div className="flex gap-3 rounded-lg border border-border bg-secondary/60 p-3 text-sm text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>
                Contact details are shared only for coordinating a donation. Please do not collect,
                store, share, or use them for anything else.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary w-full px-4 py-2.5"
              onClick={() => setRevealed(true)}
            >
              I agree — show contact details
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {phone && (
              <a href={`tel:${phone}`} className="btn btn-outline w-full justify-start px-4 py-2.5">
                <Phone className="h-4 w-4" />
                {phone}
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="btn btn-outline w-full justify-start px-4 py-2.5"
              >
                <Mail className="h-4 w-4" />
                {email}
              </a>
            )}
            {!phone && !email && (
              <p className="text-sm text-muted-foreground">
                No contact method was provided for this listing.
              </p>
            )}
            <p className="pt-2 text-xs text-muted-foreground">
              Always confirm eligibility and medical suitability with a hospital or medical
              professional.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
