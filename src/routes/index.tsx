import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { ArrowRight, Droplet, Search, HeartHandshake, Users } from "lucide-react";
import { listDonors } from "@/lib/donors.functions";
import { listRequests } from "@/lib/requests.functions";
import { DonorCard } from "@/components/DonorCard";
import { RequestCard } from "@/components/RequestCard";
import { BLOOD_GROUPS } from "@/lib/blood-data";

const homeStatsQueryOptions = queryOptions({
  queryKey: ["home-stats"],
  queryFn: async () => {
    const [donors, requests] = await Promise.all([
      listDonors({ data: {} }),
      listRequests({ data: {} }),
    ]);
    return { donorCount: donors.length, requestCount: requests.length };
  },
});

const recentDonorsQueryOptions = queryOptions({
  queryKey: ["recent-donors"],
  queryFn: () => listDonors({ data: {} }),
});

const recentRequestsQueryOptions = queryOptions({
  queryKey: ["recent-requests"],
  queryFn: () => listRequests({ data: {} }),
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BloodConnect — Find Blood Donors & Request Blood" },
      { name: "description", content: "Connect with blood donors or post a blood request. A simple, public platform helping patients and donors find each other quickly." },
      { property: "og:title", content: "BloodConnect — Find Blood Donors & Request Blood" },
      { property: "og:description", content: "Connect with blood donors or post a blood request. A simple, public platform helping patients and donors find each other quickly." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(homeStatsQueryOptions),
      context.queryClient.ensureQueryData(recentDonorsQueryOptions),
      context.queryClient.ensureQueryData(recentRequestsQueryOptions),
    ]);
  },
  component: HomePage,
});

function HomePage() {
  const { data: stats } = useSuspenseQuery(homeStatsQueryOptions);
  const { data: donors } = useSuspenseQuery(recentDonorsQueryOptions);
  const { data: requests } = useSuspenseQuery(recentRequestsQueryOptions);

  const recentDonors = donors.slice(0, 3);
  const recentRequestsList = requests.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-secondary/50 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Droplet className="h-4 w-4 fill-primary" />
            Save a life today
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Find a blood donor. <span className="text-primary">Or become one.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A simple, public platform connecting blood donors with patients in need. No sign-up required.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/donors"
              className="btn btn-primary px-6 py-3 text-base"
            >
              <Search className="h-5 w-5" />
              Find donors
            </Link>
            <Link
              to="/request-blood"
              className="btn btn-outline px-6 py-3 text-base"
            >
              Request blood
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border px-4 py-10">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 text-center md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <Users className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-2 text-3xl font-bold text-card-foreground">{stats.donorCount}</p>
            <p className="text-sm text-muted-foreground">Registered donors</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <HeartHandshake className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-2 text-3xl font-bold text-card-foreground">{stats.requestCount}</p>
            <p className="text-sm text-muted-foreground">Open requests</p>
          </div>
          <div className="col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm md:col-span-1">
            <Droplet className="mx-auto h-6 w-6 fill-primary text-primary" />
            <p className="mt-2 text-3xl font-bold text-card-foreground">{BLOOD_GROUPS.length}</p>
            <p className="text-sm text-muted-foreground">Blood groups supported</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            How it works
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Search or post",
                description: "Find donors by blood group and location, or post a blood request.",
              },
              {
                step: "02",
                title: "Connect directly",
                description: "Contact details are shared openly so you can reach out immediately.",
              },
              {
                step: "03",
                title: "Save a life",
                description: "Donors respond to requests and patients get the blood they need.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <span className="text-sm font-bold text-primary">{item.step}</span>
                <h3 className="mt-3 text-lg font-semibold text-card-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent donors */}
      <section className="bg-secondary/30 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Recent donors</h2>
              <p className="mt-1 text-sm text-muted-foreground">People ready to donate blood near you.</p>
            </div>
            <Link
              to="/donors"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentDonors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
            {recentDonors.length === 0 && (
              <p className="col-span-full text-center text-sm text-muted-foreground">
                No donors registered yet. Be the first!
              </p>
            )}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link to="/donors" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all donors <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recent requests */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Recent requests</h2>
              <p className="mt-1 text-sm text-muted-foreground">Patients currently looking for blood.</p>
            </div>
            <Link
              to="/requests"
              className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentRequestsList.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
            {recentRequestsList.length === 0 && (
              <p className="col-span-full text-center text-sm text-muted-foreground">
                No active blood requests right now.
              </p>
            )}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link to="/requests" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all requests <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary px-4 py-16 text-primary-foreground">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Ready to make a difference?</h2>
          <p className="mt-3 text-primary-foreground/90">
            Whether you want to donate or need blood, it only takes a minute to get started.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/donate"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-foreground px-6 py-3 text-base font-medium text-primary transition-colors hover:bg-primary-foreground/90"
            >
              Become a donor
            </Link>
            <Link
              to="/request-blood"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-primary-foreground/30 bg-transparent px-6 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Post a request
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
