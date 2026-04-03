#!/usr/bin/env node

/**
 * Foundation Scout — Bulk Fill Contractors
 * 
 * Searches Google Places for foundation repair businesses in cities
 * that have fewer than N contractors. Creates new business records.
 * 
 * Usage: 
 *   node scripts/bulk-fill-contractors.js              # All cities with < 5 businesses
 *   node scripts/bulk-fill-contractors.js --state FL    # Only Florida
 *   node scripts/bulk-fill-contractors.js --limit 20    # Only first 20 cities
 *   node scripts/bulk-fill-contractors.js --dry-run     # Preview only, no DB writes
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MIN_BUSINESSES = 5; // Target minimum per city

if (!GOOGLE_MAPS_API_KEY) {
  console.error('❌ Google Maps API key not found');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Parse CLI args
const args = process.argv.slice(2);
const stateFilter = args.includes('--state') ? args[args.indexOf('--state') + 1] : null;
const limitCount = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1]) : null;
const dryRun = args.includes('--dry-run');

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function searchGooglePlaces(query, cityName, stateAbbr) {
  const searchQuery = `${query} in ${cityName}, ${stateAbbr}`;
  
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
      params: {
        query: searchQuery,
        key: GOOGLE_MAPS_API_KEY,
        type: 'establishment'
      },
      timeout: 10000
    });
    
    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      console.log(`  ⚠️  API: ${response.data.status} — ${response.data.error_message || ''}`);
    }
    
    return response.data.results || [];
  } catch (error) {
    console.error(`  ❌ Search error: ${error.message}`);
    return [];
  }
}

async function getPlaceDetails(placeId) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        key: GOOGLE_MAPS_API_KEY,
        fields: 'name,formatted_phone_number,website,formatted_address,geometry,rating,user_ratings_total,place_id,business_status,types'
      },
      timeout: 10000
    });
    
    return response.data.status === 'OK' ? response.data.result : null;
  } catch (error) {
    console.error(`  ❌ Details error: ${error.message}`);
    return null;
  }
}

function isFoundationRelated(name, types) {
  const lowerName = name.toLowerCase();
  const keywords = ['foundation', 'basement', 'structural', 'pier', 'leveling', 'waterproof', 'crawl space', 'underpinning'];
  return keywords.some(k => lowerName.includes(k));
}

async function getCitiesNeedingData() {
  console.log('📊 Finding cities needing more contractors...\n');
  
  // Get all cities with state info
  const { data: cities, error } = await supabase
    .from('cities')
    .select('id, name, slug, state_id, states!inner(name, abbreviation, slug)')
    .order('name');
  
  if (error) {
    console.error('❌ Error fetching cities:', error.message);
    return [];
  }
  
  // Get business counts per city
  const { data: businesses } = await supabase
    .from('businesses')
    .select('city_id, google_place_id')
    .eq('is_active', true);
  
  const bizCountByCity = {};
  const existingPlaceIds = new Set();
  businesses.forEach(b => {
    bizCountByCity[b.city_id] = (bizCountByCity[b.city_id] || 0) + 1;
    if (b.google_place_id) existingPlaceIds.add(b.google_place_id);
  });
  
  // Filter to cities needing more data
  let needsData = cities.filter(c => (bizCountByCity[c.id] || 0) < MIN_BUSINESSES);
  
  if (stateFilter) {
    needsData = needsData.filter(c => c.states.abbreviation === stateFilter.toUpperCase());
  }
  
  if (limitCount) {
    needsData = needsData.slice(0, limitCount);
  }
  
  // Sort by fewest businesses first (prioritize empty cities)
  needsData.sort((a, b) => (bizCountByCity[a.id] || 0) - (bizCountByCity[b.id] || 0));
  
  console.log(`Found ${needsData.length} cities with < ${MIN_BUSINESSES} contractors`);
  const zeroCities = needsData.filter(c => !(bizCountByCity[c.id]));
  console.log(`  - ${zeroCities.length} with ZERO contractors`);
  console.log(`  - ${needsData.length - zeroCities.length} with 1-${MIN_BUSINESSES - 1} contractors\n`);
  
  return { cities: needsData, bizCountByCity, existingPlaceIds };
}

async function fillCity(city, existingPlaceIds, currentCount) {
  const stateAbbr = city.states.abbreviation;
  const needed = MIN_BUSINESSES - currentCount;
  
  console.log(`\n🏙️  ${city.name}, ${stateAbbr} (has ${currentCount}, need ${needed} more)`);
  
  const queries = ['foundation repair', 'foundation contractor', 'basement waterproofing'];
  const found = new Map(); // placeId -> details
  
  for (const query of queries) {
    if (found.size >= needed + 3) break; // Get a few extra for filtering
    
    const results = await searchGooglePlaces(query, city.name, stateAbbr);
    await delay(200);
    
    for (const result of results) {
      if (!result.place_id || found.has(result.place_id) || existingPlaceIds.has(result.place_id)) continue;
      
      const details = await getPlaceDetails(result.place_id);
      await delay(200);
      
      if (!details || details.business_status !== 'OPERATIONAL') continue;
      if (!isFoundationRelated(details.name, details.types)) continue;
      if (!details.formatted_phone_number && !details.website) continue; // Skip if no contact info
      
      found.set(result.place_id, details);
      console.log(`  ✅ ${details.name} — ${details.formatted_phone_number || 'no phone'} — ${details.website ? '🌐' : 'no site'}`);
      
      if (found.size >= needed + 2) break;
    }
  }
  
  if (found.size === 0) {
    console.log('  ⚠️  No new businesses found');
    return 0;
  }
  
  // Insert into database
  let inserted = 0;
  for (const [placeId, details] of found) {
    const slug = slugify(details.name);
    
    const businessData = {
      name: details.name,
      slug: slug,
      city_id: city.id,
      phone: details.formatted_phone_number || null,
      website_url: details.website || null,
      address: details.formatted_address || null,
      latitude: details.geometry?.location?.lat || null,
      longitude: details.geometry?.location?.lng || null,
      rating: details.rating || null,
      review_count: details.user_ratings_total || 0,
      google_place_id: placeId,
      is_verified: false,
      is_active: true,
      description: `${details.name} provides professional foundation repair services in ${city.name}, ${stateAbbr}. Contact us for a free inspection and estimate.`
    };
    
    if (dryRun) {
      console.log(`  [DRY RUN] Would insert: ${details.name}`);
      inserted++;
      continue;
    }
    
    const { error } = await supabase
      .from('businesses')
      .upsert(businessData, { onConflict: 'google_place_id' });
    
    if (error) {
      // Try with modified slug if conflict
      businessData.slug = slug + '-' + city.slug;
      const { error: retry } = await supabase
        .from('businesses')
        .upsert(businessData, { onConflict: 'google_place_id' });
      
      if (retry) {
        console.log(`  ❌ Failed to insert ${details.name}: ${retry.message}`);
        continue;
      }
    }
    
    existingPlaceIds.add(placeId);
    inserted++;
  }
  
  console.log(`  📊 Added ${inserted} new contractors to ${city.name}, ${stateAbbr}`);
  return inserted;
}

async function main() {
  console.log('🚀 Foundation Scout — Bulk Fill Contractors\n');
  if (dryRun) console.log('🔸 DRY RUN MODE — no database writes\n');
  if (stateFilter) console.log(`🔸 Filtering to state: ${stateFilter}\n`);
  
  const { cities, bizCountByCity, existingPlaceIds } = await getCitiesNeedingData();
  
  if (cities.length === 0) {
    console.log('✅ All cities have sufficient contractors!');
    return;
  }
  
  let totalAdded = 0;
  let citiesProcessed = 0;
  
  for (const city of cities) {
    const currentCount = bizCountByCity[city.id] || 0;
    const added = await fillCity(city, existingPlaceIds, currentCount);
    totalAdded += added;
    citiesProcessed++;
    
    // Progress update every 10 cities
    if (citiesProcessed % 10 === 0) {
      console.log(`\n--- Progress: ${citiesProcessed}/${cities.length} cities, ${totalAdded} contractors added ---\n`);
    }
    
    await delay(500); // Be nice to the API
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`🎉 Done! Processed ${citiesProcessed} cities, added ${totalAdded} contractors`);
  console.log('='.repeat(60));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
