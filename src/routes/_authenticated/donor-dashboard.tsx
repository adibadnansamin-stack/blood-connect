import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  BellRing,
  CheckCircle2,
  Droplet,
  LogOut,
  MapPin,
  Phone,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  listMyContactRequests,
  listMyDonorListings,
  respondToContactRequest,
  setDonorAvailability,
} from "@/lib/donor-inbox.functions";

export const Route = createFileRoute("/_authenticated/donor-dashboard")({
  head: () => ({
    meta: [
      { title: "Donor Dashboard — BloodConnect" },
      {
        name: "description",
        content:
          "Manage your donor listing and respond to blood contact requests from patients in Maijdee and Noakhali.",
      },
      { property: "og:title", content: "Donor Dashboard — BloodConnect" },
      {
        property: "og:description",
        content: "Respond to blood contact requests from patients near you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DonorDashboard,
});

function DonorDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [notifyEnabled, setNotifyEnabled] = useState(false);

  const listings = useQuery({
    queryKey: ["my-donor-listings"],
    queryFn: () => listMyDonorListings(),
  });
  const requests = useQuery({
    queryKey: ["my-contact-requests"],
    queryFn: () => listMyContactRequests(),
  });

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifyEnabled(Notification.permission === "granted");
    }
  }, []);

  // Live notifications for new requests.
  useEffect(() => {
    const channel = supabase
      .channel("donor-contact-requests")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_requests" },
        (payload) => {
          const row = payload.new as { patient_name?: string; blood_group?: string };
          void queryClient.invalidateQueries({ queryKey: ["my-contact-requests"] });
          const body = `${row.patient_name ?? "Someone"} needs ${row.blood_group ?? "blood"}.`;
          toast("New blood request", { description: body });
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            new Notification("New blood request", { body });
          }
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      toast.error("This device does not support notifications.");
      return;
    }
    const permission = await Notification.requestPermission();
    setNotifyEnabled(permission === "granted");
    if (permission === "granted") toast.success("Notifications enabled on this device");
  };

  const respond = async (id: string, status: "accepted" | "declined") => {
    try {
      await respondToContactRequest({ data: { id, status } });
      await queryClient.invalidateQueries({ queryKey: ["my-contact-requests"] });
      toast.success(status === "accepted" ? "Request accepted" : "Request declined");
    } catch {
      toast.error("Could not update the request.");
    }
  };

  const toggleAvailability = async (id: string, value: boolean) => {
    try {
      await setDonorAvailability({ data: { id, is_available: value } });
      await queryClient.invalidateQueries({ queryKey: ["my-donor-listings"] });
    } catch {
      toast.error("Could not update availability.");
    }
  };

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const pending = (requests.data ?? []).filter((r) => r.status === "pending");
  const handled = (requests.data ?? []).filter((r) => r.status !== "pending");

  return (
    <div className="px-4 py-10 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Donor dashboard</h1>
            <p className="mt-2 text-muted-foreground">
              Accept a request to share your contact details with that patient only.
            </p>
          </div>
          <div className="flex gap-2">
            {!notifyEnabled && (
              <button type="button" onClick={enableNotifications} className="btn btn-outline px-3 py-2 text-sm">
                <Bell className="h-4 w-4" />
                Enable alerts
              </button>
            )}
            <button type="button" onClick={signOut} className="btn btn-outline px-3 py-2 text-sm">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground">Your listings</h2>
          {listings.data && listings.data.length === 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              No donor listing is linked to this phone number yet. Register as a donor with the same
              number to see it here.
            </p>
          )}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(listings.data ?? []).map((listing) => (
              <div key={listing.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-card-foreground">{listing.name}</p>
                    <span className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {listing.location}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-sm font-bold text-primary-foreground">
                    <Droplet className="h-3.5 w-3.5" />
                    {listing.blood_group}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleAvailability(listing.id, !listing.is_available)}
                  className="btn btn-outline mt-4 w-full px-3 py-2 text-sm"
                >
                  {listing.is_available ? "Mark as unavailable" : "Mark as available"}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <BellRing className="h-4 w-4 text-primary" />
            Pending requests ({pending.length})
          </h2>
          <div className="mt-4 space-y-3">
            {pending.length === 0 && (
              <p className="text-sm text-muted-foreground">No pending requests right now.</p>
            )}
            {pending.map((request) => (
              <div key={request.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-semibold text-card-foreground">{request.patient_name}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                    {request.blood_group}
                  </span>
                  {request.location && (
                    <span className="text-muted-foreground">· {request.location}</span>
                  )}
                  <span className="text-muted-foreground">
                    · {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                  </span>
                </div>
                {request.note && (
                  <p className="mt-2 text-sm text-muted-foreground">{request.note}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => respond(request.id, "accepted")}
                    className="btn btn-primary px-4 py-2 text-sm"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Accept & share contact
                  </button>
                  <button
                    type="button"
                    onClick={() => respond(request.id, "declined")}
                    className="btn btn-outline px-4 py-2 text-sm"
                  >
                    <XCircle className="h-4 w-4" />
                    Decline
                  </button>
                  <a
                    href={`tel:${request.patient_phone}`}
                    className="btn btn-outline px-4 py-2 text-sm"
                  >
                    <Phone className="h-4 w-4" />
                    {request.patient_phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {handled.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-semibold text-foreground">Earlier requests</h2>
            <div className="mt-4 space-y-2">
              {handled.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm"
                >
                  <span className="font-medium text-card-foreground">{request.patient_name}</span>
                  <span className="text-muted-foreground">· {request.blood_group}</span>
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 ${
                      request.status === "accepted"
                        ? "bg-success/15 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
