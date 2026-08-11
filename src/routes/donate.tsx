import { createFileRoute } from "@tanstack/react-router";
import { DonorForm } from "@/components/DonorForm";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Become a Blood Donor — BloodConnect" },
      { name: "description", content: "Register as a blood donor and help patients in need. No account required." },
      { property: "og:title", content: "Become a Blood Donor — BloodConnect" },
      { property: "og:description", content: "Register as a blood donor and help patients in need. No account required." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DonatePage,
});

function DonatePage() {
  const { t } = useLanguage();
  return (
    <div className="px-4 py-10 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t("donate.title")}
          </h1>
          <p className="mt-2 text-muted-foreground">{t("donate.subtitle")}</p>
        </div>
        <DonorForm />
      </div>
    </div>
  );
}
