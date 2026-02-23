-- Add bbb_data JSONB column to businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS bbb_data JSONB;

-- Add comment for documentation
COMMENT ON COLUMN businesses.bbb_data IS 'BBB (Better Business Bureau) data including rating, accreditation status, complaint count, years accredited, and profile URL';