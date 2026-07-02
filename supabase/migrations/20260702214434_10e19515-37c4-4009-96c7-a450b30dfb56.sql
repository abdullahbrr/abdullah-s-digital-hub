
-- Helper: is the current signed-in user the hardcoded admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lower(coalesce((auth.jwt() ->> 'email'), '')) = 'abdullah.brr12@gmail.com';
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'site_settings','publications','projects','experiences',
    'educations','awards','organizations','skill_groups','writings'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);

    EXECUTE format('DROP POLICY IF EXISTS "public read %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "admin write %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "admin update %1$s" ON public.%1$I', t);
    EXECUTE format('DROP POLICY IF EXISTS "admin delete %1$s" ON public.%1$I', t);

    EXECUTE format($p$CREATE POLICY "public read %1$s" ON public.%1$I FOR SELECT USING (true)$p$, t);
    EXECUTE format($p$CREATE POLICY "admin write %1$s" ON public.%1$I FOR INSERT TO authenticated WITH CHECK (public.is_admin())$p$, t);
    EXECUTE format($p$CREATE POLICY "admin update %1$s" ON public.%1$I FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())$p$, t);
    EXECUTE format($p$CREATE POLICY "admin delete %1$s" ON public.%1$I FOR DELETE TO authenticated USING (public.is_admin())$p$, t);
  END LOOP;
END $$;

-- Storage: admin can manage files in the "media" bucket; public read stays via signed proxy.
DROP POLICY IF EXISTS "admin media insert" ON storage.objects;
DROP POLICY IF EXISTS "admin media update" ON storage.objects;
DROP POLICY IF EXISTS "admin media delete" ON storage.objects;

CREATE POLICY "admin media insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "admin media update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.is_admin())
  WITH CHECK (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "admin media delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.is_admin());
