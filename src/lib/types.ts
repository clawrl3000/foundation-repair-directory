export interface Business {
  id: string
  name: string
  slug: string
  phone: string | null
  email: string | null
  website_url: string | null
  address: string | null
  city_id: number | null
  state_id: number | null
  zip: string | null
  latitude: number | null
  longitude: number | null
  description: string | null
  year_established: number | null
  license_number: string | null
  rating: number | null
  review_count: number
  is_verified: boolean
  is_featured: boolean
  is_claimed: boolean
  is_active: boolean
  data_quality_score: number
  created_at: string
  updated_at: string
  // Joined fields
  city?: City
  state?: State
  services?: Service[]
  features?: Feature[]
  images?: BusinessImage[]
}

export interface State {
  id: number
  name: string
  abbreviation: string
  slug: string
}

export interface City {
  id: number
  name: string
  slug: string
  state_id: number
  latitude: number | null
  longitude: number | null
  population: number | null
  state?: State
}

export interface Service {
  id: number
  name: string
  slug: string
  description: string | null
  parent_service_id: number | null
}

export interface Feature {
  id: number
  name: string
  slug: string
  category: string
  value?: string // from junction table
}

export interface BusinessImage {
  id: number
  business_id: string
  url: string
  alt_text: string | null
  is_primary: boolean
  sort_order: number
}

export interface Lead {
  id?: string
  business_id: string
  name: string
  email: string | null
  phone: string | null
  message: string | null
  service_needed: string | null
  property_type: string | null
  urgency: string | null
}

export interface CityContent {
  id: number
  city_id: number
  intro_text: string | null
  meta_title: string | null
  meta_description: string | null
  faq_json: any
  avg_price_min: number | null
  avg_price_max: number | null
  listing_count: number
}
