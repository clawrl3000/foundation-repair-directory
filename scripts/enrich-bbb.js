#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const cheerio = require('cheerio');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Rate limiting configuration
const RATE_LIMIT_DELAY = 2000; // 2 seconds between requests
const BATCH_SIZE = 5; // Process businesses in small batches

// Logging configuration
const LOG_FILE = 'bbb-enrichment.log';

function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function searchBBB(businessName, city, state) {
  try {
    log(`Searching BBB for: ${businessName} in ${city}, ${state}`);
    
    // Construct BBB search URL
    const searchQuery = encodeURIComponent(`${businessName} ${city} ${state}`);
    const searchUrl = `https://www.bbb.org/search?find_country=USA&find_text=${searchQuery}&page=1&sort=Relevance`;
    
    // Make request with appropriate headers
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      log(`BBB search failed with status: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Look for business profile links in search results
    const businessLinks = [];
    $('a[href*="/us/"]').each((i, element) => {
      const href = $(element).attr('href');
      if (href && href.includes('/us/') && href.includes(state.toLowerCase())) {
        const fullUrl = href.startsWith('http') ? href : `https://www.bbb.org${href}`;
        businessLinks.push(fullUrl);
      }
    });

    if (businessLinks.length === 0) {
      log(`No BBB profiles found for ${businessName}`);
      return null;
    }

    // Try the first result (most relevant)
    const profileUrl = businessLinks[0];
    log(`Found BBB profile: ${profileUrl}`);
    
    // Wait before making profile request
    await sleep(1000);
    
    return await scrapeBBBProfile(profileUrl);
    
  } catch (error) {
    log(`Error searching BBB for ${businessName}: ${error.message}`);
    return null;
  }
}

