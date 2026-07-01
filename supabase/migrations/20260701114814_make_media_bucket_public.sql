/*
# Make the media storage bucket public for reads

1. Purpose
   The media proxy route streams files from the "media" bucket. It
   previously used the service role key, which is not available in the
   deployment environment. Making the bucket public allows reads via
   the publishable key (or even unauthenticated), while writes remain
   gated by the authenticated RLS policies from migration
   20260630192400.

2. Changes
   - Set public = true on the "media" bucket.
   - Add a public SELECT policy on storage.objects for the media bucket
     so anon users can read files (needed for the public proxy route
     and for direct browser access).
*/

UPDATE storage.buckets
SET public = true
WHERE id = 'media';

DROP POLICY IF EXISTS "media public read" ON storage.objects;
CREATE POLICY "media public read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'media');
