-- Foundation Repair Directory — Supabase Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- States lookup
CREATE TABLE states (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  abbreviation CHAR(2) NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

-- Cities
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  state_id INTEGER REFERENCES states(id),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  population INTEGER,
  UNIQUE(slug, state_id)
);

-- Service types (foundation repair categories)
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_service_id INTEGER REFERENCES services(id)
);

-- Features (filterable attributes)
CREATE TABLE features (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category TEXT -- e.g., 'warranty', 'payment', 'service'
);

-- ============================================
-- BUSINESS LISTINGS
-- ============================================

CREATE TABLE businesses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website_url TEXT,
  
  -- Address
  address TEXT,
  city_id INTEGER REFERENCES cities(id),
  state_id INTEGER REFERENCES states(id),
  zip TEXT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  
  -- Business info
  description TEXT,
  year_established INTEGER,
  license_number TEXT,
  
  -- Ratings
  rating DECIMAL(2,1),
  review_count INTEGER DEFAULT 0,
  
  -- Status
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_claimed BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  -- Data quality
  data_quality_score INTEGER DEFAULT 0, -- 0-100
  data_source TEXT, -- 'google_maps', 'bbb', 'manual', etc.
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(slug, state_id)
);

-- Junction: businesses <-> services
CREATE TABLE business_services (
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (business_id, service_id)
);

-- Junction: businesses <-> features
CREATE TABLE business_features (
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  feature_id INTEGER REFERENCES features(id) ON DELETE CASCADE,
  value TEXT, -- e.g., 'lifetime', '25 years', 'yes'
  PRIMARY KEY (business_id, feature_id)
);

-- Service areas
CREATE TABLE service_areas (
  id SERIAL PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  city_id INTEGER REFERENCES cities(id),
  state_id INTEGER REFERENCES states(id),
  radius_miles INTEGER
);

-- Business images
CREATE TABLE business_images (
  id SERIAL PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  source TEXT -- 'website', 'uploaded', 'stock'
);

-- Pricing data
CREATE TABLE pricing_data (
  id SERIAL PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id),
  price_min DECIMAL(10,2),
  price_max DECIMAL(10,2),
  price_unit TEXT, -- 'per_pier', 'per_sqft', 'flat_rate'
  source TEXT,
  last_verified TIMESTAMPTZ
);

-- ============================================
-- LEAD GENERATION
-- ============================================

CREATE TABLE leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id),
  
  -- Contact info
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  
  -- Request details
  message TEXT,
  service_needed TEXT,
  property_type TEXT, -- 'residential', 'commercial'
  urgency TEXT, -- 'emergency', 'soon', 'planning'
  
  -- Tracking
  source_page TEXT,
  ip_address TEXT,
  user_agent TEXT,
  
  -- Status
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'converted', 'closed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SEO CONTENT
-- ============================================

