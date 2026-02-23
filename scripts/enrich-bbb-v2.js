#!/usr/bin/env node
/**
 * BBB Enrichment v2 — Uses BBB's JSON API instead of HTML scraping.
 * 
 * Usage:
 *   node scripts/enrich-bbb-v2.js              # Test mode (10 businesses)
 *   node scripts/enrich-bbb-v2.js --production # All businesses
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const log = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

const isProduction = process.argv.includes('--production');
const BATCH_SIZE = isProduction ? 9999 : 10;
const DELAY_MS = 1500; // Rate limit between requests

function cleanHtml(str) {
  if (!str) return str;
  return str.replace(/<\/?em>/g, '').replace(/<[^>]+>/g, '').trim();
}

async function searchBBB(businessName, city, state) {
  const searchText = encodeURIComponent(businessName);
  const location = encodeURIComponent(`${city} ${state}`);
  const url = `https://www.bbb.org/api/search?find_country=USA&find_text=${searchText}&find_loc=${location}&page=1&sort=Relevance`;

  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
      }
    });

    if (!resp.ok) {
      log(`  BBB API returned ${resp.status}`);
      return null;
    }

    const data = await resp.json();
    if (!data.results || data.results.length === 0) return null;

    // Find best match — compare cleaned business name
    const cleanName = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    for (const result of data.results) {
      const resultName = cleanHtml(result.businessName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const resultState = (result.state || '').toUpperCase();
      
      // Name similarity check — generous matching
      // Check if major words overlap (at least 2 significant words match)
      const nameWords = cleanName.match(/[a-z]{3,}/g) || [];
      const resultWords = resultName.match(/[a-z]{3,}/g) || [];
      const commonWords = nameWords.filter(w => resultWords.some(rw => rw.includes(w) || w.includes(rw)));
      
      const nameMatch = resultName.includes(cleanName) || cleanName.includes(resultName) ||
        levenshteinSimilarity(cleanName, resultName) > 0.5 ||
        commonWords.length >= 2;
      
      if (nameMatch) {
        return {
          rating: result.rating || null,
          is_accredited: result.isAccredited || false,
          phone: result.phone?.[0] || null,
          city: cleanHtml(result.city),
          state: result.state,
          business_name_bbb: cleanHtml(result.businessName),
          profile_url: result.reportUrl ? `https://www.bbb.org${result.reportUrl}` : null,
          review_count: result.reviewCount || 0,
          complaint_count: result.complaintCount || 0,
          categories: (result.categories || []).map(c => cleanHtml(c.categoryName)),
          scraped_at: new Date().toISOString()
        };
      }
    }

    // If no good name match, take first result if same state
    const first = data.results[0];
    if (first.state && first.state.toUpperCase() === state.toUpperCase()) {
      return {
        rating: first.rating || null,
        is_accredited: first.isAccredited || false,
        phone: first.phone?.[0] || null,
        city: cleanHtml(first.city),
        state: first.state,
        business_name_bbb: cleanHtml(first.businessName),
        profile_url: first.reportUrl ? `https://www.bbb.org${first.reportUrl}` : null,
        review_count: first.reviewCount || 0,
        complaint_count: first.complaintCount || 0,
        categories: (first.categories || []).map(c => cleanHtml(c.categoryName)),
        scraped_at: new Date().toISOString(),
        match_confidence: 'low'
      };
    }

    return null;
  } catch (err) {
    log(`  Error searching BBB: ${err.message}`);
    return null;
  }
}

function levenshteinSimilarity(a, b) {
  if (!a || !b) return 0;
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.length === 0) return 1.0;
  
  const costs = [];
  for (let i = 0; i <= longer.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= shorter.length; j++) {
      if (i === 0) { costs[j] = j; }
      else if (j > 0) {
        let newValue = costs[j - 1];
        if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[shorter.length] = lastValue;
  }
  return (longer.length - costs[shorter.length]) / longer.length;
}

async function main() {
  log(`Running in ${isProduction ? 'PRODUCTION' : 'TEST'} mode (${isProduction ? 'all' : '10'} businesses)`);

  // Get businesses — prioritize ones with real data (have phone/website) first
  const { data: businesses, error } = await supabase
    .from('businesses')
    .select('id, name, phone, website_url, address, latitude, longitude')
    .eq('is_active', true)
    .order('review_count', { ascending: false })
    .limit(BATCH_SIZE);

  if (error) {
    log(`Error fetching businesses: ${error.message}`);
    process.exit(1);
  }

  log(`Found ${businesses.length} businesses to process`);

  let found = 0, notFound = 0, errors = 0;

  for (let i = 0; i < businesses.length; i++) {
    const biz = businesses[i];
    log(`Processing ${i + 1}/${businesses.length}: ${biz.name}`);

    // Extract city/state from address or name
    let city = '', state = '';
    if (biz.address) {
      const parts = biz.address.split(',').map(s => s.trim());
      if (parts.length >= 3) {
        city = parts[parts.length - 3] || parts[0];
        const stateZip = parts[parts.length - 2] || '';
        state = stateZip.split(/\s+/)[0] || '';
      }
    }

    // Fallback: try to get city/state from Supabase via business relationships
    if (!city || !state) {
      const { data: bizFull } = await supabase
        .from('businesses')
        .select('id, cities(name, states(abbreviation, name))')
        .eq('id', biz.id)
        .single();
      
      if (bizFull?.cities) {
        city = bizFull.cities.name || city;
        state = bizFull.cities.states?.abbreviation || bizFull.cities.states?.name || state;
      }
    }

    if (!city && !state) {
      log(`  Skipping — no location info available`);
      notFound++;
      continue;
    }

    log(`  Searching BBB for: ${biz.name} in ${city}, ${state}`);
    const bbbData = await searchBBB(biz.name, city, state);

    if (bbbData) {
      const { error: updateError } = await supabase
        .from('businesses')
        .update({ bbb_data: bbbData })
        .eq('id', biz.id);

      if (updateError) {
        log(`  Error updating: ${updateError.message}`);
        errors++;
      } else {
        log(`  ✅ Found: ${bbbData.business_name_bbb} — Rating: ${bbbData.rating}, Accredited: ${bbbData.is_accredited}`);
        found++;
      }
    } else {
      log(`  ❌ No BBB match found`);
      notFound++;
    }

    await sleep(DELAY_MS);
  }

  log(`\n=== BBB Enrichment Complete ===`);
  log(`Total processed: ${businesses.length}`);
  log(`Found: ${found}`);
  log(`Not found: ${notFound}`);
  log(`Errors: ${errors}`);
}

main().catch(err => {
  log(`Fatal error: ${err.message}`);
  process.exit(1);
});
