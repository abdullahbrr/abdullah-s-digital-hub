
Your request bundles ~5 major workstreams. I'll ship them in phases so nothing regresses. Confirm and I'll start Phase 1.

## Phase 0 — Already done (this turn)
- Enabled RLS on all content tables.
- Added admin-only write policies keyed to `abdullah.brr12@gmail.com` (via `public.is_admin()`).
- Added storage policies so the admin can upload/replace/delete files in the `media` bucket.
- Public reads still work for the portfolio.

Dashboard save + media upload should now work. Please try it once and confirm before I move on.

## Phase 1 — Security & role hardening
- Introduce proper `user_roles` table + `app_role` enum + `has_role()` security-definer function (per Lovable's role guidance).
- Seed `abdullah.brr12@gmail.com` as `admin` on signup (trigger on `auth.users`, verified-email gated).
- Replace hardcoded email check in `is_admin()` with `has_role(auth.uid(),'admin')`. Keep the email fallback only for the initial bootstrap.
- Keep admin writes going through TanStack server functions with `requireSupabaseAuth` — this stack does NOT use Supabase Edge Functions for app-internal logic (that's the current template's rule). Service role stays server-only for privileged tasks (user management, cleanup).
- Note: your prompt asked for Edge Functions specifically. On TanStack Start we use server functions instead — same security model, better DX. Tell me if you want Edge Functions anyway (e.g. for external webhooks).

## Phase 2 — Blog CMS
New tables: `blog_posts`, `blog_categories`, `blog_tags`, `blog_post_tags`, `blog_authors` (linked to `user_roles`).
Post fields: title, slug, excerpt, cover_image, body (rich HTML), category_id, tags, author_id, status (`draft`/`scheduled`/`published`), published_at, seo_title, seo_description, og_image, reading_time.
- Admin UI: list + editor with TipTap rich text editor, cover upload, category/tag pickers, SEO panel, draft/schedule/publish controls.
- Public routes: `/blog`, `/blog/category/$slug`, `/blog/tag/$slug`, `/blog/$slug` with per-post `head()` meta + JSON-LD Article schema + og:image from cover.
- Scheduled posts: `pg_cron` job flips `scheduled → published` when `published_at <= now()`.

## Phase 3 — More image-friendly sections + story-driven redesign
- New "Gallery" and "Moments" collections (image + caption + date), admin CRUD.
- Add cover_image support to existing collections that don't have it (experiences, education, awards).
- Rework homepage into a scroll-driven narrative: hero → origin story → chapters (education/experience) → featured writings → gallery strip → quotes interstitials → CTA. Preserve every existing section, just re-order and add motion (framer-motion fade/parallax).
- Bengali + English quote blocks between sections, editable from the Story admin page you already have.

## Phase 4 — Perf, responsiveness, polish
- Image: lazy loading + `srcset` via a media proxy tweak, blur placeholders.
- Route-level code splitting audit, prefetch on hover for internal links.
- Mobile pass on nav, admin sidebar, blog editor.
- Lighthouse pass + SEO scan.

## What I need from you
1. Confirm dashboard save/upload works after Phase 0.
2. Confirm you're OK with TanStack server functions instead of Supabase Edge Functions (recommended), or say "use Edge Functions".
3. Say "go" and I'll start Phase 1 → 4 in order (each phase is 1 message).
