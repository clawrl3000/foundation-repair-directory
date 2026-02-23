-- Create city_content table for Foundation Scout
CREATE TABLE IF NOT EXISTS city_content (
  city_id integer PRIMARY KEY REFERENCES cities(id),
  soil_type text,
  climate_zone text,
  common_issues text[],
  avg_repair_cost_min integer,
  avg_repair_cost_max integer,
  content_body text,
  tips text[],
  created_at timestamptz DEFAULT now()
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_city_content_city_id ON city_content(city_id);