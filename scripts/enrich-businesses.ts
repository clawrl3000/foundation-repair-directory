/**
 * Enrich businesses with Google Places API data
 * 
 * This script:
 * 1. Finds businesses missing phone, website_url, or photos
 * 2. Searches Google Places API for each business
 * 3. Updates business records with enriched data
 * 4. Stores photo_references (not actual images) in business_images table
 * 5. Respects Google API rate limits (10 req/sec)
 * 
 * LEGAL COMPLIANCE:
 * - Only stores photo_reference strings, not actual images
 * - Frontend must display "Powered by Google" attribution
 * - Frontend constructs image URLs at render time
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY!
const RATE_LIMIT_MS = 100 // 10 requests per second max

// Sleep utility for rate limiting
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

interface Business {
  id: string
  name: string
  phone: string | null
  website_url: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  rating: number | null
  review_count: number | null
  city_name: string
  state_name: string
  hasImages?: boolean
}

interface GooglePlaceSearchResult {
  place_id: string
  name: string
}

interface GooglePlaceDetails {
  formatted_phone_number?: string
  website?: string
  formatted_address?: string
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
  photos?: Array<{
    photo_reference: string
  }>
  rating?: number
  user_ratings_total?: number
}

class GooglePlacesClient {
  private async makeRequest(url: string): Promise<any> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const data = await response.json()
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google API error: ${data.status} - ${data.error_message || 'Unknown error'}`)
    }
    return data
  }

  async findPlace(businessName: string, city: string, state: string): Promise<string | null> {
    const query = `${businessName} ${city} ${state} foundation repair`
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?` +
      `input=${encodeURIComponent(query)}&inputtype=textquery&key=${GOOGLE_API_KEY}`
    
    try {
      const data = await this.makeRequest(url)
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].place_id
      }
      return null
    } catch (error) {
      console.error(`Find place error for "${businessName}":`, error)
      return null
    }
  }

  async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
    const fields = 'formatted_phone_number,website,formatted_address,geometry,photos,rating,user_ratings_total'
    const url = `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${placeId}&fields=${fields}&key=${GOOGLE_API_KEY}`
    
    try {
      const data = await this.makeRequest(url)
      return data.result || null
    } catch (error) {
      console.error(`Place details error for ${placeId}:`, error)
      return null
    }
  }
}

class BusinessEnricher {
  private googleClient = new GooglePlacesClient()
  private stats = {
    total: 0,
    processed: 0,
    enriched: 0,
    gotPhone: 0,
    gotWebsite: 0,
    gotPhotos: 0,
    notFound: 0,
    errors: 0
  }

  async getBusinessesNeedingEnrichment(): Promise<Business[]> {
    // Get businesses that are missing phone, website, or have no images
    // Use a more efficient query by filtering directly in SQL
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        id, name, phone, website_url, address, latitude, longitude, rating, review_count,
        cities!inner(name),
        states!inner(name),
        business_images(id)
      `)
      .eq('is_active', true)
      .order('name')

    if (error) {
      throw new Error(`Database error: ${error.message}`)
    }

    const businesses = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      website_url: row.website_url,
      address: row.address,
      latitude: row.latitude,
      longitude: row.longitude,
      rating: row.rating,
      review_count: row.review_count,
      city_name: row.cities.name,
      state_name: row.states.name,
      hasImages: row.business_images && row.business_images.length > 0
    }))

    // Filter to only businesses that need enrichment
    return businesses.filter(business => 
      !business.phone || !business.website_url || !business.hasImages
    )
  }

  needsEnrichment(business: Business, hasImages: boolean): boolean {
    return !business.phone || !business.website_url || !hasImages
  }

  async enrichBusiness(business: Business): Promise<void> {
    console.log(`\nProcessing: ${business.name} (${business.city_name}, ${business.state_name})`)
    
    // Rate limiting
    await sleep(RATE_LIMIT_MS)
    
    // Find the place
    const placeId = await this.googleClient.findPlace(business.name, business.city_name, business.state_name)
    if (!placeId) {
      console.log(`  ❌ Not found in Google Places`)
      this.stats.notFound++
      return
    }

    console.log(`  ✅ Found place ID: ${placeId}`)

    // Rate limiting before second API call
    await sleep(RATE_LIMIT_MS)

    // Get place details
    const details = await this.googleClient.getPlaceDetails(placeId)
    if (!details) {
      console.log(`  ❌ Could not get place details`)
      this.stats.errors++
      return
    }

    // Prepare updates
    const updates: any = {}
    let hasUpdates = false

    // Phone
    if (!business.phone && details.formatted_phone_number) {
      updates.phone = details.formatted_phone_number
      hasUpdates = true
      this.stats.gotPhone++
      console.log(`  📞 Phone: ${details.formatted_phone_number}`)
    }

    // Website
    if (!business.website_url && details.website) {
      updates.website_url = details.website
      hasUpdates = true
      this.stats.gotWebsite++
      console.log(`  🌐 Website: ${details.website}`)
    }

    // Address
    if (!business.address && details.formatted_address) {
      updates.address = details.formatted_address
      hasUpdates = true
      console.log(`  📍 Address: ${details.formatted_address}`)
    }

    // Coordinates
    if ((!business.latitude || !business.longitude) && details.geometry?.location) {
      updates.latitude = details.geometry.location.lat
      updates.longitude = details.geometry.location.lng
      hasUpdates = true
      console.log(`  🗺️  Coordinates: ${details.geometry.location.lat}, ${details.geometry.location.lng}`)
    }

    // Rating
    if (!business.rating && details.rating) {
      updates.rating = details.rating
      hasUpdates = true
      console.log(`  ⭐ Rating: ${details.rating}`)
    }

    // Review count
    if (!business.review_count && details.user_ratings_total) {
      updates.review_count = details.user_ratings_total
      hasUpdates = true
      console.log(`  💬 Reviews: ${details.user_ratings_total}`)
    }

    // Update business record if we have changes
    if (hasUpdates) {
      const { error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', business.id)

      if (error) {
        console.error(`  ❌ Database update error:`, error)
        this.stats.errors++
        return
      }
    }

    // Handle photos
    if (details.photos && details.photos.length > 0) {
      // Only add photos if business doesn't already have them
      if (!business.hasImages) {
        const photoInserts = details.photos.slice(0, 5).map((photo, index) => ({
          business_id: business.id,
          url: photo.photo_reference, // Store photo_reference, NOT the full URL
          alt_text: `${business.name} photo ${index + 1}`,
          is_primary: index === 0,
          sort_order: index,
          source: 'google_places'
        }))

        const { error: photoError } = await supabase
          .from('business_images')
          .insert(photoInserts)

        if (photoError) {
          console.error(`  ❌ Photo insert error:`, photoError)
          this.stats.errors++
        } else {
          this.stats.gotPhotos++
          console.log(`  📸 Added ${photoInserts.length} photos`)
        }
      } else {
        console.log(`  📸 Already has images, skipping`)
      }
    }

    if (hasUpdates || (details.photos && details.photos.length > 0)) {
      this.stats.enriched++
      console.log(`  ✅ Enriched successfully`)
    } else {
      console.log(`  ℹ️  No new data to add`)
    }
  }

  async run(): Promise<void> {
    console.log('🔍 Finding businesses that need enrichment...')
    
    // Get all businesses first for total count
    const { count: totalCount } = await supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true)
    
    this.stats.total = totalCount || 0
    console.log(`Found ${this.stats.total} total businesses`)

    // Get businesses that need enrichment
    const businessesNeedingEnrichment = await this.getBusinessesNeedingEnrichment()
    console.log(`${businessesNeedingEnrichment.length} businesses need enrichment`)
    
    if (businessesNeedingEnrichment.length === 0) {
      console.log('✅ All businesses are already enriched!')
      return
    }

    console.log('\n🚀 Starting enrichment process...')
    console.log(`⏱️  Rate limit: ${1000/RATE_LIMIT_MS} requests/second`)

    for (let i = 0; i < businessesNeedingEnrichment.length; i++) {
      const business = businessesNeedingEnrichment[i]
      
      console.log(`\n[${i + 1}/${businessesNeedingEnrichment.length}]`)
      
      try {
        await this.enrichBusiness(business)
        this.stats.processed++
      } catch (error) {
        console.error(`❌ Error processing ${business.name}:`, error)
        this.stats.errors++
      }

      // Progress update every 10 businesses
      if ((i + 1) % 10 === 0) {
        console.log(`\n📊 Progress: ${i + 1}/${businessesNeedingEnrichment.length} processed`)
      }
    }

    // Final stats
    console.log('\n' + '='.repeat(50))
    console.log('📊 ENRICHMENT COMPLETE')
    console.log('='.repeat(50))
    console.log(`Total businesses in DB: ${this.stats.total}`)
    console.log(`Businesses processed: ${this.stats.processed}`)
    console.log(`Businesses enriched: ${this.stats.enriched}`)
    console.log(`Got phone numbers: ${this.stats.gotPhone}`)
    console.log(`Got websites: ${this.stats.gotWebsite}`)
    console.log(`Got photos: ${this.stats.gotPhotos}`)
    console.log(`Not found in Google: ${this.stats.notFound}`)
    console.log(`Errors encountered: ${this.stats.errors}`)

    // Verify final counts
    const { count: phoneCount } = await supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .not('phone', 'is', null)

    const { count: websiteCount } = await supabase
      .from('businesses')
      .select('id', { count: 'exact', head: true })
      .not('website_url', 'is', null)

    const { count: imageCount } = await supabase
      .from('business_images')
      .select('business_id', { count: 'exact', head: true })

    console.log('\n📈 FINAL DATABASE STATE:')
    console.log(`Businesses with phone numbers: ${phoneCount}`)
    console.log(`Businesses with websites: ${websiteCount}`)
    console.log(`Total business images: ${imageCount}`)
  }
}

async function main() {
  console.log('🏗️  Foundation Repair Directory - Google Places Enrichment')
  console.log('=' .repeat(60))
  
  // Verify API key
  if (!GOOGLE_API_KEY) {
    console.error('❌ GOOGLE_MAPS_API_KEY not found in environment')
    process.exit(1)
  }
  
  console.log(`✅ Google API Key: ${GOOGLE_API_KEY.substring(0, 10)}...`)
  console.log(`✅ Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`)
  
  const enricher = new BusinessEnricher()
  
  try {
    await enricher.run()
    console.log('\n🎉 Enrichment completed successfully!')
  } catch (error) {
    console.error('\n💥 Enrichment failed:', error)
    process.exit(1)
  }
}

// Run if this is the main module
main()