async function scrapeBBBProfile(profileUrl) {
  try {
    log(`Scraping BBB profile: ${profileUrl}`);
    
    const response = await fetch(profileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });

    if (!response.ok) {
      log(`Failed to load BBB profile: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Extract BBB data
    const bbbData = {
      profile_url: profileUrl,
      scraped_at: new Date().toISOString()
    };

    // Extract BBB Rating (A+, A, B+, etc.)
    const ratingElement = $('.rating-letter, .bbb-rating-letter, [class*="rating"]').first();
    if (ratingElement.length) {
      bbbData.rating = ratingElement.text().trim();
      log(`Found BBB rating: ${bbbData.rating}`);
    } else {
      // Try alternative selectors
      const altRating = $('*:contains("BBB Rating")').parent().find('.letter-grade, .grade-letter').text().trim();
      if (altRating) {
        bbbData.rating = altRating;
        log(`Found BBB rating (alt): ${bbbData.rating}`);
      }
    }

    // Extract accreditation status
    const accredElement = $('*:contains("BBB Accredited Business")');
    if (accredElement.length > 0) {
      bbbData.is_accredited = true;
      
      // Try to find years accredited
      const yearsText = $('*:contains("years")').filter(function() {
        const text = $(this).text().toLowerCase();
        return text.includes('accredited') && text.includes('years');
      }).first().text();
      
      const yearsMatch = yearsText.match(/(\d+)\s*years?/i);
      if (yearsMatch) {
        bbbData.years_accredited = parseInt(yearsMatch[1]);
        log(`Years accredited: ${bbbData.years_accredited}`);
      }
    } else {
      bbbData.is_accredited = false;
    }

    // Extract complaint information
    const complaintElements = $('*:contains("complaint")');
    complaintElements.each((i, element) => {
      const text = $(element).text().toLowerCase();
      const match = text.match(/(\d+)\s*complaints?/i);
      if (match) {
        bbbData.complaint_count = parseInt(match[1]);
        log(`Found complaint count: ${bbbData.complaint_count}`);
        return false; // break loop
      }
    });

    // If no specific complaint count found, default to 0 if accredited
    if (!bbbData.complaint_count && bbbData.is_accredited) {
      bbbData.complaint_count = 0;
    }

    log(`BBB data extracted: ${JSON.stringify(bbbData, null, 2)}`);
    return bbbData;
    
  } catch (error) {
    log(`Error scraping BBB profile ${profileUrl}: ${error.message}`);
    return null;
  }
}

async function updateBusinessBBBData(businessId, bbbData) {
  try {
    const { error } = await supabase
      .from('businesses')
      .update({ bbb_data: bbbData })
      .eq('id', businessId);

    if (error) {
      log(`Error updating business ${businessId}: ${error.message}`);
      return false;
    }

    log(`Successfully updated business ${businessId} with BBB data`);
    return true;
  } catch (error) {
    log(`Error updating business ${businessId}: ${error.message}`);
    return false;
  }
}

async function getBusinessesToEnrich(limit = null) {
  try {
    let query = supabase
      .from('businesses')
      .select('id, name, address, city_id, state_id, bbb_data')
      .is('bbb_data', null)  // Only get businesses without BBB data
      .eq('is_active', true);

    if (limit) {
      query = query.limit(limit);
    }

    const { data: businesses, error } = await query;

    if (error) {
      log(`Error fetching businesses: ${error.message}`);
      return [];
    }

    // Get city and state names
    const enrichedBusinesses = [];
    for (const business of businesses) {
      // Get city name
      const { data: cityData } = await supabase
        .from('cities')
        .select('name, state_id')
        .eq('id', business.city_id)
        .single();

      // Get state name
      const { data: stateData } = await supabase
        .from('states')
        .select('name, abbreviation')
        .eq('id', business.state_id)
        .single();

      enrichedBusinesses.push({
        ...business,
        city_name: cityData?.name || 'Unknown',
        state_name: stateData?.name || 'Unknown',
        state_abbr: stateData?.abbreviation || 'XX'
      });
    }

    return enrichedBusinesses;
  } catch (error) {
    log(`Error fetching businesses: ${error.message}`);
    return [];
  }
}

async function enrichBBBData(testMode = true) {
  log('Starting BBB data enrichment...');
  
  const limit = testMode ? BATCH_SIZE : null;
  const businesses = await getBusinessesToEnrich(limit);
  
  if (businesses.length === 0) {
    log('No businesses found that need BBB enrichment');
    return;
  }

  log(`Found ${businesses.length} businesses to enrich${testMode ? ' (test mode)' : ''}`);

  let processed = 0;
  let successful = 0;
  let failed = 0;

  for (const business of businesses) {
    try {
      log(`Processing ${processed + 1}/${businesses.length}: ${business.name}`);
      
      const bbbData = await searchBBB(
        business.name,
        business.city_name,
        business.state_abbr
      );

      if (bbbData) {
        const success = await updateBusinessBBBData(business.id, bbbData);
        if (success) {
          successful++;
        } else {
          failed++;
        }
      } else {
        // Store null result to avoid re-processing
        await updateBusinessBBBData(business.id, { 
          searched_at: new Date().toISOString(),
          found: false 
        });
        log(`No BBB data found for ${business.name}`);
      }

      processed++;
      
      // Rate limiting
      if (processed < businesses.length) {
        log(`Waiting ${RATE_LIMIT_DELAY}ms before next request...`);
        await sleep(RATE_LIMIT_DELAY);
      }
      
    } catch (error) {
      log(`Error processing business ${business.name}: ${error.message}`);
      failed++;
      processed++;
    }
  }

  log(`BBB enrichment completed!`);
  log(`Total processed: ${processed}`);
  log(`Successful: ${successful}`);
  log(`Failed: ${failed}`);
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const testMode = !args.includes('--production');
  
  if (testMode) {
    log('Running in TEST MODE - will only process 5 businesses');
    log('Use --production flag to process all businesses');
  }

  try {
    // First check if we need to add the bbb_data column
    const { data: sample, error: sampleError } = await supabase
      .from('businesses')
      .select('bbb_data')
      .limit(1);
    
    if (sampleError && sampleError.code === '42703') {
      log('ERROR: bbb_data column does not exist in businesses table');
      log('Please run the SQL script: add-bbb-column.sql in Supabase SQL editor first');
      process.exit(1);
    }
    
    await enrichBBBData(testMode);
  } catch (error) {
    log(`Fatal error: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { searchBBB, scrapeBBBProfile, enrichBBBData };