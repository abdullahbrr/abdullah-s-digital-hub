## Plan to fix the existing blog system completely

### What I found
- `blog_posts` has the needed core fields, but **there are no database grants** for `anon`, `authenticated`, or `service_role`, so public/admin reads and writes can fail through the Supabase Data API.
- `blog_posts` has RLS policies, but the public read policy currently uses `roles: public` and mixes admin visibility into the public policy. I’ll make the rules explicit: public only sees published posts; admins can manage all posts.
- `blog_posts` has **no unique constraint on slug** and no update trigger, so URL conflicts and stale update ordering can happen.
- The admin editor currently saves through a generic upsert path and has weak publish validation, which can allow incomplete/blank posts to be saved or published.
- The storage bucket is private and images are proxied through `/api/public/media/...`; storage object policies already include public read, but the app needs more reliable upload handling and clearer upload errors.

### Database and storage repair
- Add explicit `blog_posts` table grants:
  - public visitors can read only published posts through RLS
  - authenticated admins can create, edit, publish, draft, and delete
  - service role keeps backend access
- Replace/normalize blog RLS policies so:
  - published posts are publicly readable
  - drafts only appear for the admin in the dashboard
  - only the configured admin email can insert/update/delete
- Add a unique slug constraint/index to prevent duplicate blog URLs.
- Add or attach the existing `updated_at` trigger to `blog_posts`.
- Keep the existing `media` bucket and proxy route; verify storage read/write policies for the `media` bucket remain public-read/admin-write.

### Code repair
- Replace the blog editor’s generic save flow with blog-specific server functions for:
  - create draft
  - update draft
  - publish/update published post
  - unpublish to draft
  - delete post
- Validate before publishing:
  - title required
  - slug required and valid
  - excerpt required
  - body/rich text required
  - cover image required
  - author required
  - status must be draft or published
  - tags/category normalized before save
- Add a `category` field to the blog editor if the database is missing it, and include it in admin/public displays.
- Preserve rich text content by saving the editor body exactly as entered and rendering it consistently on post pages.
- Improve featured image upload handling:
  - convert HEIC/HEIF before upload
  - return a stable `/api/public/media/...` URL
  - immediately update the preview after upload
  - show the actual Supabase/upload error when it fails
- Update public blog queries so published posts appear immediately after publishing, and draft posts never appear publicly.
- Invalidate the right admin and public blog query caches after every create/update/publish/delete action.

### Error handling and testing
- Show actual server/database/storage errors in the admin toast instead of silent failures.
- Add clear validation messages when publish requirements are missing.
- Test the full workflow in the preview:
  1. create a draft
  2. enter title, slug, excerpt, author, category, tags, rich text, and cover image
  3. save draft
  4. publish
  5. confirm it appears on `/blog`
  6. open the public post page and confirm content + image render
  7. edit/update published post
  8. unpublish and confirm it disappears publicly but remains in admin
  9. delete and confirm removal

### Important note
I will repair the existing `blog_posts` system and current admin screens. I will not create a separate/new blog system.