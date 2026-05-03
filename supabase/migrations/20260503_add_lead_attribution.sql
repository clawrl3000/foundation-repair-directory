-- Lead-source attribution columns
--
-- Captures where each lead originated so we can tie outcomes back to specific
-- pages, traffic sources, and CTAs. Required for the PRD-SERP-PROMISE-CONCIERGE-LOOP
-- (2026-05-03) Phase 0 forensic check + Phase 2 lead log + Phase 4/5 SEO
-- experiments. Without these fields the experiments are unevaluable.
--
-- All three columns are nullable — they may be missing for older leads
-- (predating this migration), leads submitted via channels that don't include
-- the attribution payload, or unusual referrers (e.g. iframed embeds).

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS landing_page text,
  ADD COLUMN IF NOT EXISTS referrer text,
  ADD COLUMN IF NOT EXISTS cta_source text;

COMMENT ON COLUMN leads.landing_page IS
  'Full URL the user was on when they submitted the lead (window.location.href). Includes path + query string.';

COMMENT ON COLUMN leads.referrer IS
  'HTTP Referer at submit time (document.referrer). Reveals organic-search vs direct vs internal traffic.';

COMMENT ON COLUMN leads.cta_source IS
  'Identifier of the CTA that fired the lead (e.g. cost_page_estimate_click_hero). Set by EstimateButton.eventName prop and propagated through QuoteWizardModal → QuoteWizard → /api/leads. Mirrors Plausible custom-event names.';

-- Optional indexes for the most common analytics queries (group-by source page,
-- group-by CTA). Cheap to add, easy to drop if usage shifts.
CREATE INDEX IF NOT EXISTS idx_leads_landing_page ON leads(landing_page);
CREATE INDEX IF NOT EXISTS idx_leads_cta_source ON leads(cta_source);
