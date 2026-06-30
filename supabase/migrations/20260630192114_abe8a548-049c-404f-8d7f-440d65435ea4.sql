
-- =========================================================
-- Helpers
-- =========================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================================
-- site_settings (singleton: id = 'global')
-- =========================================================
CREATE TABLE public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings public read"
  ON public.site_settings FOR SELECT
  USING (true);

-- Writes are performed by the admin via server functions running with the
-- service role (RLS bypassed). No write policies for anon/authenticated.

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- Collection tables
-- =========================================================

-- Publications
CREATE TABLE public.publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  venue TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  doi TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.publications TO anon;
GRANT SELECT ON public.publications TO authenticated;
GRANT ALL ON public.publications TO service_role;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "publications public read"
  ON public.publications FOR SELECT USING (true);
CREATE TRIGGER update_publications_updated_at
  BEFORE UPDATE ON public.publications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects public read"
  ON public.projects FOR SELECT USING (true);
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Experiences
CREATE TABLE public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.experiences TO anon;
GRANT SELECT ON public.experiences TO authenticated;
GRANT ALL ON public.experiences TO service_role;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "experiences public read"
  ON public.experiences FOR SELECT USING (true);
CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Educations
CREATE TABLE public.educations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period TEXT NOT NULL DEFAULT '',
  degree TEXT NOT NULL,
  institution TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  details TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.educations TO anon;
GRANT SELECT ON public.educations TO authenticated;
GRANT ALL ON public.educations TO service_role;
ALTER TABLE public.educations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "educations public read"
  ON public.educations FOR SELECT USING (true);
CREATE TRIGGER update_educations_updated_at
  BEFORE UPDATE ON public.educations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Awards
CREATE TABLE public.awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  org TEXT NOT NULL DEFAULT '',
  prize TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.awards TO anon;
GRANT SELECT ON public.awards TO authenticated;
GRANT ALL ON public.awards TO service_role;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "awards public read"
  ON public.awards FOR SELECT USING (true);
CREATE TRIGGER update_awards_updated_at
  BEFORE UPDATE ON public.awards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Organizations
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  org TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.organizations TO anon;
GRANT SELECT ON public.organizations TO authenticated;
GRANT ALL ON public.organizations TO service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "organizations public read"
  ON public.organizations FOR SELECT USING (true);
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Skill groups
CREATE TABLE public.skill_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_name TEXT NOT NULL,
  items TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.skill_groups TO anon;
GRANT SELECT ON public.skill_groups TO authenticated;
GRANT ALL ON public.skill_groups TO service_role;
ALTER TABLE public.skill_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "skill_groups public read"
  ON public.skill_groups FOR SELECT USING (true);
CREATE TRIGGER update_skill_groups_updated_at
  BEFORE UPDATE ON public.skill_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- Seed singleton row
-- =========================================================
INSERT INTO public.site_settings (id, data) VALUES (
  'global',
  jsonb_build_object(
    'profile', jsonb_build_object(
      'name', 'Abdullah Al Mamun',
      'initials', 'AM',
      'roles', jsonb_build_array('Technical Support Engineer', 'Researcher in Renewable Energy'),
      'tagline', 'B.Sc. EEE engineer building reliable smart-metering systems, advancing photovoltaic research, and turning ideas into award-winning ventures.',
      'location', 'Rajbari – 7700, Bangladesh',
      'email', 'abdullah.br2311@gmail.com',
      'phone', '(+880) 1730-601834',
      'status', 'Available for collaborations'
    ),
    'about', jsonb_build_object(
      'paragraphs', jsonb_build_array(
        'I''m an Electrical & Electronic Engineering graduate working at the intersection of smart-metering systems, photovoltaic research, and renewable energy integration. My day-to-day spans technical support for AMI deployments across global markets and applied research on solar-cell materials and multilevel inverters.',
        'Alongside engineering, I co-founded ventures and youth-development initiatives — winning national innovation awards and building teams that ship real outcomes. I care about reliable systems, clean energy, and turning research into impact.'
      ),
      'highlights', jsonb_build_array(
        jsonb_build_object('label','Years of research','value','2+'),
        jsonb_build_object('label','Peer-reviewed papers','value','3'),
        jsonb_build_object('label','Innovation awards','value','3'),
        jsonb_build_object('label','Countries served (AMI)','value','80+')
      )
    ),
    'research', jsonb_build_object(
      'interests', jsonb_build_array(
        'Solar cell materials & photovoltaic systems',
        'Renewable energy integration',
        'Power electronics & multilevel inverters',
        'Image processing for energy applications'
      ),
      'assistantship', jsonb_build_object(
        'role', 'Research Assistant, Department of EEE — GSTU (2 years)',
        'supervisor', 'Dr. A.T.M. Saiful Islam',
        'responsibilities', 'Proposal development, experimental design, data analysis, and implementation in renewable energy and image processing.'
      ),
      'projects', jsonb_build_array(
        jsonb_build_object('title','Renewable energy-based eco-friendly transportation system','funder','GSTU funded project','period','2021 – 2022'),
        jsonb_build_object('title','Enhancement of efficiency of multilevel inverter systems','funder','GSTU funded project','period','2023 – 2024')
      )
    ),
    'social', jsonb_build_object(
      'linkedin', 'https://www.linkedin.com/',
      'github', 'https://github.com/',
      'orcid', 'https://orcid.org/'
    ),
    'media', jsonb_build_object(
      'portraitUrl', '/__l5e/assets-v1/06639539-a2e6-4b76-8a98-ec7e88d49fa2/mamun-portrait.png',
      'logoUrl', '',
      'cvUrl', ''
    ),
    'theme', jsonb_build_object(
      'preset', 'cyan'
    ),
    'sectionOrder', jsonb_build_array('about','education','experience','skills','research','publications','projects','awards','organizations','contact'),
    'visibleSections', jsonb_build_array('about','education','experience','skills','research','publications','projects','awards','organizations','contact')
  )
);

