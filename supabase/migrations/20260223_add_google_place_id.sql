ALTER TABLE businesses ADD COLUMN IF NOT EXISTS google_place_id text;
CREATE INDEX IF NOT EXISTS idx_businesses_google_place_id ON businesses(google_place_id);
