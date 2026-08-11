import { useLanguage } from "@/lib/i18n";

export function QuoteBar() {
  const { t } = useLanguage();

  return (
    <div className="w-full border-b border-primary/20 bg-primary/5 px-4 py-2.5 text-center">
      <p className="mx-auto max-w-4xl text-base italic leading-relaxed text-foreground/90 md:text-lg">
        &ldquo;{t("quote.text")}&rdquo;{" "}
        <span className="not-italic text-sm font-medium text-primary md:text-base">
          {t("quote.source")}
        </span>
      </p>
    </div>
  );
}