-- Auto-generated city page content
CREATE TABLE city_content (
  id SERIAL PRIMARY KEY,
  city_id INTEGER REFERENCES cities(id) UNIQUE,
  intro_text TEXT, -- 200-400 word unique intro
  meta_title TEXT,
  meta_description TEXT,
  faq_json JSONB, -- FAQ schema data
  avg_price_min DECIMAL(10,2),
  avg_price_max DECIMAL(10,2),
  listing_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_businesses_city ON businesses(city_id);
CREATE INDEX idx_businesses_state ON businesses(state_id);
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_active ON businesses(is_active);
CREATE INDEX idx_businesses_rating ON businesses(rating DESC NULLS LAST);
CREATE INDEX idx_cities_state ON cities(state_id);
CREATE INDEX idx_cities_slug ON cities(slug);
CREATE INDEX idx_service_areas_business ON service_areas(business_id);
CREATE INDEX idx_service_areas_city ON service_areas(city_id);
CREATE INDEX idx_leads_business ON leads(business_id);
CREATE INDEX idx_leads_status ON leads(status);

-- ============================================
-- SEED DATA: Services
-- ============================================

INSERT INTO services (name, slug, description) VALUES
  ('Foundation Repair', 'foundation-repair', 'General foundation repair services'),
  ('Pier & Beam Repair', 'pier-and-beam-repair', 'Repair for pier and beam foundations'),
  ('Slab Foundation Repair', 'slab-foundation-repair', 'Repair for concrete slab foundations'),
  ('Wall Anchor Installation', 'wall-anchor-installation', 'Anchoring systems for bowing basement walls'),
  ('Foundation Crack Repair', 'foundation-crack-repair', 'Sealing and repairing foundation cracks'),
  ('Basement Waterproofing', 'basement-waterproofing', 'Waterproofing solutions for basements'),
  ('Crawl Space Repair', 'crawl-space-repair', 'Crawl space encapsulation and repair'),
  ('House Leveling', 'house-leveling', 'Leveling services for settling foundations'),
  ('Underpinning', 'underpinning', 'Strengthening and stabilizing existing foundations'),
  ('Drainage Solutions', 'drainage-solutions', 'French drains and drainage systems'),
  ('Concrete Lifting', 'concrete-lifting', 'Mudjacking and polyurethane foam lifting'),
  ('Seawall Repair', 'seawall-repair', 'Foundation repair for waterfront structures');

-- ============================================
-- SEED DATA: Features
-- ============================================

INSERT INTO features (name, slug, category) VALUES
  ('Free Inspection', 'free-inspection', 'service'),
  ('Lifetime Warranty', 'lifetime-warranty', 'warranty'),
  ('Transferable Warranty', 'transferable-warranty', 'warranty'),
  ('25-Year Warranty', '25-year-warranty', 'warranty'),
  ('Licensed & Insured', 'licensed-insured', 'credentials'),
  ('Financing Available', 'financing-available', 'payment'),
  ('Emergency Service', 'emergency-service', 'service'),
  ('Free Estimates', 'free-estimates', 'service'),
  ('Residential', 'residential', 'service_type'),
  ('Commercial', 'commercial', 'service_type'),
  ('BBB Accredited', 'bbb-accredited', 'credentials'),
  ('Veteran Owned', 'veteran-owned', 'credentials'),
  ('Family Owned', 'family-owned', 'credentials'),
  ('24/7 Available', '24-7-available', 'service'),
  ('Accepts Insurance', 'accepts-insurance', 'payment');

-- ============================================
-- SEED DATA: States
-- ============================================

INSERT INTO states (name, abbreviation, slug) VALUES
  ('Alabama', 'AL', 'alabama'), ('Alaska', 'AK', 'alaska'),
  ('Arizona', 'AZ', 'arizona'), ('Arkansas', 'AR', 'arkansas'),
  ('California', 'CA', 'california'), ('Colorado', 'CO', 'colorado'),
  ('Connecticut', 'CT', 'connecticut'), ('Delaware', 'DE', 'delaware'),
  ('Florida', 'FL', 'florida'), ('Georgia', 'GA', 'georgia'),
  ('Hawaii', 'HI', 'hawaii'), ('Idaho', 'ID', 'idaho'),
  ('Illinois', 'IL', 'illinois'), ('Indiana', 'IN', 'indiana'),
  ('Iowa', 'IA', 'iowa'), ('Kansas', 'KS', 'kansas'),
  ('Kentucky', 'KY', 'kentucky'), ('Louisiana', 'LA', 'louisiana'),
  ('Maine', 'ME', 'maine'), ('Maryland', 'MD', 'maryland'),
  ('Massachusetts', 'MA', 'massachusetts'), ('Michigan', 'MI', 'michigan'),
  ('Minnesota', 'MN', 'minnesota'), ('Mississippi', 'MS', 'mississippi'),
  ('Missouri', 'MO', 'missouri'), ('Montana', 'MT', 'montana'),
  ('Nebraska', 'NE', 'nebraska'), ('Nevada', 'NV', 'nevada'),
  ('New Hampshire', 'NH', 'new-hampshire'), ('New Jersey', 'NJ', 'new-jersey'),
  ('New Mexico', 'NM', 'new-mexico'), ('New York', 'NY', 'new-york'),
  ('North Carolina', 'NC', 'north-carolina'), ('North Dakota', 'ND', 'north-dakota'),
  ('Ohio', 'OH', 'ohio'), ('Oklahoma', 'OK', 'oklahoma'),
  ('Oregon', 'OR', 'oregon'), ('Pennsylvania', 'PA', 'pennsylvania'),
  ('Rhode Island', 'RI', 'rhode-island'), ('South Carolina', 'SC', 'south-carolina'),
  ('South Dakota', 'SD', 'south-dakota'), ('Tennessee', 'TN', 'tennessee'),
  ('Texas', 'TX', 'texas'), ('Utah', 'UT', 'utah'),
  ('Vermont', 'VT', 'vermont'), ('Virginia', 'VA', 'virginia'),
  ('Washington', 'WA', 'washington'), ('West Virginia', 'WV', 'west-virginia'),
  ('Wisconsin', 'WI', 'wisconsin'), ('Wyoming', 'WY', 'wyoming');

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- CITY-SPECIFIC CONTENT
-- ============================================

-- City-specific foundation repair content (geological, climate, costs)
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
