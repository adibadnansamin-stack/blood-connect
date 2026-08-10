import { useEffect, useState } from "react";
import { Phone, Mail, ShieldCheck, Send, Clock3, CheckCircle2, XCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { sendContactRequest, getContactRequestStatus } from "@/lib/contact-requests.functions";
import type { PublicDonor } from "@/lib/donors.functions";
import { BLOOD_GROUPS } from "@/lib/blood-data";

interface Props {
  donor: PublicDonor;
}

type StatusRow = Awaited<ReturnType<typeof getContactRequestStatus>>;

const storageKey = (donorId: string) => `bc_request_${donorId}`;

export function ContactRequestDialog({ donor }: Props) {
  const [open, setOpen] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusRow>(null);
  const [form, setForm] = useState({
    patient_name: "",
    patient_phone: "",
    blood_group: donor.blood_group,
    location: "",
    note: "",
    website: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(storageKey(donor.id));
    if (saved) setRequestId(saved);
  }, [donor.id]);

  // Poll the request status while the dialog is open.
  useEffect(() => {
    if (!open || !requestId) return;
    let cancelled = false;
    const load = async () => {
      try {
        const row = await getContactRequestStatus({ data: { id: requestId } });
        if (!cancelled) setStatus(row);
      } catch {
        /* ignore transient errors */
      }
    };
    void load();
    const timer = setInterval(load, 5000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [open, requestId]);

  const mutation = useMutation({
    mutationFn: () => sendContactRequest({ data: { donor_id: donor.id, ...form } }),
    onSuccess: (row) => {
      if (!row) return;
      window.localStorage.setItem(storageKey(donor.id), row.id);
      setRequestId(row.id);
      toast.success("Request sent", {
        description: `${donor.name} will be notified. Contact details appear here once accepted.`,
      });
    },
    onError: () => toast.error("Could not send the request. Please check your details."),
  });

  const accepted = status?.status === "accepted";
  const declined = status?.status === "declined";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className="btn btn-outline w-full px-4 py-2.5 text-sm">
          <Send className="h-4 w-4" />
          Request contact
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request contact — {donor.name}</DialogTitle>
          <DialogDescription>
            {donor.blood_group} · {donor.location}
          </DialogDescription>
        </DialogHeader>

        {!requestId ? (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate();
            }}
          >
            <div className="flex gap-3 rounded-lg border border-border bg-secondary/60 p-3 text-sm text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>
                Contact details are private. Send a short request — the donor gets a notification
                and, if they accept, their phone number appears here.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cr-name">Your name</Label>
              <Input
                id="cr-name"
                required
                maxLength={100}
                value={form.patient_name}
                onChange={(e) => setForm({ ...form, patient_name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cr-phone">Your phone number</Label>
              <Input
                id="cr-phone"
                required
                maxLength={50}
                placeholder="01XXXXXXXXX"
                value={form.patient_phone}
                onChange={(e) => setForm({ ...form, patient_phone: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cr-group">Blood group needed</Label>
                <select
                  id="cr-group"
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={form.blood_group}
                  onChange={(e) => setForm({ ...form, blood_group: e.target.value })}
                >
                  {BLOOD_GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cr-loc">Hospital / area</Label>
                <Input
                  id="cr-loc"
                  maxLength={200}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cr-note">Message (optional)</Label>
              <Textarea
                id="cr-note"
                rows={2}
                maxLength={500}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn btn-primary w-full px-4 py-2.5"
            >
              {mutation.isPending ? "Sending…" : "Send request"}
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            {!accepted && !declined && (
              <div className="flex gap-3 rounded-lg border border-border bg-secondary/60 p-3 text-sm text-muted-foreground">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>
                  Waiting for {donor.name} to accept. This page updates automatically — keep it open
                  or check back shortly.
                </p>
              </div>
            )}

            {declined && (
              <div className="flex gap-3 rounded-lg border border-border bg-muted p-3 text-sm text-muted-foreground">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>This donor can't help right now. Please try another donor nearby.</p>
              </div>
            )}

            {accepted && (
              <>
                <div className="flex gap-3 rounded-lg border border-border bg-success/10 p-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <p>{donor.name} accepted your request. Please contact them respectfully.</p>
                </div>
                {status?.donor_phone && (
                  <a
                    href={`tel:${status.donor_phone}`}
                    className="btn btn-outline w-full justify-start px-4 py-2.5"
                  >
                    <Phone className="h-4 w-4" />
                    {status.donor_phone}
                  </a>
                )}
                {status?.donor_email && (
                  <a
                    href={`mailto:${status.donor_email}`}
                    className="btn btn-outline w-full justify-start px-4 py-2.5"
                  >
                    <Mail className="h-4 w-4" />
                    {status.donor_email}
                  </a>
                )}
                {status?.donor_note && (
                  <p className="text-sm text-muted-foreground">{status.donor_note}</p>
                )}
              </>
            )}

            <button
              type="button"
              className="text-xs text-muted-foreground underline"
              onClick={() => {
                window.localStorage.removeItem(storageKey(donor.id));
                setRequestId(null);
                setStatus(null);
              }}
            >
              Send a new request instead
            </button>

            <p className="pt-1 text-xs text-muted-foreground">
              Always confirm eligibility and medical suitability with a hospital or medical
              professional.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
