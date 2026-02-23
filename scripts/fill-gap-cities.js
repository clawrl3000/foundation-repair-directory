#!/usr/bin/env node

/**
 * Foundation Scout — Fill Gap Cities Script
 * 
 * Finds cities with ONLY placeholder businesses (no phone AND no website)
 * and fills them with real foundation repair companies via Google Places API.
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  console.error('❌ GOOGLE_MAPS_API_KEY not found in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Rate limiting for Google Places API (max 10 requests/second)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GooglePlacesClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://maps.googleapis.com/maps/api/place';
    this.requestCount = 0;
    this.startTime = Date.now();
  }
  
  async rateLimit() {
    this.requestCount++;
    const elapsed = (Date.now() - this.startTime) / 1000;
    const requestsPerSecond = this.requestCount / elapsed;
    
    if (requestsPerSecond > 9) {
      const waitTime = Math.ceil(1000 - (Date.now() % 1000));
      await delay(waitTime);
    }
  }
  
  async textSearch(query, location) {
    await this.rateLimit();
    
    const searchQuery = `${query} in ${location}`;
    console.log(`  🔍 Google Places search: "${searchQuery}"`);
    
    try {
      const response = await axios.get(`${this.baseUrl}/textsearch/json`, {
        params: {
          query: searchQuery,
          key: this.apiKey,
          type: 'establishment'
        },
        timeout: 10000
      });
      
      if (response.data.status !== 'OK') {
        console.log(`  ⚠️  API returned: ${response.data.status} - ${response.data.error_message || 'No error message'}`);
        return [];
      }
      
      return response.data.results || [];
    } catch (error) {
      console.error(`  ❌ Error in Google Places search: ${error.message}`);
      return [];
    }
  }
  
  async getPlaceDetails(placeId) {
    await this.rateLimit();
    
    try {
      const response = await axios.get(`${this.baseUrl}/details/json`, {
        params: {
          place_id: placeId,
          key: this.apiKey,
          fields: 'name,formatted_phone_number,website,formatted_address,geometry,rating,user_ratings_total,place_id,business_status'
        },
        timeout: 10000
      });
      
      if (response.data.status !== 'OK') {
        console.log(`  ⚠️  Place details API returned: ${response.data.status}`);
        return null;
      }
      
      return response.data.result;
    } catch (error) {
      console.error(`  ❌ Error getting place details: ${error.message}`);
      return null;
    }
  }
}

async function findGapCities() {
  console.log('🔍 Finding cities with ONLY placeholder businesses...\n');
  
  // Get all cities with their business counts and state info
  const { data: cities, error } = await supabase
    .from('cities')
    .select(`
      id, name, state_id,
      states!inner(abbreviation),
      businesses!inner(
        id, name, phone, website_url, is_active
      )
    `)
    .eq('businesses.is_active', true);
  
  if (error) {
    console.error('❌ Error fetching cities:', error.message);
    return [];
  }
  
  // Find cities where ALL businesses have no phone AND no website
  const gapCities = [];
  
  for (const city of cities) {
    const businesses = city.businesses;
    if (businesses.length === 0) continue;
    
    const realBusinesses = businesses.filter(b => 
      (b.phone && b.phone.trim() !== '') || (b.website_url && b.website_url.trim() !== '')
    );
    
    if (realBusinesses.length === 0) {
      gapCities.push({
        id: city.id,
        name: city.name,
        state: city.states.abbreviation,
        placeholderCount: businesses.length
      });
    }
  }
  
  console.log(`📊 Found ${gapCities.length} gap cities (only placeholders):`);
  gapCities.forEach((city, index) => {
    console.log(`  ${index + 1}. ${city.name}, ${city.state} (${city.placeholderCount} placeholders)`);
  });
  
  return gapCities;
}

async function searchForRealBusinesses(city, places) {
  const searchQueries = [
    'foundation repair',
    'foundation contractor',
    'basement repair',
    'structural repair contractor'
  ];
  
  console.log(`\n🔍 Searching for real businesses in ${city.name}, ${city.state}...`);
  
  let allResults = [];
  
  for (const query of searchQueries) {
    const results = await places.textSearch(query, `${city.name}, ${city.state}`);
    console.log(`  - "${query}": ${results.length} results`);
    
    // Get detailed info for each result
    for (const result of results) {
      if (!result.place_id) continue;
      
      const details = await places.getPlaceDetails(result.place_id);
      if (!details) continue;
      
      // Filter to foundation/structural repair businesses
      const name = details.name || '';
      const isFoundationRelated = name.toLowerCase().includes('foundation') ||
                                name.toLowerCase().includes('basement') ||
                                name.toLowerCase().includes('structural') ||
                                name.toLowerCase().includes('repair');
      
      if (isFoundationRelated && details.business_status === 'OPERATIONAL') {
        allResults.push({
          name: details.name,
          phone: details.formatted_phone_number || null,
          website: details.website || null,
          address: details.formatted_address || null,
          latitude: details.geometry?.location?.lat || null,
          longitude: details.geometry?.location?.lng || null,
          rating: details.rating || null,
          review_count: details.user_ratings_total || null,
          google_place_id: details.place_id,
          city_id: city.id
        });
      }
    }
    
    await delay(200); // Small delay between queries
  }
  
  // Dedupe by google_place_id
  const uniqueResults = [];
  const seenPlaceIds = new Set();
  
  for (const result of allResults) {
    if (!seenPlaceIds.has(result.google_place_id)) {
      seenPlaceIds.add(result.google_place_id);
      uniqueResults.push(result);
    }
  }
  
  console.log(`  📊 Found ${uniqueResults.length} unique foundation repair businesses`);
  return uniqueResults;
}

async function insertOrUpdateBusinesses(foundBusinesses, city) {
  if (foundBusinesses.length === 0) {
    console.log(`  ⚠️  No businesses found for ${city.name}, ${city.state}`);
    return { inserted: 0, updated: 0 };
  }
  
  let inserted = 0;
  let updated = 0;
  
  for (const business of foundBusinesses) {
    // Check if business already exists
    const { data: existing } = await supabase
      .from('businesses')
      .select('id, google_place_id, name')
      .or(`google_place_id.eq.${business.google_place_id},and(name.eq.${business.name},city_id.eq.${business.city_id})`)
      .limit(1);
    
    if (existing && existing.length > 0) {
      // Update existing business with real data
      const { error: updateError } = await supabase
        .from('businesses')
        .update({
          name: business.name,
          phone: business.phone,
          website_url: business.website,
          address: business.address,
          latitude: business.latitude,
          longitude: business.longitude,
          rating: business.rating,
          review_count: business.review_count,
          google_place_id: business.google_place_id,
          data_source: 'google_places_api_fill_gaps',
          data_quality_score: 8, // High quality since from Google Places API
          updated_at: new Date().toISOString()
        })
        .eq('id', existing[0].id);
      
      if (updateError) {
        console.error(`  ❌ Error updating ${business.name}:`, updateError.message);
      } else {
        console.log(`  📝 Updated: ${business.name}`);
        updated++;
      }
    } else {
      // Insert new business - generate unique slug
      const baseSlug = business.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      let slug = baseSlug;
      let slugCounter = 1;
      
      // Ensure slug is unique
      while (true) {
        const { data: existingSlug } = await supabase
          .from('businesses')
          .select('id')
          .eq('slug', slug)
          .limit(1);
        
        if (!existingSlug || existingSlug.length === 0) break;
        
        slug = `${baseSlug}-${slugCounter}`;
        slugCounter++;
      }
      
      const newBusiness = {
        name: business.name,
        slug: slug,
        phone: business.phone,
        website_url: business.website,
        address: business.address,
        city_id: business.city_id,
        latitude: business.latitude,
        longitude: business.longitude,
        rating: business.rating,
        review_count: business.review_count,
        google_place_id: business.google_place_id,
        data_source: 'google_places_api_fill_gaps',
        data_quality_score: 8,
        is_active: true,
        is_verified: false,
        is_featured: false,
        is_claimed: false
      };
      
      const { error: insertError } = await supabase
        .from('businesses')
        .insert([newBusiness]);
      
      if (insertError) {
        console.error(`  ❌ Error inserting ${business.name}:`, insertError.message);
      } else {
        console.log(`  ➕ Inserted: ${business.name}`);
        inserted++;
      }
    }
  }
  
  return { inserted, updated };
}

async function deactivatePlaceholders(city) {
  console.log(`  🗑️  Deactivating remaining placeholders in ${city.name}, ${city.state}...`);
  
  // First find businesses that need deactivation (no phone AND no website)
  const { data: toDeactivate } = await supabase
    .from('businesses')
    .select('id, name, phone, website_url')
    .eq('city_id', city.id)
    .eq('is_active', true);
  
  const placeholders = toDeactivate.filter(b => 
    (!b.phone || b.phone.trim() === '') && (!b.website_url || b.website_url.trim() === '')
  );
  
  if (placeholders.length === 0) {
    console.log('  ✅ No placeholders to deactivate');
    return 0;
  }
  
  // Deactivate the placeholders
  const placeholderIds = placeholders.map(p => p.id);
  const { data, error } = await supabase
    .from('businesses')
    .update({ is_active: false })
    .in('id', placeholderIds)
    .select('id, name');
  
  if (error) {
    console.error(`  ❌ Error deactivating placeholders:`, error.message);
    return 0;
  }
  
  console.log(`  🗑️  Deactivated ${data.length} placeholders`);
  return data.length;
}

async function main() {
  console.log('🚀 Foundation Scout — Fill Gap Cities\n');
  console.log('Finding real foundation repair companies for gap cities...\n');
  
  const places = new GooglePlacesClient(GOOGLE_MAPS_API_KEY);
  
  // Step 1: Find gap cities
  const gapCities = await findGapCities();
  
  if (gapCities.length === 0) {
    console.log('🎉 No gap cities found! All cities have at least one real business.');
    return;
  }
  
  let totalInserted = 0;
  let totalUpdated = 0;
  let totalPlaceholdersRemoved = 0;
  let citiesFilled = 0;
  
  // Step 2: Process each gap city
  for (const city of gapCities) { // Process all gap cities
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing: ${city.name}, ${city.state}`);
    console.log(`${'='.repeat(60)}`);
    
    // Search for real businesses
    const foundBusinesses = await searchForRealBusinesses(city, places);
    
    if (foundBusinesses.length > 0) {
      // Insert or update businesses
      const { inserted, updated } = await insertOrUpdateBusinesses(foundBusinesses, city);
      totalInserted += inserted;
      totalUpdated += updated;
      
      // Deactivate remaining placeholders
      const deactivated = await deactivatePlaceholders(city);
      totalPlaceholdersRemoved += deactivated;
      
      citiesFilled++;
    }
    
    console.log(`  ✅ Completed ${city.name}, ${city.state}`);
    await delay(1000); // Pause between cities
  }
  
  // Final report
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 FINAL REPORT');
  console.log(`${'='.repeat(60)}`);
  console.log(`Cities processed: ${Math.min(gapCities.length, 10)} of ${gapCities.length} total gap cities`);
  console.log(`Cities successfully filled: ${citiesFilled}`);
  console.log(`New real businesses added: ${totalInserted}`);
  console.log(`Placeholder businesses updated: ${totalUpdated}`);
  console.log(`Placeholder businesses deactivated: ${totalPlaceholdersRemoved}`);
  console.log(`\n🎉 Gap filling completed!`);
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('\n💥 Script failed:', error.message);
      console.error(error.stack);
      process.exit(1);
    });
}

module.exports = { findGapCities, GooglePlacesClient };