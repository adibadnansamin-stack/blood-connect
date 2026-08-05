import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { listRequests } from "@/lib/requests.functions";
import { RequestCard } from "@/components/RequestCard";
import { FilterBar } from "@/components/FilterBar";
import { URGENCY_OPTIONS } from "@/lib/blood-data";

const requestsQueryOptions = queryOptions({
  queryKey: ["blood-requests"],
  queryFn: () => listRequests({ data: {} }),
});

export const Route = createFileRoute("/requests")({
  head: () => ({
    meta: [
      { title: "Blood Requests — BloodConnect" },
      { name: "description", content: "Browse active blood requests. Filter by blood group, location, and urgency to find someone you can help." },
      { property: "og:title", content: "Blood Requests — BloodConnect" },
      { property: "og:description", content: "Browse active blood requests. Filter by blood group, location, and urgency to find someone you can help." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(requestsQueryOptions);
  },
  component: RequestsPage,
});

function RequestsPage() {
  const { data: requests } = useSuspenseQuery(requestsQueryOptions);
  const [bloodGroup, setBloodGroup] = useState("all");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("all");

  const filtered = requests.filter((request) => {
    const matchesGroup = bloodGroup === "all" || request.blood_group === bloodGroup;
    const matchesLocation =
      !location || request.location.toLowerCase().includes(location.toLowerCase());
    const matchesUrgency = urgency === "all" || request.urgency === urgency;
    return matchesGroup && matchesLocation && matchesUrgency;
  });

  return (
    <div className="px-4 py-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Blood requests</h1>
          <p className="mt-2 text-muted-foreground">
            Active requests from patients and families. Reach out directly if you can help.
          </p>
        </div>

        <FilterBar
          bloodGroup={bloodGroup}
          location={location}
          extraValue={urgency}
          extraLabel="Urgency"
          extraOptions={URGENCY_OPTIONS.map((u) => ({ value: u.value, label: u.label }))}
          onBloodGroupChange={setBloodGroup}
          onLocationChange={setLocation}
          onExtraChange={setUrgency}
          onSearch={() => {}}
        />

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 rounded-xl border border-border bg-card p-10 text-center">
            <p className="text-lg font-medium text-card-foreground">No requests match your filters.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try widening your search or post a new blood request.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
