
CREATE TABLE public.writings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null default '',
  kind text not null default 'essay',
  summary text not null default '',
  body text not null default '',
  tags text[] not null default '{}',
  cover_url text not null default '',
  date text not null default '',
  url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT ON public.writings TO anon, authenticated;
GRANT ALL ON public.writings TO service_role;

ALTER TABLE public.writings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "writings public read" ON public.writings FOR SELECT USING (true);

CREATE TRIGGER set_writings_updated_at BEFORE UPDATE ON public.writings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed a couple of writings so the section isn't empty
INSERT INTO public.writings (title, kind, summary, body, tags, date, sort_order) VALUES
('Why renewable energy is personal', 'essay',
 'A short reflection on growing up with unreliable power and choosing energy engineering as a career.',
 'Electricity is invisible — until it isn''t. Most of the choices I''ve made as an engineer trace back to nights spent under a kerosene lamp, finishing homework while waiting for the grid to come back.',
 ARRAY['energy','personal'], '2024', 0),
('Field notes from a 100 kW rooftop', 'essay',
 'What a single commissioning week taught me about MPPT, dust, and the gap between datasheets and reality.',
 'Datasheets promise clean curves. Rooftops give you shading, soiling, and inverters that argue with each other. This is what I learned standing on one for a week.',
 ARRAY['solar','field'], '2024', 1),
('On staying curious', 'poetry',
 'A short poem about engineering as a way of paying attention.',
 'Curiosity is just attention\nthat refuses to look away.',
 ARRAY['poetry'], '2023', 2);

-- Update site_settings with quotes, hero story, and add 'writings' to section order
UPDATE public.site_settings
SET data = jsonb_set(
  jsonb_set(
    jsonb_set(
      COALESCE(data, '{}'::jsonb),
      '{quotes}',
      '[
        {"text":"Engineering is curiosity made useful.","author":"Abdullah Al Mamun"},
        {"text":"The sun does not ask permission to rise. Neither should the questions you ask of it.","author":"Field notebook, 2023"},
        {"text":"Research is just a slower kind of hope.","author":"Abdullah Al Mamun"}
      ]'::jsonb
    ),
    '{story}',
    '{"intro":"From a small town with unreliable power to commissioning rooftops and shipping smart meters — this is the long version.","chapters":[
      {"year":"2014","title":"First curiosity","body":"A burned-out transformer in our neighborhood made me ask my first real engineering question: why?"},
      {"year":"2019","title":"Into the lab","body":"Started B.Sc. in EEE at RUET. Photovoltaics chose me before I chose it."},
      {"year":"2022","title":"Onto the rooftops","body":"Field commissioning, fault-finding, and a deep respect for the gap between simulation and reality."},
      {"year":"2024","title":"Building, writing, mentoring","body":"Technical support engineer by day, researcher and writer the rest of the time."}
    ]}'::jsonb
  ),
  '{sectionOrder}',
  CASE
    WHEN data->'sectionOrder' ? 'writings'
      THEN data->'sectionOrder'
    ELSE COALESCE(data->'sectionOrder', '["about","education","experience","skills","research","publications","projects","awards","organizations","contact"]'::jsonb)
         || '["writings"]'::jsonb
  END
)
WHERE id = 'global';

-- Also ensure visibleSections includes writings
UPDATE public.site_settings
SET data = jsonb_set(
  data,
  '{visibleSections}',
  CASE
    WHEN data->'visibleSections' IS NULL OR NOT (data->'visibleSections' ? 'writings')
      THEN COALESCE(data->'visibleSections', '["about","education","experience","skills","research","publications","projects","awards","organizations","contact"]'::jsonb)
           || '["writings"]'::jsonb
    ELSE data->'visibleSections'
  END
)
WHERE id = 'global';
