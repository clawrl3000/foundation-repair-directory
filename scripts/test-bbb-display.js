#!/usr/bin/env node

// Test script to demonstrate BBB data display functionality
// This simulates what the data would look like after BBB enrichment
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Sample BBB data to demonstrate the integration
const sampleBBBData = [
  {
    rating: 'A+',
    is_accredited: true,
    years_accredited: 8,
    complaint_count: 0,
    profile_url: 'https://www.bbb.org/us/example',
    scraped_at: new Date().toISOString(),
    found: true
  },
  {
    rating: 'A',
    is_accredited: false,
    years_accredited: null,
    complaint_count: 2,
    profile_url: 'https://www.bbb.org/us/example2',
    scraped_at: new Date().toISOString(),
    found: true
  },
  {
    rating: 'B+',
    is_accredited: true,
    years_accredited: 3,
    complaint_count: 1,
    profile_url: 'https://www.bbb.org/us/example3',
    scraped_at: new Date().toISOString(),
    found: true
  }
];

async function demonstrateBBBIntegration() {
  try {
    console.log('🏗️  Foundation Scout - BBB Integration Demo');
    console.log('==========================================');
    console.log('');

    // Get some sample businesses
    const { data: businesses, error } = await supabase
      .from('businesses')
      .select('id, name, city_id, state_id')
      .limit(3);

    if (error || !businesses || businesses.length === 0) {
      console.log('⚠️ No businesses found in database');
      return;
    }

    console.log(`Found ${businesses.length} businesses for demonstration:`);
    console.log('');

    businesses.forEach((business, index) => {
      const bbbData = sampleBBBData[index];
      console.log(`📍 ${business.name}`);
      console.log(`   BBB Rating: ${bbbData.rating}`);
      console.log(`   BBB Accredited: ${bbbData.is_accredited ? 'Yes' : 'No'}${bbbData.years_accredited ? ` (${bbbData.years_accredited} years)` : ''}`);
      console.log(`   Complaints (3 years): ${bbbData.complaint_count}`);
      console.log(`   BBB Profile: ${bbbData.profile_url}`);
      console.log('');
    });

    console.log('🎯 Integration Points:');
    console.log('');
    console.log('✅ Business Profile Page:');
    console.log('   - BBB rating badge (A+, A, B+, etc.)');
    console.log('   - BBB Accredited badge with years');
    console.log('   - Dedicated BBB Profile section with full details');
    console.log('   - Link to BBB profile page');
    console.log('');
    console.log('✅ City Listing Page:');
    console.log('   - BBB rating badge in business cards');
    console.log('   - BBB Accredited status badge');
    console.log('   - Prioritized display over other feature badges');
    console.log('');
    console.log('✅ Data Quality:');
    console.log('   - Rate limited scraping (2 second delays)');
    console.log('   - Error handling for missing profiles');
    console.log('   - Timestamp tracking for data freshness');
    console.log('   - Batch processing (5 businesses at a time in test mode)');
    console.log('');

    console.log('📋 Next Steps:');
    console.log('1. Add BBB column: ALTER TABLE businesses ADD COLUMN bbb_data JSONB;');
    console.log('2. Run test enrichment: node scripts/enrich-bbb.js');
    console.log('3. Verify on staging site');
    console.log('4. Run production enrichment: node scripts/enrich-bbb.js --production');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

demonstrateBBBIntegration();