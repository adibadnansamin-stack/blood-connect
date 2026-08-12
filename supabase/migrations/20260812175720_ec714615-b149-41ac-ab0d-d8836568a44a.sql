-- donors: anon can read public columns only, and insert new listings
GRANT SELECT (id, name, blood_group, location, is_available, note, created_at) ON public.donors TO anon;
GRANT INSERT (name, blood_group, location, phone, email, is_available, note, user_id) ON public.donors TO anon;
GRANT SELECT, INSERT, UPDATE ON public.donors TO authenticated;
GRANT ALL ON public.donors TO service_role;

-- blood_requests: public board
GRANT SELECT, INSERT ON public.blood_requests TO anon;
GRANT SELECT, INSERT, UPDATE ON public.blood_requests TO authenticated;
GRANT ALL ON public.blood_requests TO service_role;

-- contact_requests: anon can create requests, donors manage their own
GRANT INSERT ON public.contact_requests TO anon;
GRANT SELECT, INSERT, UPDATE ON public.contact_requests TO authenticated;
GRANT ALL ON public.contact_requests TO service_role;