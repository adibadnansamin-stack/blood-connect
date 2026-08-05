# Blood Donor & Receiver Platform

## What we're building
A public, no-login website that connects blood donors with people who need blood. It combines a searchable donor directory with a request board where receivers can post urgent needs. Visitors can register as donors or post a blood request through simple contact forms.

## Pages & routes

```text
/              Home — hero search, how it works, quick CTAs
/donors        Donor directory — searchable/filterable donor cards
/donate        Register as a donor form
/requests      Blood request board — list of active needs
/request-blood Post a blood request form
```

## Core features

1. **Homepage (hero search)**
   - Large hero with blood-group selector and location search.
   - Quick stats: registered donors, open requests, lives helped (static or counted from DB).
   - CTAs: "Become a donor", "Request blood", "Find donors".
   - "How it works" section with 3 steps.

2. **Donor directory (`/donors`)**
   - Cards showing donor name, blood group, location, availability, contact phone/email.
   - Filters: blood group (A+, A-, B+, B-, AB+, AB-, O+, O-), location text search, availability.
   - Sort by newest or nearest-match.

3. **Request board (`/requests`)**
   - Cards showing patient need: blood group, hospital/location, urgency, contact info, posted time.
   - Filters: blood group, location, urgency.
   - Status: active / fulfilled.

4. **Forms**
   - **Donor registration**: name, blood group, location, phone, email, availability status, optional note.
   - **Blood request**: patient name, required blood group, hospital/location, contact phone/email, urgency, optional note.
   - Client-side validation (required fields, valid email/phone format) and server-side Zod validation.
   - Success confirmation after submission.

## Data model (Lovable Cloud / Supabase)

Two public tables, with RLS policies allowing anonymous SELECT and INSERT (no auth required by design).

**`public.donors`**
- `id` uuid primary key
- `name` text not null
- `blood_group` text not null (validated to allowed values)
- `location` text not null
- `phone` text
- `email` text
- `is_available` boolean default true
- `note` text
- `created_at` timestamptz default now()

**`public.blood_requests`**
- `id` uuid primary key
- `patient_name` text not null
- `blood_group` text not null
- `location` text not null
- `phone` text
- `email` text
- `urgency` text (e.g. "urgent", "within 24h", "within a week")
- `status` text default "active" (active / fulfilled)
- `note` text
- `created_at` timestamptz default now()

Both tables get `GRANT SELECT, INSERT` to `anon` and `ALL` to `service_role`.

## Design direction

- **Palette**: Crimson Care — clean white background (#ffffff), light surface (#f8f9fa), primary red (#dc2626), dark red (#991b1b).
- **Layout**: Hero search on the homepage, card grids for directory and request board.
- **Typography**: Clean sans-serif, medical/trustworthy feel.
- **Tokens**: Update `src/styles.css` with the chosen palette mapped to semantic tokens (`--primary`, `--accent`, etc.) in oklch format.

## Technical notes

- Use TanStack Start file-based routing; each page gets its own route file and `head()` metadata.
- Use `createServerFn` for reading donor/request lists and inserting new records.
- Public server functions (no auth middleware) because the site is anonymous.
- Validate all inputs with Zod on both client and server.
- Keep contact info visible on cards since the chosen model is public contact forms.
- Add a simple honeypot field to reduce spam submissions.
- No authentication required; skip the `_authenticated` layout entirely.

## Implementation order

1. Enable Lovable Cloud and create the two tables with policies and grants.
2. Update design tokens in `src/styles.css` to match Crimson Care.
3. Build shared components: Header, Footer, DonorCard, RequestCard, FilterBar, DonorForm, RequestForm.
4. Build routes: `__root.tsx` layout, `/`, `/donors`, `/requests`, `/donate`, `/request-blood`.
5. Add server functions for listing, filtering, and inserting donors and requests.
6. Add a footer credits section with the following attribution on separate lines:
   - "Created by Adib Adnan"
   - "CSTE-20"
   - "Noakhali Science and Technology University"
7. Add SEO metadata and test form submissions end-to-end.

