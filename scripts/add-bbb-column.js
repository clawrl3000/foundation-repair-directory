#!/usr/bin/env node

// Alternative approach to add the bbb_data column using raw SQL query via Supabase
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addBBBColumn() {
  try {
    console.log('Attempting to add bbb_data column to businesses table...');
    
    // Since we can't execute DDL via the JS client, let's try via direct API call
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec`,
      {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          'query': 'ALTER TABLE businesses ADD COLUMN IF NOT EXISTS bbb_data JSONB;'
        })
      }
    );

    if (response.ok) {
      console.log('✓ Successfully added bbb_data column');
    } else {
      console.log('⚠️ Could not add column via API - needs manual SQL execution');
      console.log('Response:', response.status, await response.text());
      console.log('');
      console.log('Please run this SQL in Supabase SQL Editor:');
      console.log('ALTER TABLE businesses ADD COLUMN IF NOT EXISTS bbb_data JSONB;');
    }
    
  } catch (error) {
    console.log('⚠️ Could not add column programmatically - needs manual SQL execution');
    console.log('Error:', error.message);
    console.log('');
    console.log('Please run this SQL in Supabase SQL Editor:');
    console.log('ALTER TABLE businesses ADD COLUMN IF NOT EXISTS bbb_data JSONB;');
  }
}

addBBBColumn();