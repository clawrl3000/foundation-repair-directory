# Foundation Scout — Data Enrichment & Differentiator Plan

> Created: 2026-02-22
> Status: IN PROGRESS — Starting Phase 1

## The Problem
Business profile pages have thin content — empty "Our Services" and "Why Choose Us" sections. No differentiation from just Googling a contractor. Need real data pulled from contractor websites + third-party verification.

## Phase 1: Website Content Enrichment (CURRENT)
**Goal:** Crawl contractor websites and populate services, descriptions, features

1. Build a script that iterates businesses with `website_url` set
2. For each, crawl their site using `web_fetch` or Crawl4AI
3. Extract:
   - Services offered (map to existing `services` table)
   - Business description (if current one is thin/null)
   - Years in business / year established
   - Warranty info
   - Service area details
   - Specialties / certifications they claim
4. Write back to Supabase:
   - `business_services` junction table
   - `business_features` junction table  
   - `businesses.description` field
   - `businesses.year_established` field
5. Run in batches of ~50 to avoid rate limits
6. Log what was enriched vs skipped

**DB Stats (as of 2026-02-22):**
- 515 active businesses
- 83 business_services relationships (most pages empty)
- ~211 have ratings, ~200+ have website_url

**Files:**
- Script: `~/clawd/foundation-repair-directory/scripts/enrich-businesses.py` (to build)
- Supabase project: zvfobtpgucmitsaeltig

## Phase 2: BBB Rating Integration
**Goal:** Pull BBB ratings and display on business cards

1. Search BBB.org for each contractor
2. Extract: BBB rating (A+, A, B, etc.), accreditation status, complaints count
3. Store in new `verification_checks` table or business metadata
4. Display BBB badge on business cards and profile pages
5. Cron job to refresh quarterly

## Phase 3: State License Verification  
**Goal:** Verify contractor licenses are active

1. Check state licensing board databases (varies by state)
2. Store license status: active/expired/not found
3. Display license verification badge
4. Use same approach as FindALocalPro's `provider-verification` skill

## Phase 4: Trust Score
**Goal:** Composite score displayed on every listing

Formula components:
- BBB rating (weighted)
- License status (binary boost)
- Google review count + rating
- Years in business
- Website exists (minor signal)

Display as: "Trust Score: 87/100" or similar

## Phase 5: Side-by-Side Comparison
**Goal:** Let users compare 2-3 contractors on one page

- Add "Compare" checkbox to business cards
- Comparison page shows services, ratings, BBB, license status side by side
- Big differentiator vs Google

## What Sets Us Apart (Elevator Pitch)
> "Google gives you a list. We give you the research. Every contractor's BBB rating, license status, real reviews, and services — all verified and compared side by side. Do 2 hours of homework in 2 minutes."
