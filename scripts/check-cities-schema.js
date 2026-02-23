#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkCitiesSchema() {
  console.log('📋 Checking cities table schema...\n');
  
  // Get a sample city to see the columns
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }
  
  if (data && data.length > 0) {
    console.log('Cities table columns:');
    Object.keys(data[0]).forEach((column, index) => {
      console.log(`  ${index + 1}. ${column} = ${data[0][column]}`);
    });
  }
  
  // Also check states table if it exists
  console.log('\n📋 Checking states table schema...\n');
  const { data: statesData, error: statesError } = await supabase
    .from('states')
    .select('*')
    .limit(1);
  
  if (statesError) {
    console.error('❌ States table error:', statesError.message);
  } else if (statesData && statesData.length > 0) {
    console.log('States table columns:');
    Object.keys(statesData[0]).forEach((column, index) => {
      console.log(`  ${index + 1}. ${column} = ${statesData[0][column]}`);
    });
  }
}

checkCitiesSchema()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Error:', error.message);
    process.exit(1);
  });