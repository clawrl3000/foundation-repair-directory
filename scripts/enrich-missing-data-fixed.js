#!/usr/bin/env node

/**
 * Foundation Scout Data Quality Cleanup (Fixed Version)
 * 
 * This script finds all businesses with no phone AND no website (seeded placeholders)
 * and attempts to enrich them with real data from Google Places API.
 * 
 * For each placeholder business:
 * 1. Search Google Places API for the business name + city
 * 2. If a match is found, update phone, website_url, address, latitude, longitude
 * 3. If no match is found, log it for removal
 * 4. After all enrichment, deactivate unmatched businesses (set is_active=false)
 * 
 * Usage: node scripts/enrich-missing-data-fixed.js
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Configuration
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Rate limiting configuration
const REQUESTS_PER_SECOND = 10; // Conservative rate limit
const REQUEST_INTERVAL = 1000 / REQUESTS_PER_SECOND;

// Validation
if (!GOOGLE_PLACES_API_KEY) {
  console.error('❌ GOOGLE_MAPS_API_KEY not found in .env.local');
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Supabase credentials not found in .env.local');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Tracking variables
let stats = {
  totalProcessed: 0,
  successfullyEnriched: 0,
  noMatchesFound: 0,
  apiErrors: 0,
  deactivated: 0
};

// Track businesses that couldn't be matched
let unmatchedBusinessIds = [];

/**
 * Sleep helper for rate limiting
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Search Google Places API for a specific business
 */
async function searchBusinessInGooglePlaces(businessName, city, state) {
  const query = `${businessName} ${city} ${state}`;
  const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  url.searchParams.append('query', query);
  url.searchParams.append('key', GOOGLE_PLACES_API_KEY);
  
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
      stats.apiErrors++;
      return [];
    }
  } catch (error) {
    console.error(`❌ Network error searching Google Places:`, error.message);
    stats.apiErrors++;
    return [];
  }
}

/**
 * Get detailed place information
 */
async function getPlaceDetails(placeId) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.append('place_id', placeId);
  url.searchParams.append('key', GOOGLE_PLACES_API_KEY);
  url.searchParams.append('fields', 'name,formatted_phone_number,website,formatted_address,geometry,rating,user_ratings_total');
  
  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    
    if (data.status === 'OK') {
      return data.result;
    } else {
      console.error(`❌ Place details error: ${data.status}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Network error getting place details:`, error.message);
    return null;
  }
}

/**
 * Check if Google Places result is a reasonable match
 */
function isGoodMatch(businessName, googleResult) {
  const businessLower = businessName.toLowerCase().trim();
  const googleLower = googleResult.name.toLowerCase().trim();
  
  // Exact match
  if (businessLower === googleLower) {
    return { isMatch: true, confidence: 'high', score: 1.0 };
  }
  
  // Check if it contains foundation repair related terms and business name words
  const foundationTerms = ['foundation', 'basement', 'structural', 'concrete', 'repair', 'waterproofing', 'crawl'];
  const businessWords = businessLower.split(/\s+/).filter(word => word.length > 2);
  const googleWords = googleLower.split(/\s+/).filter(word => word.length > 2);
  
  // Must have at least one foundation-related term in Google result
  const hasFoundationTerm = foundationTerms.some(term => googleLower.includes(term));
  
  if (!hasFoundationTerm) {
    return { isMatch: false, confidence: 'low', score: 0 };
  }
  
  // Check word overlap
  const commonWords = businessWords.filter(word => googleWords.includes(word));
  const uniqueBusinessWords = businessWords.filter(word => 
    !['foundation', 'repair', 'solutions', 'systems', 'services', 'state', 'city'].includes(word)
  );
  
  // If we have unique words from the business name, they should appear in Google result
  if (uniqueBusinessWords.length > 0) {
    const uniqueMatches = uniqueBusinessWords.filter(word => googleWords.includes(word));
    const uniqueMatchRatio = uniqueMatches.length / uniqueBusinessWords.length;
    
    if (uniqueMatchRatio >= 0.5) {
      return { isMatch: true, confidence: 'high', score: 0.8 + uniqueMatchRatio * 0.2 };
    }
  }
  
  // General word overlap check
  const overlapRatio = commonWords.length / Math.max(businessWords.length, googleWords.length);
  
  if (overlapRatio >= 0.6) {
    return { isMatch: true, confidence: 'medium', score: overlapRatio };
  }
  
  return { isMatch: false, confidence: 'low', score: overlapRatio };
}

