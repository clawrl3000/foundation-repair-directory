#!/usr/bin/env node
/**
 * Backfill Google Places photos for businesses missing images.
 * 
 * Usage: node scripts/backfill-photos.js [--dry-run] [--limit 50] [--batch-size 10]
 * 
 * Cost: ~$0.034 per business (findPlace + placeDetails)
 * Photo references come free in the Details response.
 */

// Hardcoded: env var on this machine points to a restricted key. This is the Vercel production key.
const GOOGLE_API_KEY = 'AIzaSyAW9jQdxkFobvnDbLSzXslrmzf98KHgJYY';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zvfobtpgucmitsaeltig.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Zm9idHBndWNtaXRzYWVsdGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU1OTQ4MSwiZXhwIjoyMDg3MTM1NDgxfQ.J22841Umicld-tUnKqgkJh-OL33uem-zB1JJEdPDmhc';

const MAX_PHOTOS_PER_BUSINESS = 5;
const BATCH_SIZE = parseInt(process.argv.find((_, i, a) => a[i-1] === '--batch-size') || '10');
const LIMIT = parseInt(process.argv.find((_, i, a) => a[i-1] === '--limit') || '99999');
const DRY_RUN = process.argv.includes('--dry-run');
const DELAY_MS = 200; // 5 requests/sec to be safe

// ── Helpers ──────────────────────────────────────────────────────────────────

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function supabaseGet(table, query = '') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'count=exact',
    },
  });
  const count = res.headers.get('content-range')?.split('/')[1];
  const data = await res.json();
  return { data, count: count ? parseInt(count) : data.length };
}

async function supabaseInsert(table, rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase insert failed: ${res.status} ${err}`);
  }
  return true;
}

async function findPlace(name, address) {
  const input = `${name} ${address}`.trim();
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(input)}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status === 'OK' && data.candidates?.length > 0) {
    return data.candidates[0].place_id;
  }
  return null;
}

async function getPlacePhotos(placeId) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_API_KEY}`;
  const res = await fetch(url);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch(e) { console.log('    PARSE ERROR:', text.substring(0, 200)); return []; }
  if (data.status !== 'OK') { console.log('    API ERROR:', data.status, data.error_message || ''); return []; }
  const count = data.result?.photos?.length || 0;
  if (count > 0) {
    return data.result.photos.slice(0, MAX_PHOTOS_PER_BUSINESS).map((p, i) => ({
      photo_reference: p.photo_reference,
      width: p.width,
      height: p.height,
      attributions: p.html_attributions || [],
    }));
  }
  return [];
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🦞 FoundationScout Photo Backfill');
  console.log(`   Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}`);
  console.log(`   Batch size: ${BATCH_SIZE}`);
  console.log(`   Limit: ${LIMIT}`);
  console.log('');

  // Get all business IDs that already have images
  const { data: existingImages } = await supabaseGet('business_images', 'select=business_id&limit=10000');
  const hasImages = new Set(existingImages.map(r => r.business_id));
  console.log(`📸 ${hasImages.size} businesses already have images`);

  // Get all active businesses
  const { data: businesses, count: totalCount } = await supabaseGet(
    'businesses',
    'select=id,name,address,google_place_id&is_active=eq.true&order=id.asc&limit=10000'
  );
  console.log(`🏢 ${businesses.length} active businesses total`);

  // Filter to those missing images
  const missing = businesses.filter(b => !hasImages.has(b.id)).slice(0, LIMIT);
  console.log(`🔍 ${missing.length} businesses need photos`);
  console.log('');

  let processed = 0;
  let found = 0;
  let failed = 0;
  let noPhotos = 0;
  let totalPhotos = 0;
  const startTime = Date.now();

  for (let i = 0; i < missing.length; i += BATCH_SIZE) {
    const batch = missing.slice(i, i + BATCH_SIZE);
    console.log(`── Batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(missing.length/BATCH_SIZE)} (${batch.length} businesses) ──`);

    for (const biz of batch) {
      processed++;
      const progress = `[${processed}/${missing.length}]`;

      try {
        // Step 1: Find the place (skip if we already have google_place_id)
        let placeId = biz.google_place_id;
        if (!placeId) {
          placeId = await findPlace(biz.name, biz.address || '');
          await sleep(DELAY_MS);
        }

        if (!placeId) {
          console.log(`  ${progress} ❌ ${biz.name} — no Place ID found`);
          failed++;
          continue;
        }

        // Step 2: Get photos
        const photos = await getPlacePhotos(placeId);
        await sleep(DELAY_MS);

        if (photos.length === 0) {
          console.log(`  ${progress} 📭 ${biz.name} — no photos available`);
          noPhotos++;
          continue;
        }

        // Step 3: Insert into business_images
        const rows = photos.map((p, idx) => ({
          business_id: biz.id,
          url: p.photo_reference,
          alt_text: `${biz.name} photo ${idx + 1}`,
          source: 'google_places',
          is_primary: idx === 0,
          sort_order: idx,
        }));

        if (!DRY_RUN) {
          await supabaseInsert('business_images', rows);
        }

        found++;
        totalPhotos += photos.length;
        console.log(`  ${progress} ✅ ${biz.name} — ${photos.length} photos${DRY_RUN ? ' (dry run)' : ''}`);

      } catch (err) {
        console.error(`  ${progress} 💥 ${biz.name} — ${err.message}`);
        failed++;
      }
    }

    // Progress summary every batch
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
    const rate = (processed / (elapsed || 1)).toFixed(1);
    console.log(`   ⏱  ${elapsed}s elapsed, ${rate} biz/s, ${found} found, ${noPhotos} no photos, ${failed} failed`);
    console.log('');
  }

  // Final summary
  console.log('═══════════════════════════════════════');
  console.log('🦞 BACKFILL COMPLETE');
  console.log(`   Processed: ${processed}`);
  console.log(`   Photos found: ${found} businesses (${totalPhotos} total photos)`);
  console.log(`   No photos: ${noPhotos}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Time: ${((Date.now() - startTime) / 1000).toFixed(0)}s`);
  console.log(`   Est. API cost: ~$${(processed * 0.034).toFixed(2)}`);
  if (DRY_RUN) console.log('   ⚠️  DRY RUN — no data was written');
  console.log('═══════════════════════════════════════');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
