import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const respondSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["accepted", "declined"]),
});

export const listMyDonorListings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("donors")
      .select("id, name, blood_group, location, is_available, phone, email, note, created_at")
      .eq("user_id", context.userId);
    if (error) throw error;
    return data ?? [];
  });

export const listMyContactRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const respondToContactRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data) => respondSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("contact_requests")
      .update({ status: data.status })
      .eq("id", data.id)
      .select("id, status")
      .single();
    if (error) throw error;
    return row;
  });

export const setDonorAvailability = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data) => z.object({ id: z.string().uuid(), is_available: z.boolean() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("donors")
      .update({ is_available: data.is_available })
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw error;
    return { ok: true };
  });
