import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryOptions } from "@tanstack/react-query";
import { ArrowRight, Droplet, Search, HeartHandshake, Users, Siren, ShieldCheck, MapPin } from "lucide-react";
import { listDonors } from "@/lib/donors.functions";
import { listRequests } from "@/lib/requests.functions";
import { DonorCard } from "@/components/DonorCard";
import { RequestCard } from "@/components/RequestCard";
import { CountUp } from "@/components/CountUp";
import { BLOOD_GROUPS } from "@/lib/blood-data";

const homeStatsQueryOptions = queryOptions({
  queryKey: ["home-stats"],
  queryFn: async () => {
    const [donors, requests] = await Promise.all([
      listDonors({ data: {} }),
      listRequests({ data: {} }),
    ]);
    return {
      donorCount: donors.length,
      requestCount: requests.length,
      availableCount: donors.filter((d) => d.is_available).length,
    };
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
      { title: "BloodConnect — Blood Donors in Maijdee & Noakhali" },
      { name: "description", content: "Find blood donors or post a blood request in Maijdee, Noakhali. A local platform helping patients and donors reach each other fast." },
      { property: "og:title", content: "BloodConnect — Blood Donors in Maijdee & Noakhali" },
      { property: "og:description", content: "Find blood donors or post a blood request in Maijdee, Noakhali. A local platform helping patients and donors reach each other fast." },
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

const URGENT_LEVELS = ["urgent", "within_24h"];

function HomePage() {
  const { data: stats } = useSuspenseQuery(homeStatsQueryOptions);
  const { data: donors } = useSuspenseQuery(recentDonorsQueryOptions);
  const { data: requests } = useSuspenseQuery(recentRequestsQueryOptions);

  const recentDonors = donors.slice(0, 3);
  const urgentRequests = requests.filter((r) => URGENT_LEVELS.includes(r.urgency)).slice(0, 3);
  const recentRequestsList = requests.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-secondary/50 px-4 py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <MapPin className="h-4 w-4" />
              Serving Maijdee &amp; surrounding areas
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Find a blood donor in <span className="text-primary">Maijdee &amp; Noakhali.</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground lg:mx-0 mx-auto">
              A local platform connecting blood donors with people who need blood. No sign-up
              required.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start justify-center">
              <Link to="/donors" className="btn btn-primary px-6 py-3 text-base">
                <Search className="h-5 w-5" />
                Find donors
              </Link>
              <Link to="/request-blood" className="btn btn-outline px-6 py-3 text-base">
                Request blood
              </Link>
            </div>
          </div>

          {/* Subtle illustration */}
          <div className="relative mx-auto hidden aspect-square w-full max-w-sm lg:block" aria-hidden="true">
            <div className="absolute inset-0 rounded-full border border-primary/15" />
            <div className="absolute inset-8 rounded-full border border-primary/20" />
            <div className="absolute inset-16 rounded-full bg-primary/5" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Droplet className="h-24 w-24 fill-primary/90 text-primary/90" strokeWidth={1} />
            </div>
            {BLOOD_GROUPS.map((group, i) => {
              const angle = (i / BLOOD_GROUPS.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 46;
              return (
                <span
                  key={group}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold text-muted-foreground shadow-sm"
                  style={{
                    left: `${50 + radius * Math.cos(angle)}%`,
                    top: `${50 + radius * Math.sin(angle)}%`,
                  }}
                >
                  {group}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* Urgent blood requests */}
      <section className="border-b border-border px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                <Siren className="h-6 w-6 text-destructive" />
                Urgent blood requests
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                People who need blood right now or within 24 hours.
              </p>
            </div>
            <Link
              to="/requests"
              className="group inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-accent"
            >
              View all blood requests
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {urgentRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
            {urgentRequests.length === 0 && (
              <div className="col-span-full rounded-xl border border-border bg-card p-8 text-center">
                <p className="font-medium text-card-foreground">No urgent requests right now.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  If you need blood urgently, post a request and donors will see it here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border px-4 py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 text-center md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <Users className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-2 text-3xl font-bold text-card-foreground">
              <CountUp value={123} />
            </p>
            <p className="text-sm text-muted-foreground">Registered donors</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <HeartHandshake className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-2 text-3xl font-bold text-card-foreground">
              <CountUp value={20} />
            </p>
            <p className="text-sm text-muted-foreground">Active requests</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <ShieldCheck className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-2 text-3xl font-bold text-card-foreground">
              <CountUp value={5} />
            </p>
            <p className="text-sm text-muted-foreground">Donors available now</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <Droplet className="mx-auto h-6 w-6 fill-primary text-primary" />
            <p className="mt-2 text-3xl font-bold text-card-foreground">
              <CountUp value={BLOOD_GROUPS.length} />
            </p>
            <p className="text-sm text-muted-foreground">Blood groups</p>
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
                title: "Connect safely",
                description:
                  "Contact details are shared only as needed to help coordinate the donation.",
              },
              {
                step: "03",
                title: "Save a life",
                description: "Donors respond to requests and patients get the blood they need.",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="slide-in-step rounded-xl border border-border bg-card p-6 shadow-sm"
                style={{ animationDelay: `${i * 150}ms` }}
              >
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
              className="group hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-accent sm:inline-flex"
            >
              View all <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-8">
            <DonorSlideshow donors={recentDonors} />
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link to="/donors" className="group inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-accent">
              View all donors <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
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
              className="group hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-accent sm:inline-flex"
            >
              View all <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
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
            <Link to="/requests" className="group inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-accent">
              View all requests <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-border bg-secondary/40 px-4 py-10">
        <div className="mx-auto flex max-w-4xl gap-3 rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground shadow-sm">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            <span className="font-semibold text-card-foreground">Important:</span> BloodConnect
            helps connect blood donors and people requesting blood. Blood availability, donor
            eligibility, and medical suitability should be confirmed independently with the relevant
            hospital or medical professional.
          </p>
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
              className="btn bg-primary-foreground px-6 py-3 text-base text-primary shadow-sm hover:bg-primary-foreground/90"
            >
              Become a donor
            </Link>
            <Link
              to="/request-blood"
              className="btn border border-primary-foreground/40 bg-transparent px-6 py-3 text-base text-primary-foreground hover:bg-primary-foreground/10"
            >
              Post a request
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
