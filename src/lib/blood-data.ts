export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export type BloodGroup = (typeof BLOOD_GROUPS)[number];

export const URGENCY_OPTIONS = [
  { value: "urgent", label: "Urgent — needed now" },
  { value: "within_24h", label: "Within 24 hours" },
  { value: "within_week", label: "Within a week" },
  { value: "planned", label: "Planned / scheduled" },
] as const;

export type Urgency = (typeof URGENCY_OPTIONS)[number]["value"];

export const REQUEST_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export type RequestStatus = (typeof REQUEST_STATUS_OPTIONS)[number]["value"];
