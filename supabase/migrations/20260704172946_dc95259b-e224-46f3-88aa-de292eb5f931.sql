
-- Allow anyone (including anonymous visitors) to read files from the media bucket
-- so the /api/public/media/$ proxy (which uses the publishable/anon key) can stream
-- cover images, portraits, and other public assets. Writes are still admin-only.
DROP POLICY IF EXISTS "media public read" ON storage.objects;
CREATE POLICY "media public read"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'media');
