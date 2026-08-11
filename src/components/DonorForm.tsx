import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createDonor } from "@/lib/donors.functions";
import { BLOOD_GROUPS } from "@/lib/blood-data";
import { useLanguage } from "@/lib/i18n";

const schema = z.object({
  name: z.string().min(2, "Name is required").max(100, "Name is too long"),
  blood_group: z.string().refine((v) => BLOOD_GROUPS.includes(v as never), "Select a blood group"),
  location: z.string().min(2, "Location is required").max(200, "Location is too long"),
  phone: z.string().trim().min(6, "A phone number is required for emergency contact").max(50, "Phone number is too long"),
  email: z.string().trim().max(255, "Email is too long").email("Invalid email").optional().or(z.literal("")),
  is_available: z.boolean(),
  note: z.string().max(500, "Note is too long").optional(),
  website: z.string().max(10).optional(), // honeypot
});

type FormData = z.infer<typeof schema>;

export function DonorForm() {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();
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
        <h3 className="mt-4 text-lg font-semibold text-card-foreground">{t("form.thanksTitle")}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{t("form.thanksBody")}</p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 btn btn-primary px-4 py-2 text-sm"
        >
          {t("form.registerAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
      <input type="text" {...register("website")} className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium text-card-foreground">
          {t("form.fullName")}
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          placeholder={t("form.yourName")}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="blood_group" className="text-sm font-medium text-card-foreground">
            {t("form.bloodGroup")}
          </label>
          <select
            id="blood_group"
            {...register("blood_group")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">{t("form.selectBloodGroup")}</option>
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
            {t("form.location")}
          </label>
          <input
            id="location"
            type="text"
            {...register("location")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            placeholder={t("form.locationPlaceholder")}
          />
          {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-card-foreground">
            {t("form.phone")} <span className="font-normal text-muted-foreground">({t("form.required")})</span>
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
            {t("form.email")} <span className="font-normal text-muted-foreground">({t("form.optional")})</span>
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="you@example.com"
          />
          {errors.email ? (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">{t("form.emailHint")}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="note" className="text-sm font-medium text-card-foreground">
          {t("form.note")} <span className="font-normal text-muted-foreground">({t("form.optional")})</span>
        </label>
        <textarea
          id="note"
          rows={3}
          {...register("note")}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          placeholder={t("form.notePlaceholder")}
        />
        {errors.note && <p className="text-sm text-destructive">{errors.note.message}</p>}
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-card-foreground">
        <input
          type="checkbox"
          {...register("is_available")}
          className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
        />
        {t("form.availableNow")}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full px-5 py-2.5 text-sm sm:w-auto"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {t("form.registerDonor")}
      </button>
    </form>
  );
}
