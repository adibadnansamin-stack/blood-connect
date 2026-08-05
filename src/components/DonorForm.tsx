import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createDonor } from "@/lib/donors.functions";
import { BLOOD_GROUPS } from "@/lib/blood-data";

const schema = z.object({
  name: z.string().min(2, "Name is required").max(100, "Name is too long"),
  blood_group: z.string().refine((v) => BLOOD_GROUPS.includes(v as never), "Select a blood group"),
  location: z.string().min(2, "Location is required").max(200, "Location is too long"),
  phone: z.string().max(50, "Phone number is too long").optional(),
  email: z.string().email("Invalid email").max(255, "Email is too long").optional().or(z.literal("")),
  is_available: z.boolean(),
  note: z.string().max(500, "Note is too long").optional(),
  website: z.string().max(10).optional(), // honeypot
});

type FormData = z.infer<typeof schema>;

export function DonorForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      is_available: true,
    },
  });

  const onSubmit = async (data: FormData) => {
    await createDonor({ data });
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
        <h3 className="mt-4 text-lg font-semibold text-card-foreground">Thank you for registering!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your donor profile has been added. People in need can now reach out to you.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Register another donor
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
      <input type="text" {...register("website")} className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium text-card-foreground">
          Full name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Your name"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="blood_group" className="text-sm font-medium text-card-foreground">
            Blood group
          </label>
          <select
            id="blood_group"
            {...register("blood_group")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select blood group</option>
            {BLOOD_GROUPS.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
          {errors.blood_group && <p className="text-sm text-destructive">{errors.blood_group.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="location" className="text-sm font-medium text-card-foreground">
            Location
          </label>
          <input
            id="location"
            type="text"
            {...register("location")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="City or area"
          />
          {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-card-foreground">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="+8801XXXXXXXXX"
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-card-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="note" className="text-sm font-medium text-card-foreground">
          Note <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="note"
          rows={3}
          {...register("note")}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Any extra details, e.g. preferred contact time"
        />
        {errors.note && <p className="text-sm text-destructive">{errors.note.message}</p>}
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-card-foreground">
        <input
          type="checkbox"
          {...register("is_available")}
          className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
        />
        I am currently available to donate
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70 sm:w-auto"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Register as donor
      </button>
    </form>
  );
}
