
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  cover_url TEXT,
  body TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  author_name TEXT,
  reading_minutes INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read published posts" ON public.blog_posts
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "admin insert posts" ON public.blog_posts
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "admin update posts" ON public.blog_posts
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admin delete posts" ON public.blog_posts
  FOR DELETE TO authenticated USING (public.is_admin());

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX blog_posts_published_idx ON public.blog_posts (status, published_at DESC);
CREATE INDEX blog_posts_slug_idx ON public.blog_posts (slug);