-- Seed collections from CV
INSERT INTO public.educations (period, degree, institution, location, details, sort_order) VALUES
  ('2025', 'B.Sc. Engg. in Electrical & Electronic Engineering', 'Gopalganj Science and Technology University', 'Gopalganj – 8100, Bangladesh', 'CGPA: 3.37 / 4.00 — Last two years: 3.81 / 4.00. Focus on power electronics, photovoltaics, and renewable energy systems.', 0);

INSERT INTO public.experiences (period, title, company, description, sort_order) VALUES
  ('Apr 2026 – Present', 'Technical Support Engineer', 'Inhemeter (Inhe Co., Ltd.)', 'Global provider of smart metering, AMI, and smart energy solutions operating across 80+ countries. Oversee technical support, system reliability, and project delivery; coordinate documentation, monitoring, and training.', 0),
  ('Jun 2025 – Feb 2026', 'Assistant Engineer', 'Eresi BD Ltd. (affiliated with Eresi Solar APS, Denmark)', 'Solar PV system design, installation, and testing. Supported performance analysis and field troubleshooting for renewable energy deployments.', 1),
  ('Feb 2024 – May 2025', 'Development & Research Consultant', 'NBER, Dhaka', 'Data analysis, reporting, database management, and project feasibility support for economic research and policy analysis.', 2),
  ('Aug 2020 – Sep 2021', 'Co-Founder & Executive Director', 'N Trims, Dhaka', 'Garment trimming company specializing in custom designs. Led design/artwork analysis and overall project execution.', 3);

INSERT INTO public.skill_groups (group_name, items, sort_order) VALUES
  ('Simulation & Analysis', ARRAY['MATLAB','Simulink','Proteus','SCAPS 1D','SPSS','PSAF','Lumerical'], 0),
  ('Design & Visualization', ARRAY['Adobe Illustrator','Photoshop','Figma'], 1),
  ('Programming & Web', ARRAY['HTML','CSS','JavaScript','Bootstrap'], 2),
  ('Productivity & Research', ARRAY['LaTeX','Zotero','GitHub','MS Office'], 3),
  ('Languages', ARRAY['Bengali (Native)','English (IELTS 7)','Arabic'], 4);

INSERT INTO public.publications (title, venue, date, doi, url, sort_order) VALUES
  ('Benefits of dietary diversity for energy conservation and food security', 'International Journal of Energy Studies', 'Mar 2026', '10.58559/ijes.1783054', 'https://doi.org/10.58559/ijes.1783054', 0),
  ('HTL-free CuBi₂O₄ solar cells with 36% efficiency', 'International Journal of Energetica', 'Dec 2024', '10.47238/ijeca.v9i2.254', 'https://doi.org/10.47238/ijeca.v9i2.254', 1),
  ('Green automobile vehicle design', 'International Journal of Electrical Engineering and Applied Sciences', 'Oct 2023', '10.54554/ijeeas.2023.6.02.005', 'https://doi.org/10.54554/ijeeas.2023.6.02.005', 2);

INSERT INTO public.projects (title, summary, tags, sort_order) VALUES
  ('Smart-Metering & AMI Reliability Toolkit', 'Documentation, monitoring dashboards, and training materials supporting AMI deployments across 80+ countries.', ARRAY['Smart Metering','AMI','Reliability'], 0),
  ('HTL-free CuBi₂O₄ Photovoltaic Device', 'SCAPS-1D simulation and optimization of a hole-transport-layer-free copper bismuthate solar cell achieving 36% theoretical efficiency.', ARRAY['SCAPS-1D','Photovoltaics','Materials'], 1),
  ('Multilevel Inverter Efficiency Enhancement', 'GSTU-funded research on switching topologies and modulation strategies to reduce THD and boost conversion efficiency.', ARRAY['Power Electronics','MATLAB/Simulink'], 2),
  ('Renewable-energy-based EV System', 'Concept and prototype of an eco-friendly transportation system integrating solar charging with lightweight EV design.', ARRAY['Renewable Energy','EV','Prototype'], 3);

INSERT INTO public.awards (title, org, prize, sort_order) VALUES
  ('Youth Innovation Challenge — Winner', 'Youth Startup Summit 2025', 'BDT 300,000', 0),
  ('PRAAN Fellowship — Energy Innovation Challenge Winner', 'PRAAN, 2024', 'BDT 50,000', 1),
  ('UIHP Innovation Cohort — Runner-up', 'BSMRSTU IC1, 2024', 'BDT 50,000', 2);

INSERT INTO public.organizations (role, org, location, sort_order) VALUES
  ('Co-Founder & General Secretary', 'Future Flare Foundation', 'Dhaka & Georgia', 0),
  ('Organizational Secretary', 'Inspirations for Human Welfare, GSTU Branch', '2021 – 2022', 1),
  ('Delegate Affairs Coordinator', 'SDG Youth Summit 2022', 'Bangladesh', 2);
