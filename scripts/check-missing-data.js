#!/usr/bin/env node

/**
 * Quick check script to see current state of missing data
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkMissingData() {
  console.log('📊 Checking current data state...\n');
  
  // Total businesses
  const { count: totalCount, error: totalError } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true });
  
  if (totalError) {
    console.error('❌ Error getting total count:', totalError.message);
    return;
  }
  
  // Businesses with no phone AND no website
  const { data: missingData, count: missingCount, error: missingError } = await supabase
    .from('businesses')
    .select('id, name, slug, address, phone, website_url, city_id', { count: 'exact' })
    .or('phone.is.null,phone.eq.')
    .or('website_url.is.null,website_url.eq.')
    .eq('is_active', true);
  
  if (missingError) {
    console.error('❌ Error getting missing data:', missingError.message);
    return;
  }
  
  // Businesses with real contact info
  const { count: withContactCount, error: contactError } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .not('phone', 'is', null)
    .not('phone', 'eq', '')
    .not('website_url', 'is', null)
    .not('website_url', 'eq', '')
    .eq('is_active', true);
  
  if (contactError) {
    console.error('❌ Error getting contact info count:', contactError.message);
    return;
  }
  
  console.log(`📈 Database Summary:`);
  console.log(`  - Total businesses: ${totalCount}`);
  console.log(`  - Missing phone AND/OR website: ${missingCount}`);
  console.log(`  - With both phone AND website: ${withContactCount}`);
  
  // Show some examples of missing data
  if (missingData && missingData.length > 0) {
    console.log(`\n🔍 Sample businesses with missing data:`);
    missingData.slice(0, 10).forEach((business, index) => {
      console.log(`  ${index + 1}. ${business.name} (ID: ${business.id})`);
      console.log(`     Phone: ${business.phone || 'MISSING'}`);
      console.log(`     Website: ${business.website_url || 'MISSING'}`);
      console.log(`     Address: ${business.address || 'No address'}`);
    });
  }
}

checkMissingData()
  .then(() => {
    console.log('\n✅ Check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Check failed:', error.message);
    process.exit(1);
  });