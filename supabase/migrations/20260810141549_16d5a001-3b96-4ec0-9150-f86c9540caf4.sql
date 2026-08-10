-- 1. Link donor listings to auth users
ALTER TABLE public.donors ADD COLUMN IF NOT EXISTS user_id uuid;
CREATE INDEX IF NOT EXISTS donors_user_id_idx ON public.donors(user_id);

-- 2. Hide donor contact columns from anonymous readers (column-level grants)
REVOKE SELECT ON public.donors FROM anon;
GRANT SELECT (id, name, blood_group, location, is_available, note, created_at, user_id) ON public.donors TO anon;
GRANT SELECT (id, name, blood_group, location, is_available, note, created_at, user_id) ON public.donors TO authenticated;
GRANT ALL ON public.donors TO service_role;

-- donors can manage their own listing
CREATE POLICY "Donors can read own listing" ON public.donors
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Donors can update own listing" ON public.donors
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
GRANT UPDATE ON public.donors TO authenticated;

-- 3. Contact requests
CREATE TABLE public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid NOT NULL REFERENCES public.donors(id) ON DELETE CASCADE,
  patient_name text NOT NULL,
  patient_phone text NOT NULL,
  blood_group text NOT NULL,
  location text,
  note text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX contact_requests_donor_idx ON public.contact_requests(donor_id, created_at DESC);

GRANT INSERT ON public.contact_requests TO anon;
GRANT SELECT, UPDATE ON public.contact_requests TO authenticated;
GRANT ALL ON public.contact_requests TO service_role;

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send a contact request" ON public.contact_requests
  FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending');

CREATE POLICY "Donors can read requests sent to them" ON public.contact_requests
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.donors d WHERE d.id = donor_id AND d.user_id = auth.uid()));

CREATE POLICY "Donors can answer requests sent to them" ON public.contact_requests
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.donors d WHERE d.id = donor_id AND d.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.donors d WHERE d.id = donor_id AND d.user_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_contact_requests_updated_at
BEFORE UPDATE ON public.contact_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Patient-side status lookup (returns donor contact only once accepted)
CREATE OR REPLACE FUNCTION public.get_contact_request_status(_id uuid)
RETURNS TABLE (
  id uuid,
  status text,
  donor_name text,
  donor_blood_group text,
  donor_location text,
  donor_note text,
  donor_phone text,
  donor_email text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    cr.id,
    cr.status,
    d.name,
    d.blood_group,
    d.location,
    CASE WHEN cr.status = 'accepted' THEN d.note ELSE NULL END,
    CASE WHEN cr.status = 'accepted' THEN d.phone ELSE NULL END,
    CASE WHEN cr.status = 'accepted' THEN d.email ELSE NULL END,
    cr.created_at
  FROM public.contact_requests cr
  JOIN public.donors d ON d.id = cr.donor_id
  WHERE cr.id = _id
$$;
GRANT EXECUTE ON FUNCTION public.get_contact_request_status(uuid) TO anon, authenticated;

-- 5. Claim donor listings matching the signed-in user's phone number
CREATE OR REPLACE FUNCTION public.claim_donor_listings()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  auth_phone text;
  claimed integer;
BEGIN
  SELECT regexp_replace(coalesce(u.phone, ''), '\D', '', 'g') INTO auth_phone
  FROM auth.users u WHERE u.id = auth.uid();

  IF auth_phone IS NULL OR length(auth_phone) < 8 THEN
    RETURN 0;
  END IF;

  UPDATE public.donors
  SET user_id = auth.uid()
  WHERE user_id IS NULL
    AND right(regexp_replace(coalesce(phone, ''), '\D', '', 'g'), 9) = right(auth_phone, 9);

  GET DIAGNOSTICS claimed = ROW_COUNT;
  RETURN claimed;
END;
$$;
GRANT EXECUTE ON FUNCTION public.claim_donor_listings() TO authenticated;

-- 6. Realtime for donor notifications
ALTER TABLE public.contact_requests REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_requests;