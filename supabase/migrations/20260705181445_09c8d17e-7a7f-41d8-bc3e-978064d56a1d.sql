-- Ensure blog_posts has the structural guarantees the editor relies on
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS category text;

-- Add a primary key on id if the table was created without one.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'blog_posts'
      AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE public.blog_posts ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);
  END IF;
END $$;

-- Prevent duplicate public URLs. Existing rows are normalized first so the index can be created safely.
WITH ranked AS (
  SELECT id, slug, row_number() OVER (PARTITION BY slug ORDER BY created_at, id) AS rn
  FROM public.blog_posts
)
UPDATE public.blog_posts bp
SET slug = bp.slug || '-' || ranked.rn
FROM ranked
WHERE bp.id = ranked.id
  AND ranked.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_unique ON public.blog_posts (slug);

-- Keep updated_at accurate for admin ordering and cache freshness.
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Explicit Data API grants required by Supabase/PostgREST.
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Normalize blog policies: public reads published only, admin manages all.
DROP POLICY IF EXISTS "public read published posts" ON public.blog_posts;
DROP POLICY IF EXISTS "admin read posts" ON public.blog_posts;
DROP POLICY IF EXISTS "admin insert posts" ON public.blog_posts;
DROP POLICY IF EXISTS "admin update posts" ON public.blog_posts;
DROP POLICY IF EXISTS "admin delete posts" ON public.blog_posts;

CREATE POLICY "Published blog posts are public"
ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (status = 'published');

CREATE POLICY "Admin can read all blog posts"
ON public.blog_posts
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admin can create blog posts"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update blog posts"
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete blog posts"
ON public.blog_posts
FOR DELETE
TO authenticated
USING (public.is_admin());

-- Tighten media writes while keeping public reads for display/proxy.
DROP POLICY IF EXISTS "media authenticated insert" ON storage.objects;
DROP POLICY IF EXISTS "media authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "media authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "media authenticated read" ON storage.objects;
DROP POLICY IF EXISTS "media public read" ON storage.objects;
DROP POLICY IF EXISTS "admin media insert" ON storage.objects;
DROP POLICY IF EXISTS "admin media update" ON storage.objects;
DROP POLICY IF EXISTS "admin media delete" ON storage.objects;

CREATE POLICY "Media files are public"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'media');

CREATE POLICY "Admin can upload media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admin can update media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'media' AND public.is_admin())
WITH CHECK (bucket_id = 'media' AND public.is_admin());

CREATE POLICY "Admin can delete media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND public.is_admin());