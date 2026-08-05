import { createFileRoute } from "@tanstack/react-router";
import { RequestForm } from "@/components/RequestForm";

export const Route = createFileRoute("/request-blood")({
  head: () => ({
    meta: [
      { title: "Request Blood — BloodConnect" },
      { name: "description", content: "Post a blood request and connect with willing donors in your area. No account required." },
      { property: "og:title", content: "Request Blood — BloodConnect" },
      { property: "og:description", content: "Post a blood request and connect with willing donors in your area. No account required." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RequestBloodPage,
});

function RequestBloodPage() {
  return (
    <div className="px-4 py-10 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Request blood</h1>
          <p className="mt-2 text-muted-foreground">
            Post your need so nearby donors can see it and reach out to help.
          </p>
        </div>
        <RequestForm />
      </div>
    </div>
  );
}
