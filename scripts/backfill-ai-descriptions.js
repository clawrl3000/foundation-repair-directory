#!/usr/bin/env node
/**
 * Backfill AI-generated unique descriptions for businesses.
 * Uses: rating, review_count, year_established, features, services, website content, city/state
 * Sends to Haiku to generate a 2-3 sentence factual summary.
 *
 * Usage: node scripts/backfill-ai-descriptions.js [--dry-run] [--limit N] [--batch-size N] [--force]
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const cheerio = require('cheerio');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zvfobtpgucmitsaeltig.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FORCE = args.includes('--force');
const LIMIT = parseInt(args.find((_, i, a) => a[i - 1] === '--limit') || '0') || 0;
const BATCH_SIZE = parseInt(args.find((_, i, a) => a[i - 1] === '--batch-size') || '10') || 10;

const TEMPLATE_PATTERNS = [
  'provides professional foundation repair',
  'is a trusted foundation repair',
  'offers comprehensive foundation',
  'Contact us for a free',
  'Call today for',
  'serving the .* area',
];
const TEMPLATE_REGEX = new RegExp(TEMPLATE_PATTERNS.join('|'), 'i');

function isTemplateDescription(desc) {
  if (!desc) return true;
  if (desc.length < 50) return true;
  return TEMPLATE_REGEX.test(desc);
}

async function fetchWebsiteAbout(url) {
  if (!url) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FoundationScout/1.0)' },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    $('script, style, nav, footer, header, iframe').remove();
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    return text.substring(0, 2000); // Cap at 2000 chars
  } catch {
    return null;
  }
}

async function generateDescription(business, features, services, websiteText) {
  const { name, rating, review_count, year_established, city_name, state_name } = business;

  const featureList = features.length ? `Features: ${features.join(', ')}` : '';
  const serviceList = services.length ? `Services: ${services.join(', ')}` : '';
  const yearsInfo = year_established ? `Founded: ${year_established} (${new Date().getFullYear() - year_established} years in business)` : '';
  const ratingInfo = rating ? `Google rating: ${rating}/5 (${review_count || 0} reviews)` : '';
  const websiteInfo = websiteText ? `Website excerpt: ${websiteText.substring(0, 1000)}` : '';

  const prompt = `Write a unique 2-3 sentence description for this foundation repair company. Use ONLY facts provided below — do not invent details. Focus on what makes them stand out: years of experience, specialties, customer ratings, certifications, or unique services. Do NOT use generic phrases like "provides professional services" or "contact us today." Write in third person.

Company: ${name}
Location: ${city_name}, ${state_name}
${ratingInfo}
${yearsInfo}
${featureList}
${serviceList}
${websiteInfo}

Write the description now (2-3 sentences only, no quotes):`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content.trim();
}

async function main() {
  console.log(`🔍 Business Description Backfill ${DRY_RUN ? '(DRY RUN)' : ''}`);
  console.log(`   Force overwrite: ${FORCE}`);

  // Get businesses that need descriptions
  let query = supabase
    .from('businesses')
    .select('id, name, slug, description, rating, review_count, year_established, website_url, city_id, cities(name, states(name))')
    .eq('is_active', true)
    .order('rating', { ascending: false, nullsFirst: false });

  if (LIMIT) query = query.limit(LIMIT);

  const { data: businesses, error } = await query;
  if (error) { console.error('Query error:', error); process.exit(1); }

  // Filter to those needing new descriptions
  const needsUpdate = FORCE
    ? businesses
    : businesses.filter(b => isTemplateDescription(b.description));

  console.log(`   Total active: ${businesses.length}`);
  console.log(`   Needs update: ${needsUpdate.length}`);
  if (!needsUpdate.length) { console.log('Nothing to do!'); return; }

  let updated = 0, skipped = 0, errors = 0;
  const startTime = Date.now();

  for (let i = 0; i < needsUpdate.length; i += BATCH_SIZE) {
    const batch = needsUpdate.slice(i, i + BATCH_SIZE);
    console.log(`\n── Batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} businesses) ──`);

    for (const biz of batch) {
      const idx = i + batch.indexOf(biz) + 1;
      const cityName = biz.cities?.name || 'Unknown';
      const stateName = biz.cities?.states?.name || 'Unknown';

      try {
        // Get features
        const { data: featureRows } = await supabase
          .from('business_features')
          .select('features(name)')
          .eq('business_id', biz.id);
        const features = (featureRows || []).map(f => f.features?.name).filter(Boolean);

        // Get services
        const { data: serviceRows } = await supabase
          .from('business_services')
          .select('services(name)')
          .eq('business_id', biz.id);
        const services = (serviceRows || []).map(s => s.services?.name).filter(Boolean);

        // Fetch website content (rate limited)
        const websiteText = await fetchWebsiteAbout(biz.website_url);

        const enrichedBiz = { ...biz, city_name: cityName, state_name: stateName };
        const newDesc = await generateDescription(enrichedBiz, features, services, websiteText);

        if (DRY_RUN) {
          console.log(`[${idx}/${needsUpdate.length}] ${biz.name} (${cityName}, ${stateName})`);
          console.log(`   OLD: ${(biz.description || '').substring(0, 80)}...`);
          console.log(`   NEW: ${newDesc}`);
        } else {
          const { error: updateErr } = await supabase
            .from('businesses')
            .update({ description: newDesc })
            .eq('id', biz.id);
          if (updateErr) throw updateErr;
          console.log(`[${idx}/${needsUpdate.length}] ${biz.name} — ✅ updated`);
        }
        updated++;

        // Rate limit: ~2 per second
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        console.error(`[${idx}/${needsUpdate.length}] ${biz.name} — ❌ ${err.message}`);
        errors++;
      }
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
  console.log(`\n=== DONE (${elapsed}s) ===`);
  console.log(`Updated: ${updated} | Skipped: ${skipped} | Errors: ${errors}`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
