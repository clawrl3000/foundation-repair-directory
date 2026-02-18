-- Create reviews table for Foundation Scout
-- Run this in Supabase SQL Editor

CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  reviewer_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  source TEXT DEFAULT 'website', -- 'website', 'google', 'yelp', etc.
  review_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_reviews_business ON reviews(business_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX idx_reviews_source ON reviews(source);

-- Add row level security (optional)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to reviews
CREATE POLICY "Reviews are publicly readable" ON reviews 
  FOR SELECT USING (true);

-- Only authenticated users can insert reviews
CREATE POLICY "Only authenticated users can insert reviews" ON reviews 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');