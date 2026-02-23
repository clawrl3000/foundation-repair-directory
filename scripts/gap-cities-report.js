#!/usr/bin/env node

/**
 * Generate a comprehensive report on gap cities status
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

async function generateReport() {
  console.log('📊 Foundation Scout — Gap Cities Report\n');
  
  // Overall statistics
  const { count: totalCount } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true });
  
  const { count: activeCount } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);
  
  const { count: withContactCount } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .not('phone', 'is', null)
    .not('phone', 'eq', '')
    .not('website_url', 'is', null)
    .not('website_url', 'eq', '')
    .eq('is_active', true);
  
  const { count: placeholderCount } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .or('phone.is.null,phone.eq.')
    .or('website_url.is.null,website_url.eq.')
    .eq('is_active', true);
  
  console.log('🏢 OVERALL BUSINESS STATISTICS');
  console.log('=' .repeat(50));
  console.log(`Total businesses: ${totalCount}`);
  console.log(`Active businesses: ${activeCount}`);
  console.log(`Businesses with full contact info: ${withContactCount}`);
  console.log(`Businesses missing contact info: ${placeholderCount}`);
  
  // City-by-city analysis
  console.log('\n🏙️  CITY-BY-CITY ANALYSIS');
  console.log('=' .repeat(50));
  
  const { data: cityData } = await supabase
    .from('cities')
    .select(`
      id, name,
      states!inner(abbreviation),
      businesses!inner(
        id, name, phone, website_url, is_active, data_source
      )
    `)
    .eq('businesses.is_active', true)
    .order('name');
  
  let citiesWithOnlyPlaceholders = 0;
  let citiesWithMixedData = 0;
  let citiesWithOnlyRealData = 0;
  
  for (const city of cityData) {
    const businesses = city.businesses;
    const realBusinesses = businesses.filter(b => 
      (b.phone && b.phone.trim() !== '') || (b.website_url && b.website_url.trim() !== '')
    );
    const placeholders = businesses.filter(b => 
      (!b.phone || b.phone.trim() === '') && (!b.website_url || b.website_url.trim() === '')
    );
    const googlePlacesBusinesses = businesses.filter(b => 
      b.data_source === 'google_places_api_fill_gaps'
    );
    
    if (placeholders.length === businesses.length) {
      citiesWithOnlyPlaceholders++;
      console.log(`❌ ${city.name}, ${city.states.abbreviation}: ${placeholders.length} placeholders only`);
    } else if (placeholders.length > 0) {
      citiesWithMixedData++;
      console.log(`⚠️  ${city.name}, ${city.states.abbreviation}: ${realBusinesses.length} real, ${placeholders.length} placeholders${googlePlacesBusinesses.length > 0 ? ` (${googlePlacesBusinesses.length} from Google Places)` : ''}`);
    } else {
      citiesWithOnlyRealData++;
    }
  }
  
  console.log('\n📈 CITY SUMMARY');
  console.log('=' .repeat(50));
  console.log(`Cities with only placeholders: ${citiesWithOnlyPlaceholders}`);
  console.log(`Cities with mixed data: ${citiesWithMixedData}`);
  console.log(`Cities with only real data: ${citiesWithOnlyRealData}`);
  
  // Recent additions from Google Places API
  const { data: googlePlacesAdded, count: googlePlacesCount } = await supabase
    .from('businesses')
    .select('name, phone, website_url, created_at', { count: 'exact' })
    .eq('data_source', 'google_places_api_fill_gaps')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  if (googlePlacesCount > 0) {
    console.log(`\n🆕 BUSINESSES ADDED FROM GOOGLE PLACES API (${googlePlacesCount})`);
    console.log('=' .repeat(50));
    googlePlacesAdded.slice(0, 10).forEach((business, index) => {
      const hasContact = (business.phone && business.phone.trim() !== '') || (business.website_url && business.website_url.trim() !== '');
      console.log(`${index + 1}. ${business.name} ${hasContact ? '✅' : '❌'}`);
      if (business.phone) console.log(`   Phone: ${business.phone}`);
      if (business.website_url) console.log(`   Website: ${business.website_url}`);
    });
    
    if (googlePlacesAdded.length > 10) {
      console.log(`   ... and ${googlePlacesAdded.length - 10} more`);
    }
  }
  
  console.log('\n🎯 SUMMARY');
  console.log('=' .repeat(50));
  if (citiesWithOnlyPlaceholders === 0) {
    console.log('✅ SUCCESS: No cities have only placeholder businesses!');
    console.log('   Every city now has at least one business with contact information.');
  } else {
    console.log(`❌ ${citiesWithOnlyPlaceholders} cities still need real businesses added.`);
  }
  
  if (googlePlacesCount > 0) {
    console.log(`🚀 Added ${googlePlacesCount} businesses via Google Places API`);
  }
  
  console.log(`📞 ${withContactCount}/${activeCount} active businesses have complete contact info`);
  console.log(`🔄 ${placeholderCount} businesses still need phone/website data`);
}

generateReport()
  .then(() => {
    console.log('\n✅ Report completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Report failed:', error.message);
    process.exit(1);
  });