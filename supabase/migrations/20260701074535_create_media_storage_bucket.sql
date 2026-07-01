/*
# Create the "media" storage bucket

1. Purpose
   The admin Media & CV page uploads portrait, logo, and CV files to a
   Supabase Storage bucket named "media". The public proxy route
   /api/public/media/$ streams files from this same bucket using the
   service-role key. Migration 20260630192400 created RLS policies for
   bucket_id = 'media' but never created the bucket itself, so every
   upload failed with "Bucket not found".

2. Changes
   - Insert a private (public = false) bucket named "media" if it does
     not already exist. Private because access is mediated by the
     service-role proxy route, not direct public URLs.

3. Security
   - The bucket is private (public = false).
   - Existing RLS policies from migration 20260630192400 already gate
     read/write to authenticated users on storage.objects for this
     bucket. No policy changes needed here.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', false)
ON CONFLICT (id) DO NOTHING;
