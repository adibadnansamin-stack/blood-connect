import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DonorCard } from "@/components/DonorCard";
import type { PublicDonor } from "@/lib/donors.functions";

interface Props {
  donors: PublicDonor[];
}

export function DonorSlideshow({ donors }: Props) {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);

  useEffect(() => {
    const update = () => setPerView(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const pages = Math.max(1, Math.ceil(donors.length / perView));
  const page = Math.min(index, pages - 1);

  useEffect(() => {
    if (pages <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % pages), 4500);
    return () => clearInterval(timer);
  }, [pages]);

  if (donors.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        No donors registered yet. Be the first!
      </p>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {donors.map((donor) => (
            <div
              key={donor.id}
              className="w-full shrink-0 px-2.5"
              style={{ flexBasis: `${100 / perView}%` }}
            >
              <DonorCard donor={donor} showRequestButton={false} />
            </div>
          ))}
        </div>
      </div>

      {pages > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous donors"
            onClick={() => setIndex((page - 1 + pages) % pages)}
            className="btn absolute -left-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-card p-2 shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next donors"
            onClick={() => setIndex((page + 1) % pages)}
            className="btn absolute -right-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-card p-2 shadow-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === page ? "w-6 bg-primary" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
