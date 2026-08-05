import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { BLOOD_GROUPS } from "./blood-data";

const donorListSchema = z.object({
  bloodGroup: z.string().optional(),
  location: z.string().optional(),
  availableOnly: z.boolean().optional(),
});

const donorInsertSchema = z.object({
  name: z.string().min(2).max(100),
  blood_group: z.enum([...BLOOD_GROUPS] as [string, ...string[]]),
  location: z.string().min(2).max(200),
  phone: z.string().max(50).optional().or(z.literal("")),
  email: z.string().email().max(255).optional().or(z.literal("")),
  is_available: z.boolean().default(true),
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

export const listDonors = createServerFn({ method: "GET" })
  .validator((data) => donorListSchema.parse(data))
  .handler(async ({ data }) => {

    const supabase = createPublicSupabase();
    let query = supabase.from("donors").select("*").order("created_at", { ascending: false });

    if (data.bloodGroup && data.bloodGroup !== "all") {
      query = query.eq("blood_group", data.bloodGroup);
    }
    if (data.location) {
      query = query.ilike("location", `%${data.location}%`);
    }
    if (data.availableOnly) {
      query = query.eq("is_available", true);
    }

    const { data: donors, error } = await query;
    if (error) throw error;
    return donors ?? [];
  });

export const createDonor = createServerFn({ method: "POST" })
  .validator((data) => donorInsertSchema.parse(data))
  .handler(async ({ data }) => {

    if (data.website) {
      // Honeypot filled — silently reject bots.
      throw new Error("Invalid submission");
    }
    const supabase = createPublicSupabase();
    const payload = {
      name: data.name,
      blood_group: data.blood_group,
      location: data.location,
      phone: data.phone || null,
      email: data.email || null,
      is_available: data.is_available,
      note: data.note || null,
    };
    const { data: donor, error } = await supabase.from("donors").insert(payload).select().single();
    if (error) throw error;
    return donor;
  });
