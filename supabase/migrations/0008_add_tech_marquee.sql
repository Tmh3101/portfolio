-- 0008_add_tech_marquee.sql
-- Create tech_marquee table for scrolling stack icons

CREATE TABLE IF NOT EXISTS public.tech_marquee (
  id          bigserial PRIMARY KEY,
  label       text NOT NULL,
  icon        text,              -- Lucide icon name
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tech_marquee_sort_order_idx
  ON public.tech_marquee(sort_order ASC, id ASC);

CREATE TRIGGER tech_marquee_set_updated_at
BEFORE UPDATE ON public.tech_marquee
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- RLS: enable and allow public SELECT
ALTER TABLE public.tech_marquee ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read tech_marquee"
  ON public.tech_marquee
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin full access for authenticated users
CREATE POLICY "Admin full access on tech_marquee"
  ON public.tech_marquee
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