/**
 * Update business with enriched data from Google Places
 */
async function updateBusinessWithEnrichment(businessId, placeDetails, confidence) {
  const updateData = {
    updated_at: new Date().toISOString()
  };
  
  // Add Google Place ID
  if (placeDetails.place_id) {
    updateData.google_place_id = placeDetails.place_id;
  }
  
  // Add phone if available
  if (placeDetails.formatted_phone_number) {
    updateData.phone = placeDetails.formatted_phone_number;
  }
  
  // Add website if available
  if (placeDetails.website) {
    updateData.website_url = placeDetails.website;
  }
  
  // Add address if available
  if (placeDetails.formatted_address) {
    updateData.address = placeDetails.formatted_address;
  }
  
  // Add coordinates if available
  if (placeDetails.geometry?.location) {
    updateData.latitude = placeDetails.geometry.location.lat;
    updateData.longitude = placeDetails.geometry.location.lng;
  }
  
  // Add ratings if available (use existing column names)
  if (placeDetails.rating) {
    updateData.rating = placeDetails.rating;
  }
  
  if (placeDetails.user_ratings_total) {
    updateData.review_count = placeDetails.user_ratings_total;
  }
  
  // Set data quality score higher for enriched businesses
  updateData.data_quality_score = confidence === 'high' ? 0.9 : 0.8;
  updateData.data_source = 'google_places_enrichment';
  
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
 * Deactivate unmatched businesses
 */
async function deactivateUnmatchedBusinesses() {
  if (unmatchedBusinessIds.length === 0) {
    console.log('ℹ️ No unmatched businesses to deactivate');
    return;
  }
  
  console.log(`\n🗑️ Deactivating ${unmatchedBusinessIds.length} unmatched placeholder businesses...`);
  
  const { error } = await supabase
    .from('businesses')
    .update({ 
      is_active: false,
      updated_at: new Date().toISOString(),
      data_source: 'deactivated_placeholder'
    })
    .in('id', unmatchedBusinessIds);
  
  if (error) {
    console.error('❌ Error deactivating businesses:', error.message);
    return;
  }
  
  stats.deactivated = unmatchedBusinessIds.length;
  console.log(`✅ Deactivated ${unmatchedBusinessIds.length} placeholder businesses`);
}

/**
 * Main enrichment function
 */
async function enrichMissingData() {
  console.log('🚀 Starting Foundation Scout data quality cleanup...\n');
  
  try {
    // Get all businesses with missing phone AND website
    console.log('📋 Fetching businesses with missing contact data...');
    const { data: businesses, error: businessError } = await supabase
      .from('businesses')
      .select(`
        id,
        name,
        slug,
        phone,
        website_url,
        address,
        latitude,
        longitude,
        cities!inner (
          id,
          name,
          slug,
          states!inner (
            name,
            abbreviation
          )
        )
      `)
      .or('phone.is.null,phone.eq.')
      .or('website_url.is.null,website_url.eq.')
      .eq('is_active', true)
      .order('name');
    
    if (businessError) {
      throw new Error(`Failed to fetch businesses: ${businessError.message}`);
    }
    
    console.log(`✅ Found ${businesses.length} businesses with missing data\n`);
    
    // Process each business
    for (const business of businesses) {
      stats.totalProcessed++;
      const cityName = business.cities.name;
      const stateName = business.cities.states.name;
      const stateAbbr = business.cities.states.abbreviation;
      
      console.log(`\n📍 Processing ${stats.totalProcessed}/${businesses.length}: ${business.name} in ${cityName}, ${stateAbbr}`);
      
      // Search Google Places
      const googleResults = await searchBusinessInGooglePlaces(
        business.name,
        cityName,
        stateName
      );
      
      // Rate limit compliance
      await sleep(REQUEST_INTERVAL);
      
      if (googleResults.length === 0) {
        console.log(`❌ No Google Places results found`);
        unmatchedBusinessIds.push(business.id);
        stats.noMatchesFound++;
        continue;
      }
      
      // Find the best match
      let bestMatch = null;
      let bestScore = 0;
      
      for (const result of googleResults) {
        const matchCheck = isGoodMatch(business.name, result);
        
        if (matchCheck.isMatch && matchCheck.score > bestScore) {
          bestMatch = { result, ...matchCheck };
          bestScore = matchCheck.score;
        }
      }
      
      if (!bestMatch) {
        console.log(`❌ No good matches found among ${googleResults.length} results`);
        unmatchedBusinessIds.push(business.id);
        stats.noMatchesFound++;
        continue;
      }
      
      // Get detailed place information
      console.log(`🎯 Found match: ${bestMatch.result.name} (${bestMatch.confidence} confidence, score: ${bestMatch.score.toFixed(2)})`);
      
      const placeDetails = await getPlaceDetails(bestMatch.result.place_id);
      await sleep(REQUEST_INTERVAL); // Rate limit for details API call
      
      if (!placeDetails) {
        console.log(`❌ Could not get place details`);
        unmatchedBusinessIds.push(business.id);
        stats.noMatchesFound++;
        continue;
      }
      
      // Update the business with enriched data
      const updated = await updateBusinessWithEnrichment(
        business.id,
        placeDetails,
        bestMatch.confidence
      );
      
      if (updated) {
        stats.successfullyEnriched++;
        console.log(`✅ Successfully enriched business`);
        
        // Log what was added
        const enrichments = [];
        if (placeDetails.formatted_phone_number) enrichments.push(`phone: ${placeDetails.formatted_phone_number}`);
        if (placeDetails.website) enrichments.push(`website: ${placeDetails.website}`);
        if (placeDetails.formatted_address) enrichments.push(`address: ${placeDetails.formatted_address}`);
        if (placeDetails.rating) enrichments.push(`rating: ${placeDetails.rating} (${placeDetails.user_ratings_total || 0} reviews)`);
        
        if (enrichments.length > 0) {
          console.log(`    📊 Added: ${enrichments.join(', ')}`);
        }
      } else {
        console.log(`❌ Failed to update business in database`);
        unmatchedBusinessIds.push(business.id);
        stats.noMatchesFound++;
      }
      
      // Progress update every 10 businesses
      if (stats.totalProcessed % 10 === 0) {
        console.log(`\n📈 Progress: ${stats.totalProcessed}/${businesses.length} processed, ${stats.successfullyEnriched} enriched, ${stats.noMatchesFound} no matches`);
      }
    }
    
    // Deactivate unmatched businesses
    await deactivateUnmatchedBusinesses();
    
    // Final summary
    console.log('\n🎉 Data quality cleanup completed!');
    console.log(`📊 Final Summary:`);
    console.log(`  - Total businesses processed: ${stats.totalProcessed}`);
    console.log(`  - Successfully enriched with real data: ${stats.successfullyEnriched}`);
    console.log(`  - No matches found (placeholders): ${stats.noMatchesFound}`);
    console.log(`  - API errors encountered: ${stats.apiErrors}`);
    console.log(`  - Placeholder businesses deactivated: ${stats.deactivated}`);
    
    const successRate = ((stats.successfullyEnriched / stats.totalProcessed) * 100).toFixed(1);
    console.log(`  - Success rate: ${successRate}%`);
    
    if (stats.noMatchesFound > 0) {
      console.log(`\n💡 Recommendation: ${stats.noMatchesFound} businesses had no real matches and were deactivated.`);
      console.log(`   These were likely seeded placeholders with fake names.`);
      
      if (stats.successfullyEnriched < stats.noMatchesFound) {
        console.log(`   Consider using the Crawl4AI scraper to find real businesses to replace them.`);
      }
    }
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the enrichment
if (require.main === module) {
  enrichMissingData()
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
  enrichMissingData,
  searchBusinessInGooglePlaces,
  isGoodMatch,
  stats
};