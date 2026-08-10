import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { BLOOD_GROUPS } from "./blood-data";

const sendSchema = z.object({
  donor_id: z.string().uuid(),
  patient_name: z.string().trim().min(2).max(100),
  patient_phone: z.string().trim().min(6).max(50),
  blood_group: z.enum([...BLOOD_GROUPS] as [string, ...string[]]),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  note: z.string().trim().max(500).optional().or(z.literal("")),
  website: z.string().max(10).optional(), // honeypot
});

const statusSchema = z.object({ id: z.string().uuid() });

function createPublicSupabase() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Supabase environment variables are missing");
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export const sendContactRequest = createServerFn({ method: "POST" })
  .validator((data) => sendSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) throw new Error("Invalid submission");
    const supabase = createPublicSupabase();
    const { data: inserted, error } = await supabase
      .from("contact_requests")
      .insert({
        donor_id: data.donor_id,
        patient_name: data.patient_name,
        patient_phone: data.patient_phone,
        blood_group: data.blood_group,
        location: data.location || null,
        note: data.note || null,
        status: "pending",
      })
      .select("id, status, created_at")
      .single();
    if (error) throw error;
    return inserted;
  });

export const getContactRequestStatus = createServerFn({ method: "GET" })
  .validator((data) => statusSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createPublicSupabase();
    const { data: rows, error } = await supabase.rpc("get_contact_request_status", {
      _id: data.id,
    });
    if (error) throw error;
    return rows?.[0] ?? null;
  });
