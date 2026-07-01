/*
# Add admin write RLS policies for all collection tables

1. Purpose
   The admin server functions previously used the service-role client to
   bypass RLS for writes. The service role key is not available in the
   deployment environment, so admin writes (save, delete, reorder,
   upload) all failed. This migration adds RLS write policies scoped to
   the single admin email so the authenticated admin user can write
   through RLS using their own JWT — no service role key needed.

2. Tables affected (all already have public SELECT policies)
   - site_settings
   - publications
   - projects
   - experiences
   - educations
   - awards
   - organizations
   - skill_groups
   - writings

3. Security
   - Each write policy (INSERT, UPDATE, DELETE) is scoped to
     TO authenticated with a check that the JWT email matches the
     hardcoded admin email
     (abdullah.brr12@gmail.com).
   - SELECT policies remain public (unchanged).
   - The admin email check is also enforced in application code
     (admin-config.ts + admin.functions.ts) as defense-in-depth.
*/

-- Helper: check if the authenticated user is the admin
-- Uses auth.jwt() ->> 'email' which works for Supabase JWTs
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(
    (auth.jwt() ->> 'email') = 'abdullah.brr12@gmail.com',
    false
  );
$$;

-- =========================================================
-- site_settings: admin can insert/update/delete
-- =========================================================
DROP POLICY IF EXISTS "site_settings admin write" ON public.site_settings;
CREATE POLICY "site_settings admin write"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- =========================================================
-- Collection tables: admin can insert/update/delete
-- Using FOR ALL with is_admin() check for each table
-- =========================================================

-- publications
DROP POLICY IF EXISTS "publications admin write" ON public.publications;
CREATE POLICY "publications admin write"
  ON public.publications FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- projects
DROP POLICY IF EXISTS "projects admin write" ON public.projects;
CREATE POLICY "projects admin write"
  ON public.projects FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- experiences
DROP POLICY IF EXISTS "experiences admin write" ON public.experiences;
CREATE POLICY "experiences admin write"
  ON public.experiences FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- educations
DROP POLICY IF EXISTS "educations admin write" ON public.educations;
CREATE POLICY "educations admin write"
  ON public.educations FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- awards
DROP POLICY IF EXISTS "awards admin write" ON public.awards;
CREATE POLICY "awards admin write"
  ON public.awards FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- organizations
DROP POLICY IF EXISTS "organizations admin write" ON public.organizations;
CREATE POLICY "organizations admin write"
  ON public.organizations FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- skill_groups
DROP POLICY IF EXISTS "skill_groups admin write" ON public.skill_groups;
CREATE POLICY "skill_groups admin write"
  ON public.skill_groups FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- writings
DROP POLICY IF EXISTS "writings admin write" ON public.writings;
CREATE POLICY "writings admin write"
  ON public.writings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
