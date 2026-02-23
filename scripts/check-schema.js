#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkSchema() {
  console.log('📋 Checking businesses table schema...\n');
  
  // Get a sample business to see the columns
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }
  
  if (data && data.length > 0) {
    console.log('Available columns:');
    Object.keys(data[0]).forEach((column, index) => {
      console.log(`  ${index + 1}. ${column}`);
    });
  }
}

checkSchema()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Error:', error.message);
    process.exit(1);
  });