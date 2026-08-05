CREATE TABLE public.donors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  blood_group text NOT NULL,
  location text NOT NULL,
  phone text,
  email text,
  is_available boolean DEFAULT true,
  note text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT donors_blood_group_check CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'))
);

CREATE TABLE public.blood_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  blood_group text NOT NULL,
  location text NOT NULL,
  phone text,
  email text,
  urgency text NOT NULL DEFAULT 'urgent',
  status text NOT NULL DEFAULT 'active',
  note text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT blood_requests_blood_group_check CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  CONSTRAINT blood_requests_urgency_check CHECK (urgency IN ('urgent', 'within_24h', 'within_week', 'planned')),
  CONSTRAINT blood_requests_status_check CHECK (status IN ('active', 'fulfilled', 'cancelled'))
);

GRANT SELECT, INSERT ON public.donors TO anon;
GRANT ALL ON public.donors TO service_role;

GRANT SELECT, INSERT ON public.blood_requests TO anon;
GRANT ALL ON public.blood_requests TO service_role;

ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read donors" ON public.donors FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous insert donors" ON public.donors FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous read requests" ON public.blood_requests FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anonymous insert requests" ON public.blood_requests FOR INSERT TO anon WITH CHECK (true);