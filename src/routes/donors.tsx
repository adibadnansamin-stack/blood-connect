import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { listDonors } from "@/lib/donors.functions";
import { DonorCard } from "@/components/DonorCard";
import { FilterBar } from "@/components/FilterBar";

const donorsQueryOptions = queryOptions({
  queryKey: ["donors"],
  queryFn: () => listDonors({ data: {} }),
});

export const Route = createFileRoute("/donors")({
  head: () => ({
    meta: [
      { title: "Find Blood Donors — BloodConnect" },
      { name: "description", content: "Search blood donors by blood group and location. View contact details and reach out directly." },
      { property: "og:title", content: "Find Blood Donors — BloodConnect" },
      { property: "og:description", content: "Search blood donors by blood group and location. View contact details and reach out directly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(donorsQueryOptions);
  },
  component: DonorsPage,
});

function DonorsPage() {
  const { data: donors } = useSuspenseQuery(donorsQueryOptions);
  const [bloodGroup, setBloodGroup] = useState("all");
  const [location, setLocation] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);

  const filtered = donors.filter((donor) => {
    const matchesGroup = bloodGroup === "all" || donor.blood_group === bloodGroup;
    const matchesLocation =
      !location || donor.location.toLowerCase().includes(location.toLowerCase());
    const matchesAvailable = !availableOnly || donor.is_available;
    return matchesGroup && matchesLocation && matchesAvailable;
  });

  return (
    <div className="px-4 py-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Find blood donors</h1>
          <p className="mt-2 text-muted-foreground">
            Search by blood group and location to find someone who can help.
          </p>
        </div>

        <FilterBar
          bloodGroup={bloodGroup}
          location={location}
          availableOnly={availableOnly}
          onBloodGroupChange={setBloodGroup}
          onLocationChange={setLocation}
          onAvailableOnlyChange={setAvailableOnly}
          onSearch={() => {}}
        />

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 rounded-xl border border-border bg-card p-10 text-center">
            <p className="text-lg font-medium text-card-foreground">No donors match your filters.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try widening your search or register as a donor to help others.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
