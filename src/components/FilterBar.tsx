import { Search, SlidersHorizontal } from "lucide-react";
import { BLOOD_GROUPS } from "@/lib/blood-data";

interface FilterBarProps {
  bloodGroup: string;
  location: string;
  extraValue?: string;
  extraLabel?: string;
  extraOptions?: { value: string; label: string }[];
  availableOnly?: boolean;
  onBloodGroupChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onExtraChange?: (value: string) => void;
  onAvailableOnlyChange?: (value: boolean) => void;
  onSearch: () => void;
}

export function FilterBar({
  bloodGroup,
  location,
  extraValue,
  extraLabel,
  extraOptions,
  availableOnly,
  onBloodGroupChange,
  onLocationChange,
  onExtraChange,
  onAvailableOnlyChange,
  onSearch,
}: FilterBarProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1 space-y-1.5">
          <label htmlFor="location" className="text-sm font-medium text-card-foreground">
            Location
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="City, hospital, or area"
              className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="w-full space-y-1.5 md:w-40">
          <label htmlFor="blood-group" className="text-sm font-medium text-card-foreground">
            Blood Group
          </label>
          <select
            id="blood-group"
            value={bloodGroup}
            onChange={(e) => onBloodGroupChange(e.target.value)}
            className="w-full rounded-md border border-input bg-background py-2 px-3 text-sm text-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All groups</option>
            {BLOOD_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        {extraOptions && onExtraChange && (
          <div className="w-full space-y-1.5 md:w-44">
            <label htmlFor="extra-filter" className="text-sm font-medium text-card-foreground">
              {extraLabel ?? "Filter"}
            </label>
            <select
              id="extra-filter"
              value={extraValue}
              onChange={(e) => onExtraChange(e.target.value)}
              className="w-full rounded-md border border-input bg-background py-2 px-3 text-sm text-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All</option>
              {extraOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {typeof availableOnly === "boolean" && onAvailableOnlyChange && (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-card-foreground md:pb-2.5">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => onAvailableOnlyChange(e.target.checked)}
              className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
            />
            Available only
          </label>
        )}

        <button
          type="button"
          onClick={onSearch}
          className="btn btn-primary px-5 py-2 text-sm"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Search
        </button>
      </div>
    </div>
  );
}
