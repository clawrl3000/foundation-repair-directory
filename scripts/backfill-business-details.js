#!/usr/bin/env node
/**
 * Backfill business details by scraping contractor websites and extracting
 * structured data via Claude Haiku.
 *
 * Usage: node scripts/backfill-business-details.js [--dry-run] [--limit N] [--batch-size N]
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env.local') });
const Anthropic = require('@anthropic-ai/sdk');
const cheerio = require('cheerio');

// ── Config ──────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zvfobtpgucmitsaeltig.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2Zm9idHBndWNtaXRzYWVsdGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU1OTQ4MSwiZXhwIjoyMDg3MTM1NDgxfQ.J22841Umicld-tUnKqgkJh-OL33uem-zB1JJEdPDmhc';

const BATCH_SIZE = parseInt(process.argv.find((_, i, a) => a[i - 1] === '--batch-size') || '20');
const LIMIT = parseInt(process.argv.find((_, i, a) => a[i - 1] === '--limit') || '99999');
const DRY_RUN = process.argv.includes('--dry-run');

const FETCH_TIMEOUT_MS = 10_000;
const FETCH_DELAY_MS = 500;   // max ~2 websites/sec
const HAIKU_DELAY_MS = 200;   // max ~5 Haiku calls/sec

// Feature ID mapping for extracted booleans/strings
const FEATURE_MAP = {
  free_inspection: 1,
  lifetime_warranty: 2,
  transferable_warranty: 3,
  twenty_five_year_warranty: 4,
  licensed_and_insured: 5,
  financing_available: 6,
  emergency_service: 7,
  free_estimates: 8,
  residential: 9,
  commercial: 10,
  bbb_accredited: 11,
  is_veteran_owned: 12,
  is_family_owned: 13,
  twenty_four_seven: 14,
  accepts_insurance: 15,
  is_locally_owned: 16,
  senior_discount: 17,
  military_discount: 18,
};

const anthropic = new Anthropic({
  apiKey: (process.env.ANTHROPIC_API_KEY || '').trim(),
});

// ── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function supabaseRequest(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': options.prefer || 'return=minimal',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Supabase ${options.method || 'GET'} ${path}: ${res.status} ${err}`);
  }
  if (options.prefer?.includes('return=representation') || !options.method) {
    return res.json();
  }
}

async function getBusinessesNeedingScrape() {
  // Get businesses with website_url, and count their features via a subquery
  // We'll fetch all with website_url, then filter by feature count client-side
  const businesses = await supabaseRequest(
    `businesses?select=id,name,website_url,year_established&website_url=not.is.null&is_active=eq.true&order=name&limit=${LIMIT}`,
    { headers: { 'Prefer': 'count=exact' } }
  );

  // Get feature counts per business
  const featureCounts = await supabaseRequest(
    'business_features?select=business_id'
  );

  const countMap = {};
  for (const row of featureCounts) {
    countMap[row.business_id] = (countMap[row.business_id] || 0) + 1;
  }

  // Filter to businesses with fewer than 3 features
  return businesses.filter(b => (countMap[b.id] || 0) < 3);
}

async function fetchPage(url, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DirectoryBot/1.0)',
        'Accept': 'text/html',
      },
      redirect: 'follow',
    });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return null;
    return await res.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function extractText(html) {
  const $ = cheerio.load(html);
  // Remove script, style, nav, footer noise
  $('script, style, noscript, iframe, svg, nav, footer, header').remove();
  const text = $('body').text()
    .replace(/\s+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  // Cap at ~8000 chars to keep Haiku costs low
  return text.slice(0, 8000);
}

async function scrapeWebsite(baseUrl) {
  // Normalize base URL
  let base = baseUrl.trim();
  if (!base.startsWith('http')) base = 'https://' + base;
  if (base.endsWith('/')) base = base.slice(0, -1);

  const pages = ['', '/about', '/about-us', '/services', '/warranty', '/our-services'];
  const allText = [];

  for (const path of pages) {
    const url = base + path;
    const html = await fetchPage(url);
    if (html) {
      const text = extractText(html);
      if (text.length > 100) {
        allText.push(`--- PAGE: ${path || '/'} ---\n${text}`);
      }
    }
    await sleep(FETCH_DELAY_MS);
  }

  return allText.join('\n\n');
}

async function extractWithHaiku(businessName, websiteText) {
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Analyze this contractor website text for "${businessName}" and extract structured data. Return ONLY valid JSON, no other text.

Website text:
${websiteText}

Extract this JSON structure (use null for anything you can't determine):
{
  "free_inspection": boolean or null,
  "free_estimates": boolean or null,
  "warranty_info": "string description" or null,
  "has_lifetime_warranty": boolean or null,
  "has_transferable_warranty": boolean or null,
  "has_25_year_warranty": boolean or null,
  "year_established": number or null,
  "licensed_and_insured": boolean or null,
  "financing_available": boolean or null,
  "emergency_service": boolean or null,
  "is_family_owned": boolean or null,
  "is_veteran_owned": boolean or null,
  "is_locally_owned": boolean or null,
  "bbb_accredited": boolean or null,
  "residential": boolean or null,
  "commercial": boolean or null,
  "twenty_four_seven": boolean or null,
  "accepts_insurance": boolean or null,
  "senior_discount": boolean or null,
  "military_discount": boolean or null,
  "services_offered": ["string"] or null,
  "certifications": ["string"] or null
}

Only mark something true if the website clearly states it. Do not guess.`
    }],
  });

  const text = response.content[0].text.trim();
  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in Haiku response');
  return JSON.parse(jsonMatch[0]);
}

async function writeResults(business, extracted) {
  const stats = { featuresAdded: 0, yearUpdated: false };

  // Update year_established if found and currently null
  if (extracted.year_established && !business.year_established) {
    const year = parseInt(extracted.year_established);
    if (year >= 1900 && year <= 2026) {
      if (!DRY_RUN) {
        await supabaseRequest(`businesses?id=eq.${business.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ year_established: year }),
        });
      }
      stats.yearUpdated = true;
    }
  }

  // Map extracted booleans to feature IDs
  const featureInserts = [];

  const booleanFeatures = {
    free_inspection: extracted.free_inspection,
    free_estimates: extracted.free_estimates,
    lifetime_warranty: extracted.has_lifetime_warranty,
    transferable_warranty: extracted.has_transferable_warranty,
    twenty_five_year_warranty: extracted.has_25_year_warranty,
    licensed_and_insured: extracted.licensed_and_insured,
    financing_available: extracted.financing_available,
    emergency_service: extracted.emergency_service,
    is_family_owned: extracted.is_family_owned,
    is_veteran_owned: extracted.is_veteran_owned,
    is_locally_owned: extracted.is_locally_owned,
    bbb_accredited: extracted.bbb_accredited,
    residential: extracted.residential,
    commercial: extracted.commercial,
    twenty_four_seven: extracted.twenty_four_seven,
    accepts_insurance: extracted.accepts_insurance,
    senior_discount: extracted.senior_discount,
    military_discount: extracted.military_discount,
  };

  for (const [key, value] of Object.entries(booleanFeatures)) {
    if (value === true && FEATURE_MAP[key]) {
      featureInserts.push({
        business_id: business.id,
        feature_id: FEATURE_MAP[key],
        value: 'yes',
      });
    }
  }

  if (featureInserts.length > 0 && !DRY_RUN) {
    // Use upsert to avoid duplicates (on conflict do nothing)
    await supabaseRequest('business_features', {
      method: 'POST',
      body: JSON.stringify(featureInserts),
      headers: { 'Prefer': 'resolution=merge-duplicates' },
    });
  }
  stats.featuresAdded = featureInserts.length;

  return stats;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🔍 Business Details Scraper${DRY_RUN ? ' (DRY RUN)' : ''}`);
  console.log(`   Batch size: ${BATCH_SIZE} | Limit: ${LIMIT}\n`);

  const businesses = await getBusinessesNeedingScrape();
  const total = Math.min(businesses.length, LIMIT);
  console.log(`Found ${businesses.length} businesses needing scrape (processing ${total})\n`);

  if (total === 0) {
    console.log('Nothing to do.');
    return;
  }

  const summary = { processed: 0, featuresAdded: 0, yearsUpdated: 0, errors: 0, skippedNoContent: 0 };

  // Process in batches
  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = businesses.slice(i, Math.min(i + BATCH_SIZE, total));
    console.log(`── Batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} businesses) ──`);

    for (let j = 0; j < batch.length; j++) {
      const biz = batch[j];
      const idx = i + j + 1;
      const prefix = `[${idx}/${total}]`;

      try {
        // Scrape website
        const websiteText = await scrapeWebsite(biz.website_url);
        if (!websiteText || websiteText.length < 200) {
          console.log(`${prefix} ${biz.name} — skipped (no usable content)`);
          summary.skippedNoContent++;
          summary.processed++;
          continue;
        }

        // Extract with Haiku
        const extracted = await extractWithHaiku(biz.name, websiteText);
        await sleep(HAIKU_DELAY_MS);

        // Write results
        const stats = await writeResults(biz, extracted);

        const parts = [];
        if (stats.featuresAdded > 0) parts.push(`+${stats.featuresAdded} features`);
        if (stats.yearUpdated) parts.push(`year=${extracted.year_established}`);
        if (extracted.services_offered?.length) parts.push(`${extracted.services_offered.length} services`);
        if (parts.length === 0) parts.push('no new data');

        console.log(`${prefix} ${biz.name} — ${parts.join(', ')}`);

        summary.processed++;
        summary.featuresAdded += stats.featuresAdded;
        if (stats.yearUpdated) summary.yearsUpdated++;

      } catch (err) {
        console.error(`${prefix} ${biz.name} — ERROR: ${err.message}`);
        summary.errors++;
        summary.processed++;
      }
    }

    console.log('');
  }

  // Print summary
  console.log('═══════════════════════════════════════════');
  console.log(`  Total processed:      ${summary.processed}`);
  console.log(`  Features added:       ${summary.featuresAdded}`);
  console.log(`  Years updated:        ${summary.yearsUpdated}`);
  console.log(`  Skipped (no content): ${summary.skippedNoContent}`);
  console.log(`  Errors:               ${summary.errors}`);
  console.log('═══════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
