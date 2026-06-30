
-- Allow authenticated users to upload/manage files in the media bucket.
-- The admin-email check is enforced server-side in the upload server fn;
-- this RLS just makes sure no anon can write.
CREATE POLICY "media authenticated read"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media');

CREATE POLICY "media authenticated insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media');

CREATE POLICY "media authenticated update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media');

CREATE POLICY "media authenticated delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media');
