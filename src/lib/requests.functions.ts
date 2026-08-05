import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { BLOOD_GROUPS, URGENCY_OPTIONS } from "./blood-data";

const requestListSchema = z.object({
  bloodGroup: z.string().optional(),
  location: z.string().optional(),
  urgency: z.string().optional(),
});

const requestInsertSchema = z.object({
  patient_name: z.string().min(2).max(100),
  blood_group: z.enum([...BLOOD_GROUPS] as [string, ...string[]]),
  location: z.string().min(2).max(200),
  phone: z.string().max(50).optional().or(z.literal("")),
  email: z.string().email().max(255).optional().or(z.literal("")),
  urgency: z.enum([...URGENCY_OPTIONS.map((u) => u.value)] as [string, ...string[]]),

  note: z.string().max(500).optional().or(z.literal("")),
  website: z.string().max(10).optional(), // honeypot
});

function createPublicSupabase() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) {
    throw new Error("Supabase environment variables are missing");
  }
  return createClient<Database>(url, key, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const listRequests = createServerFn({ method: "GET" })
  .validator((data) => requestListSchema.parse(data))
  .handler(async ({ data }) => {

    const supabase = createPublicSupabase();
    let query = supabase
      .from("blood_requests")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (data.bloodGroup && data.bloodGroup !== "all") {
      query = query.eq("blood_group", data.bloodGroup);
    }
    if (data.location) {
      query = query.ilike("location", `%${data.location}%`);
    }
    if (data.urgency && data.urgency !== "all") {
      query = query.eq("urgency", data.urgency);
    }

    const { data: requests, error } = await query;
    if (error) throw error;
    return requests ?? [];
  });

export const createRequest = createServerFn({ method: "POST" })
  .validator((data) => requestInsertSchema.parse(data))
  .handler(async ({ data }) => {

    if (data.website) {
      // Honeypot filled — silently reject bots.
      throw new Error("Invalid submission");
    }
    const supabase = createPublicSupabase();
    const payload = {
      patient_name: data.patient_name,
      blood_group: data.blood_group,
      location: data.location,
      phone: data.phone || null,
      email: data.email || null,
      urgency: data.urgency,
      note: data.note || null,
    };
    const { data: request, error } = await supabase.from("blood_requests").insert(payload).select().single();
    if (error) throw error;
    return request;
  });
