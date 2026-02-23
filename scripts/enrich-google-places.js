#!/usr/bin/env node

/**
 * Google Places Enrichment Script for Foundation Scout
 * 
 * This script:
 * 1. Reads all cities from Supabase
 * 2. For each city, searches Google Places API for 'foundation repair in [city], [state]'
 * 3. Matches results with existing businesses in our database
 * 4. Updates businesses with google_place_id for those that match
 * 
 * Usage: node scripts/enrich-google-places.js
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Configuration
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Rate limiting configuration
const REQUESTS_PER_SECOND = 10; // Google allows 100 QPS but be conservative
const REQUEST_INTERVAL = 1000 / REQUESTS_PER_SECOND; // milliseconds between requests

// Validation
if (!GOOGLE_PLACES_API_KEY) {
  console.error('❌ GOOGLE_MAPS_API_KEY not found in .env.local');
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Supabase credentials not found in .env.local');
  process.exit(1);
}

// Initialize Supabase client with service role key for write access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Sleep helper for rate limiting
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Search Google Places API for businesses
 */
async function searchGooglePlaces(query) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.append('query', query);
  url.searchParams.append('key', GOOGLE_PLACES_API_KEY);
  url.searchParams.append('type', 'general_contractor'); // Helps filter to contractors
  
  try {
    console.log(`🔍 Searching: "${query}"`);
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    if (data.status === 'OK') {
      console.log(`✅ Found ${data.results?.length || 0} results`);
      return data.results || [];
    } else if (data.status === 'ZERO_RESULTS') {
      console.log(`ℹ️ No results for: "${query}"`);
      return [];
    } else {
      console.error(`❌ Google Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
      return [];
    }
  } catch (error) {
    console.error(`❌ Network error searching Google Places:`, error.message);
    return [];
  }
}

/**
 * Calculate basic string similarity (simple approach)
 */
function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  // Exact match
  if (s1 === s2) return 1.0;
  
  // Contains match (business name contains Google result name or vice versa)
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Simple word overlap scoring
  const words1 = new Set(s1.split(/\s+/));
  const words2 = new Set(s2.split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Match Google Places results with existing businesses
 */
function matchBusinesses(googleResults, existingBusinesses) {
  const matches = [];
  const SIMILARITY_THRESHOLD = 0.6; // Minimum similarity score to consider a match
  
  for (const googlePlace of googleResults) {
    let bestMatch = null;
    let bestScore = 0;
    
    for (const business of existingBusinesses) {
      // Skip if business already has a Google Place ID
      if (business.google_place_id) continue;
      
      const nameScore = calculateSimilarity(business.name, googlePlace.name);
      let locationScore = 0;
      
      // If we have coordinates, check distance (rough approximation)
      if (business.latitude && business.longitude && googlePlace.geometry?.location) {
        const latDiff = Math.abs(business.latitude - googlePlace.geometry.location.lat);
        const lngDiff = Math.abs(business.longitude - googlePlace.geometry.location.lng);
        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
        
        // Score based on distance (closer = higher score)
        // Within ~0.01 degrees (~1km) gets good score
        locationScore = Math.max(0, 1 - (distance / 0.02));
      }
      
      // Address similarity check if available
      let addressScore = 0;
      if (business.address && googlePlace.formatted_address) {
        addressScore = calculateSimilarity(business.address, googlePlace.formatted_address);
      }
      
      // Combined score (name is most important)
      const combinedScore = (nameScore * 0.6) + (locationScore * 0.2) + (addressScore * 0.2);
      
      if (combinedScore > bestScore && combinedScore >= SIMILARITY_THRESHOLD) {
        bestScore = combinedScore;
        bestMatch = {
          business: business,
          googlePlace: googlePlace,
          score: combinedScore
        };
      }
    }
    
    if (bestMatch) {
      matches.push(bestMatch);
    }
  }
  
  return matches;
}

/**
 * Update business with Google Place ID
 */
async function updateBusinessWithPlaceId(businessId, placeId, additionalData = {}) {
  const updateData = {
    google_place_id: placeId,
    updated_at: new Date().toISOString()
  };
  
  // Add additional data if available
  if (additionalData.rating) {
    updateData.google_rating = additionalData.rating;
  }
  
  if (additionalData.user_ratings_total) {
    updateData.google_review_count = additionalData.user_ratings_total;
  }
  
  if (additionalData.geometry?.location && !additionalData.existingCoordinates) {
    updateData.latitude = additionalData.geometry.location.lat;
    updateData.longitude = additionalData.geometry.location.lng;
  }
  
  const { error } = await supabase
    .from('businesses')
    .update(updateData)
    .eq('id', businessId);
  
  if (error) {
    console.error(`❌ Error updating business ${businessId}:`, error.message);
    return false;
  }
  
  return true;
}

/**
 * Main enrichment function
 */
async function enrichGooglePlaces() {
  console.log('🚀 Starting Google Places enrichment...\n');
  
  try {
    // Get all cities with their states
    console.log('📋 Fetching cities from database...');
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select(`
        id,
        name,
        slug,
        states!inner (
          name,
          abbreviation,
          slug
        )
      `)
      .order('name');
    
    if (citiesError) {
      throw new Error(`Failed to fetch cities: ${citiesError.message}`);
    }
    
    console.log(`✅ Found ${cities.length} cities to process\n`);
    
    let totalProcessed = 0;
    let totalMatches = 0;
    let totalUpdated = 0;
    
    for (const city of cities) {
      const stateAbbr = city.states.abbreviation;
      const stateName = city.states.name;
      
      console.log(`\n🏙️ Processing: ${city.name}, ${stateAbbr}`);
      
      // Get existing businesses for this city
      const { data: businesses, error: businessError } = await supabase
        .from('businesses')
        .select('id, name, slug, address, latitude, longitude, google_place_id')
        .eq('city_id', city.id)
        .eq('is_active', true);
      
      if (businessError) {
        console.error(`❌ Error fetching businesses for ${city.name}:`, businessError.message);
        continue;
      }
      
      if (!businesses || businesses.length === 0) {
        console.log(`ℹ️ No businesses found in ${city.name}, skipping`);
        continue;
      }
      
      console.log(`📊 Found ${businesses.length} businesses in database`);
      
      // Search Google Places
      const query = `foundation repair in ${city.name}, ${stateName}`;
      const googleResults = await searchGooglePlaces(query);
      
      if (googleResults.length === 0) {
        console.log(`ℹ️ No Google Places results, skipping`);
        await sleep(REQUEST_INTERVAL);
        continue;
      }
      
      // Match businesses with Google Places results
      const matches = matchBusinesses(googleResults, businesses);
      
      if (matches.length === 0) {
        console.log(`ℹ️ No matches found between database and Google Places`);
      } else {
        console.log(`🎯 Found ${matches.length} potential matches:`);
        
        // Update matches
        for (const match of matches) {
          const business = match.business;
          const googlePlace = match.googlePlace;
          const score = match.score;
          
          console.log(`  📍 ${business.name} ↔ ${googlePlace.name} (${(score * 100).toFixed(1)}% match)`);
          
          const additionalData = {
            rating: googlePlace.rating,
            user_ratings_total: googlePlace.user_ratings_total,
            geometry: googlePlace.geometry,
            existingCoordinates: business.latitude && business.longitude
          };
          
          const updated = await updateBusinessWithPlaceId(
            business.id,
            googlePlace.place_id,
            additionalData
          );
          
          if (updated) {
            totalUpdated++;
            console.log(`    ✅ Updated business ID ${business.id}`);
          } else {
            console.log(`    ❌ Failed to update business ID ${business.id}`);
          }
        }
      }
      
      totalProcessed++;
      totalMatches += matches.length;
      
      // Progress update
      console.log(`📈 Progress: ${totalProcessed}/${cities.length} cities processed, ${totalMatches} matches found, ${totalUpdated} updated`);
      
      // Rate limiting
      await sleep(REQUEST_INTERVAL);
    }
    
    console.log('\n🎉 Enrichment completed!');
    console.log(`📊 Summary:`);
    console.log(`  - Cities processed: ${totalProcessed}/${cities.length}`);
    console.log(`  - Total matches found: ${totalMatches}`);
    console.log(`  - Businesses updated: ${totalUpdated}`);
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the enrichment if this file is executed directly
if (require.main === module) {
  enrichGooglePlaces()
    .then(() => {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Script failed:', error.message);
      process.exit(1);
    });
}

module.exports = {
  enrichGooglePlaces,
  searchGooglePlaces,
  matchBusinesses,
  calculateSimilarity
};