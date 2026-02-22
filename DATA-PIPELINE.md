# Foundation Scout — Data Pipeline & Methodology

> Last updated: 2026-02-20
> Supabase project: `zvfobtpgucmitsaeltig` (separate from FindALocalPro)

## Overview

Foundation Scout is a nationwide foundation repair directory. Data is collected through a multi-step pipeline:

1. **Seed cities/states** → `populate-foundation-db.sh`
2. **Discover businesses** → Manual research + Google Maps + Tavily search
3. **Scrape & enrich** → `scripts/scrape-business-data.py` (Claude AI + rule-based extraction)
4. **Load structured data** → `scripts/seed-database.ts` / `scripts/load-real-data.ts`

## Supabase Project

```
URL: https://zvfobtpgucmitsaeltig.supabase.co
Ref: zvfobtpgucmitsaeltig
```

Env vars in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Also set on Vercel for production deploys.

## Database Schema

| Table | Purpose | Rows (as of migration) |
|-------|---------|------------------------|
| `states` | US states + DC | 51 |
| `cities` | Cities with state FK | 356 |
| `businesses` | Foundation repair contractors | 360 |
| `services` | Service types (Pier & Beam, Slab, etc.) | 25 |
| `features` | Business features (Free Estimates, etc.) | 20 |
| `business_services` | Junction: business ↔ service | 81 |
| `business_features` | Junction: business ↔ feature (with value) | 28 |
| `business_images` | Business photos from Google/scraping | 997 |
| `city_content` | SEO content per city | 0 (to generate) |
| `pricing_data` | Service pricing per business | 0 (to collect) |
| `leads` | Form submissions | 0 |

## Step 1: Seed Cities & States

```bash
# Populates states and cities tables
~/clawd/populate-foundation-db.sh
```

Currently covers: Texas, California, Florida, Georgia, North Carolina, Ohio, Michigan, Pennsylvania, Illinois, Virginia, Tennessee, Missouri + all 50 states.

## Step 2: Discover Businesses

### Method A: Tavily Search (recommended for bulk)
```bash
source ~/clawd/venv/bin/activate
python3 ~/clawd/skills/tavily-search/scripts/search.py \
  "foundation repair contractors in Houston TX" \
  --include-answer
```

### Method B: Google Maps API
Foundation Scout has a Google Maps API key (`GOOGLE_MAPS_API_KEY` in `.env.local`).

### Method C: Manual Research
- Google "[city] foundation repair"
- BBB search
- Yelp search
- HomeAdvisor/Angi listings

### Adding to Database
Insert businesses via Supabase REST API or the `load-real-data.ts` script:
```bash
cd ~/clawd/foundation-repair-directory
npx tsx scripts/load-real-data.ts
```

## Step 3: Scrape & Enrich

The Python scraper visits each business website and extracts:
- Services offered (mapped to `services` table)
- Features (Free Estimates, Licensed, Insurance, Warranty, etc.)
- Description text
- Phone numbers, addresses
- Reviews (if available)

```bash
cd ~/clawd/foundation-repair-directory
source venv/bin/activate

# Test mode (3 businesses, no DB writes)
python3 scripts/scrape-business-data.py --test

# Full run (all Texas businesses with websites)
python3 scripts/scrape-business-data.py --state texas

# All states
python3 scripts/scrape-business-data.py
```

**How it works:**
1. Queries Supabase for businesses with `website_url` set
2. Fetches each website with requests + BeautifulSoup
3. Sends page content to Claude API for structured extraction
4. Falls back to rule-based regex extraction if Claude unavailable
5. Creates new services/features in DB automatically
6. Links businesses to services/features via junction tables

**Dependencies:**
```bash
cd ~/clawd/foundation-repair-directory
source venv/bin/activate
pip install supabase anthropic requests beautifulsoup4
```

**Environment variables needed:**
- `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (from `.env.local`)
- `ANTHROPIC_API_KEY` (optional — uses rule-based fallback without it)

## Step 4: Image Collection

Business images come from Google Places API and are stored in `business_images` table.

```bash
cd ~/clawd/foundation-repair-directory
npx tsx scripts/enrich-businesses.ts
```

## Adding a New State

1. Add state to `states` table (if not already present — all 51 should be)
2. Add cities: modify `populate-foundation-db.sh` or insert manually
3. Discover businesses via Tavily/Google for each city
4. Run scraper: `python3 scripts/scrape-business-data.py --state [state-slug]`
5. Verify on site: `https://foundationscout.com/[state-slug]`

## Reusable Patterns for Other Directory Projects

The methodology here can be applied to any vertical directory:

1. **State → City → Business hierarchy** with foreign keys
2. **Junction tables** for services and features (many-to-many)
3. **Tavily + web scraping** for business discovery
4. **Claude AI extraction** for structured data from unstructured websites
5. **Image collection** via Google Places API
6. **SEO city pages** with cost data, FAQs, and local content

**FindALocalPro** uses a different but complementary approach:
- Tavily → BBB → BuildZoom → IDFPR for **verification** (trust scoring)
- Foundation Scout uses Tavily → website scraping for **enrichment** (services, features, images)
- Both patterns could be combined: verify THEN enrich

## Key Differences: Foundation Scout vs FindALocalPro

| | Foundation Scout | FindALocalPro |
|---|---|---|
| **Supabase** | `zvfobtpgucmitsaeltig` | `hocipkeeikriqyojiboj` |
| **Scope** | Nationwide | DuPage County, IL |
| **Vertical** | Foundation repair only | Multi-trade (plumbing, HVAC, etc.) |
| **Focus** | Discovery + enrichment | Verification + trust scoring |
| **Tech** | Next.js SSR | React SPA (Vite) |
| **Revenue** | Lead gen (form → contractor) | Lead gen (chat → affiliate) |
