# PRD: FoundationScout SERP Promise + Concierge Loop

**Owner:** MG  
**Date:** 2026-05-03  
**Status:** Draft  
**Project:** FoundationScout  
**Primary pages:** `/cost/[state]/foundation-repair-cost`  

---

## 1. Summary

FoundationScout already has the right product shape: state cost pages, estimate CTA, calculator, quote wizard, lead capture, and AI Scout Report delivery.

The problem is not that the site needs to become a cost/triage/trust product. It already is one.

The current problem is sharper:

> Google is showing FoundationScout for valuable foundation-repair searches, but users are mostly not clicking. When users do arrive, the lead flow works, but the concierge/middleman loop is not yet formalized or measured.

This PRD treats the **manual concierge fulfillment loop** as the primary experiment. SERP/title and CTA-copy work are supporting infrastructure: useful if they increase qualified flow, but not the thing that proves the business.

> **Primary bet vs. supporting work.** The 30-day manual concierge fulfillment loop is the primary bet of this document. The SEO copy work is supporting infrastructure that helps generate volume for the concierge experiment, not the headline outcome. At the site's current ~0.074% CTR, even a 50% relative CTR lift adds ~30 incremental clicks/month — meaningful but not business-defining. The concierge loop, by contrast, can validate or invalidate a real business in 30 days regardless of click volume.

---

## 2. Background

### Current site structure

The current code already includes:

- State cost pages: `src/app/cost/[state]/foundation-repair-cost/page.tsx`
- Cost calculator: `src/components/CostCalculator.tsx`
- Quote wizard: `src/components/QuoteWizard.tsx`
- Estimate modal trigger: `src/components/EstimateButton.tsx`
- Lead API: `src/app/api/leads/route.ts`
- Scout Report generation: `src/app/api/scout-report/route.ts`
- Analytics helpers: `src/components/ConversionTracker.tsx`

The previous calculator-link PRD has largely been implemented. The current cost page already includes:

- Hero estimate CTA
- Hero calculator CTA
- Inline calculator link after cost table
- Methodology/trust box
- Pre-FAQ calculator CTA
- FAQ schema

This PRD should not be interpreted as a request to rebuild that structure.

### GSC findings from 2026-05-03 export

Source: `foundationscout.com-Performance-on-Search-2026-05-03.zip`

| Metric | Value |
|---|---:|
| Total clicks | 38 |
| Total impressions | 51,316 |
| Overall CTR | 0.074% |
| Weighted avg position | 29.54 |

Cost pages are the strongest page type:

| Segment | Clicks | Impressions | CTR | Weighted avg position |
|---|---:|---:|---:|---:|
| `/cost/*/foundation-repair-cost` | 25 | 11,639 | 0.215% | 16.34 |

High-opportunity states with page-one rankings but 0% CTR:

| Page | Impressions | Avg position | CTR |
|---|---:|---:|---:|
| `/cost/california/foundation-repair-cost` | 742 | 7.89 | 0% |
| `/cost/michigan/foundation-repair-cost` | 620 | 6.72 | 0% |
| `/cost/tennessee/foundation-repair-cost` | 266 | 5.13 | 0% |
| `/cost/ohio/foundation-repair-cost` | 270 | 9.60 | 0% |
| `/cost/oklahoma/foundation-repair-cost` | 237 | 6.84 | 0% |
| `/cost/arizona/foundation-repair-cost` | 207 | 6.16 | 0% |
| `/cost/georgia/foundation-repair-cost` | 192 | 6.46 | 0% |

### New qualitative signal

Over the weekend before 2026-05-03, a user submitted an email/signup and received the information they were looking for. MG then used OpenClaw/manual outreach around the user and plans to act as a middleman: gather useful local information, contact or identify nearby contractors, and deliver the result back to the requester.

That changes the status of FoundationScout:

> From SEO experiment to concierge lead-gen prototype.

### Existing Phase 1 meta work already shipped

Commit `d8b4ebb` (`seo: add Phase 1 custom meta overrides for 9 high-impression states`) shipped custom metadata on 2026-04-23 for state aggregator pages in:

```text
src/app/[state]/page.tsx
```

Those overrides include states that also appear in this PRD's candidate set, including Michigan, Tennessee, Ohio, and Georgia.

Important nuance:

- The shipped overrides are on **state pages** like `/michigan`, not the **cost pages** like `/cost/michigan/foundation-repair-cost`.
- Even so, this PRD must not blindly ignore that work because those state pages may be part of the same discovery/lead funnel.
- Day 0 must pull GSC pre/post data for those states and identify whether the weekend lead came from a state page, cost page, calculator, city page, business page, or another route.

If the April 23 state-page overrides moved CTR or leads, preserve the winning pattern. If they did not, this PRD can test a different benefit-led or trust-led promise.

---

## 3. Problem

FoundationScout is visible for valuable terms, but the SERP and conversion promise may be too generic.

Current title pattern:

```text
Foundation Repair Cost in Michigan (2026): $500–$25K+ | Price Guide
```

This is factually good, but it reads like an article. It does not fully communicate the deeper user benefit:

- Help me understand what this might cost.
- Help me know how urgent this is.
- Help me avoid getting ripped off.
- Help me find a few local options without calling everyone myself.

The site already offers much of this after the click. The SERP promise and top-of-page CTA should make that more explicit.

But the harder truth is that the overall CTR is not merely "a little low." At **0.074% CTR** and weighted avg position **29.54**, much of the impression volume is likely structurally low-value:

- Local Pack / map results may satisfy the user before organic clicks.
- Angi, HomeAdvisor, and known contractor brands may absorb trust.
- Some impressions may come from broad/head queries where a DR-0 directory is not yet credible.
- Some SERPs may be AI Overview or SERP-feature heavy.

Therefore, SEO copy work should be treated as **supporting infrastructure**, not the main business validation. The main validation is whether captured users can be served manually and whether someone in the chain will pay.

---

## 4. Goals

### Primary goal

Validate whether manual concierge fulfillment can become the business wedge. Specifically: can a small volume of incoming leads be turned into useful, repeatable, monetizable service delivery within 30 days?

### Secondary goal

Increase qualified clicks and lead submissions from state cost pages by making the promise more specific:

> Cost sanity check + local contractor options + Scout Report.

### Tertiary goal

Instrument the funnel well enough to know which path is working:

- SERP click
- Cost-page CTA click
- Quote wizard start
- Quote wizard completion
- Scout Report generated
- Scout Report emailed
- User replied
- Contractor contacted
- Contractor responded
- Monetization conversation started
- Payer interest recorded

---

## 5. Non-goals

- Do not redesign the whole site.
- Do not remove the calculator.
- Do not remove existing estimate CTAs.
- Do not add large-scale automation before observing 30 days of manual fulfillment.
- Do not launch broad programmatic changes across every state at once.
- Do not interpret impressions alone as business validation.
- Do not optimize for vanity traffic if lead quality drops.

---

## 6. Target User

### Primary user

A homeowner who sees signs of possible foundation damage:

- wall or floor cracks
- sticking doors/windows
- sloping floors
- bowing basement walls
- moisture/water in basement or crawl space
- general anxiety that something structural may be wrong

### User state of mind

They are likely anxious, price-sensitive, and distrustful of contractors. They do not want a directory first. They want confidence.

Their internal questions:

- Is this serious?
- What might this cost?
- Who should I call?
- Can I trust them?
- Am I about to get sold something I do not need?

---

## 7. Product Positioning

### Current implicit positioning

```text
Foundation repair cost guide and contractor directory.
```

### Desired positioning

```text
Get a foundation repair cost sanity check and 3 local contractor options before you start making calls.
```

### Short promise variants to test

- `Estimate repair cost before you call a contractor`
- `Get a cost sanity check and local foundation repair options`
- `See likely costs and find 3 local pros near you`
- `Not sure how bad it is? Get a Scout Report`
- `Avoid surprise foundation repair quotes`
- `Verified local contractors, no paid placement`
- `BBB and license-aware contractor shortlist`

---

## 8. Scope

### Phase 0: Lead-source forensic check

Before changing titles, metadata, or CTA copy, answer the question that triggered this PRD:

> Where did the weekend lead actually come from?

Required lookup:

- Supabase `leads` row for the weekend submission.
- Landing page URL, if stored.
- Referrer URL, if stored.
- Source field.
- UTM/query params, if any.
- Whether the lead came through `QuoteWizard`, `LeadForm`, calculator, business page, city page, state page, or cost page.
- Whether Scout Report generated and email sent successfully.
- Whether the user replied after receiving the report.
- Whether OpenClaw/manual contractor outreach produced any contractor response.

If current lead storage does not include landing page/referrer/source CTA, add those fields before running the 30-day test.

### Phase 1: Manual concierge workflow

For every legitimate request during the 30-day test:

1. Review the submitted issue, ZIP, and urgency.
2. Confirm the automated Scout Report was sent.
3. Find 3 local contractor options manually or through OpenClaw.
4. If useful, email contractors or inspect their websites for service fit.
5. Send the user a concise follow-up:
   - likely cost range
   - what to ask contractors
   - 3 local options
   - warning signs / urgency note
6. Log time spent and whether the user responds.
7. Run at least one monetization conversation when there is a credible lead or contractor contact.

Do not overbuild. The point is to discover the repeated steps.

### Phase 2: Concierge lead log

Before automation, create a simple manual tracking surface for 30 days.

Minimum viable version can be a CSV/Google Sheet/Notion table. It does not need to be in-app yet.

Fields:

| Field | Description |
|---|---|
| Lead ID | Supabase lead ID |
| Date submitted | Timestamp |
| **Landing page URL** | **Full URL the user landed on (full path including query string). Required for tying outcome back to the SEO test variant.** |
| **Referrer URL** | **HTTP Referer at time of lead submit (Google search, direct, internal). Reveals whether traffic is organic, paid, or in-site.** |
| **CTA source** | **Which CTA fired the lead — `cost_page_estimate_click_hero` / `_cost_section` / quote wizard step-through / calculator → modal handoff.** |
| Source page | URL or state |
| Query/page type | Cost page, city page, business page, calculator, state page |
| ZIP/state | Location |
| Issue type | Cracks, settling, water, bowing, not sure |
| Urgency | Planning, weeks, ASAP, emergency |
| Report generated | Yes/no |
| Report emailed | Yes/no |
| User replied | Yes/no |
| Contractor research required | Yes/no |
| Contractors contacted | Count |
| Contractors responded | Count |
| Useful answer delivered | Yes/no |
| Time to fulfill | Minutes |
| Monetization path tested | Per-lead, subscription, affiliate, paid report, none |
| Payer conversation outcome | No contact, not interested, maybe, interested, paid |
| Outcome | No response, user replied, contractor connected, bad fit, spam |
| **Monetization signal** | **Free-text. Did this user or a contractor say anything that suggests willingness to pay? Capture verbatim quotes.** |

### Phase 3: Monetization validation

The 30-day concierge test should validate at least one payer hypothesis, not merely prove that homeowners want help.

Candidate monetization paths:

| Path | Who pays | What to test |
|---|---|---|
| Per-lead fee | Contractor | Would a contractor pay $30-$100 for a qualified homeowner request? |
| Verified listing subscription | Contractor | Would a contractor pay $50-$200/mo for preferred/verified placement? |
| Affiliate/referral | Marketplace or contractor network | Can FS route leads to an existing partner and get paid? |
| Paid Scout Report | Homeowner | Would a homeowner pay $20-$50 for a deeper report and contractor shortlist? |

30-day requirement:

> Complete at least 3 monetization conversations with potential payers: contractors, lead buyers, or homeowners.

This does not require closing revenue, but it does require learning who might pay and what language makes sense.

### Phase 4: SERP title/meta experiment — 4-hook directional test

Run a controlled title/meta experiment on high-opportunity, 0-click cost pages, testing **four distinct hook styles** simultaneously across four matched states with two pure controls.

#### Why four styles, not one

The May 3 GSC preview of the April 23 state-directory experiment showed a striking result: site-wide impressions doubled and average position improved by 7+ ranks, but per-impression CTR dropped 60%. Translation: Google now considers the content relevant enough to show, but the SERP snippet doesn't give users a reason to pick FoundationScout over Angi/HomeAdvisor. **The problem is not relevance — it's positioning at the snippet level.**

The first three hook styles all position FoundationScout as a directory (with various adjectives). At DR 0 fighting DR 90 incumbents in the directory category, that's a familiarity war we can't win. The fourth style — **helper-led** — escapes the directory category entirely by reframing the SERP promise as *information* rather than *connection*.

#### Test allocation

| State | Cost-page impressions (3-mo) | Avg position | Hook assignment | Why this pairing |
|---|---:|---:|---|---|
| California | 742 | 7.89 | **Helper-led** | Highest impression volume = fastest signal detection on the highest-information variant |
| Texas | 158 | ~varies | **Outcome-led** | Largest US foundation-repair market (clay soil) + highest commercial intent. Action language fits the buyer mindset there. |
| Oklahoma | 237 | 6.84 | **Trust-led** | Clay-heavy region with strong contractor-skeptical sentiment. "No paid placement" hook may resonate. |
| Arizona | 207 | 6.16 | **Benefit-led** | Moderate volume, neutral positioning, anchors the comparison set as the "control-ish" baseline against the more ambitious variants. |
| Florida | 309 | 7.48 | **Pure control (no change)** | Untouched. Compares against natural ranking drift over the test window. |
| New York | (no data shown) | — | **Pure control (no change)** | Different climate/geology than the active set. Tests whether any title variant generalizes. |
| Michigan, Tennessee, Ohio, Georgia | — | — | **Excluded** | Already in the April 23 state-directory experiment. Revisit after May 7 results to avoid confounding state-page and cost-page signals. |

#### The four hook styles in detail

**Hook 1 — Benefit-led (Arizona)**
*Promise: a transactional benefit. Compete on action.*

```text
Arizona Foundation Repair Cost: Estimate Before You Call
```

```text
See typical Arizona foundation repair costs, then get a free Scout Report with a cost sanity check and local contractor options for your ZIP.
```

**Hook 2 — Outcome-led (Texas)**
*Promise: a specific deliverable. Compete on completeness.*

```text
Texas Foundation Repair Cost + 3 Local Contractor Options
```

```text
2026 Texas foundation repair pricing by city + 3 verified local contractor options matched to your ZIP. Free Scout Report, no sales calls.
```

**Hook 3 — Trust-led (Oklahoma)**
*Promise: editorial independence. Compete on credibility.*

```text
Oklahoma Foundation Repair Cost — Verified Contractors, No Paid Placement
```

```text
Oklahoma foundation repair costs from $X–$Y. License-verified, BBB-checked contractor options. No paid placement. Free Scout Report explains what's wrong and what fair prices look like.
```

**Hook 4 — Helper-led (California) ★ added 2026-05-03**
*Promise: a learning outcome. Compete on usefulness, not category.*

This hook deliberately moves the SERP promise from "directory" to "guide ABOUT the directory category." Three sub-variants worth A/B-testing within California if data warrants over the long term:

*4a — Decision-help (lowest commitment, fastest test):*

```text
California Foundation Cracks? Here's What It Actually Costs
```

```text
Before you call a contractor in California, see typical 2026 prices, what to ask, and how to spot upselling. Free Scout Report. No login.
```

*4b — Diagnostic-help (medium commitment):*

```text
California Foundation Repair: Get a Free Scout Report Before You Call
```

```text
We'll diagnose what you're seeing, give you a likely cost range for California, and tell you what to ask 3 local contractors. Free, takes 2 minutes.
```

*4c — Adversarial-help / "watchdog" (highest differentiation, edgiest):*

```text
Don't Pay for California Foundation Repair Until You Read This
```

```text
3 things contractors won't tell you about typical California costs, common upsells, and warranty fine print. Free Scout Report covers the rest.
```

For the May 7 → May 21 measurement window, **start with Hook 4b (Diagnostic-help) on California.** It's the most balanced of the three sub-variants — promises learning + service without overselling adversarial framing. If 4b underperforms vs. the other three hook styles by May 21, swap to 4a or 4c in a follow-up window.

#### Why "helper-led" is strategically distinct from the other three

| Hook style | Positions FS as | Competes with | Defensible at DR 0? |
|---|---|---|---|
| Benefit-led | Faster directory | Angi/HomeAdvisor on speed | ❌ Familiarity loss |
| Outcome-led | More-complete directory | Angi/HomeAdvisor on deliverable | ❌ Familiarity loss |
| Trust-led | Honest directory | Angi/HomeAdvisor on integrity | ⚠️ Partial — depends on whether users believe the claim |
| **Helper-led** | **Guide ABOUT the directory category** | **Bob Vila, Wirecutter, NerdWallet, Reddit** | ✅ **Yes — different category entirely. Angi can't credibly clone helper positioning because helper language exposes their paid-placement model.** |

Helper positioning also matches the rest of the FoundationScout product surface — Scout Report, methodology block, Quote Wizard's diagnostic flow are all already helper-shaped. Updating the SERP promise makes it match the actual post-click experience, which reduces bounce and improves dwell time (NavBoost-positive).

#### Risk inherent to helper positioning

**Helper hooks attract research-phase visitors who don't convert immediately.** A "Find a contractor in California" searcher is closer to ready-to-hire than a "What does foundation repair cost in California" searcher. If we optimize the SERP for the second group, raw lead-conversion-per-click likely drops in the short term — even though qualified-lead-per-click might rise (better fit for the concierge loop).

This is acceptable only if:
- The 30-day concierge experiment (Phase 1) is genuinely high-value and can serve research-phase users well
- We track lead quality (per the new `landing_page` / `cta_source` attribution columns shipped 2026-05-03) not just lead count
- We're patient enough to let the longer conversion cycle play out (research-phase users may convert weeks later)

If those conditions don't hold, helper-led performs worse than benefit-led on raw business metrics even if CTR goes up. **Track BOTH CTR (SERP success) and lead-to-revenue conversion rate (business success) per hook style.**

#### Default meta description pattern (used unless a hook-specific override exists above)

```text
See typical {state} foundation repair costs, then get a free Scout Report with a cost sanity check and local contractor options for your ZIP. License-verified, BBB-checked, no paid placement.
```

#### Implementation note

Metadata is generated in:

```text
src/app/cost/[state]/foundation-repair-cost/page.tsx
```

Add entries to a `stateMetaOverrides` map (or extend the existing one) for the four active variant states. Do not change all 50 states until there is a measurable per-hook winner. Do not change Florida or New York during the experiment — they are pure controls. Do not change the 4 already-shipped state-directory states (MI/TN/OH/GA) on the cost-page side until the April 23 experiment resolves on May 7.

### Phase 5: Above-the-fold copy refinement

Change hero copy from generic pricing-guide language to outcome-driven language.

Current hero copy:

```text
Complete pricing guide for foundation repair services in {stateName}. Compare costs, get estimates, and understand what affects pricing in your area.
```

Test hero copy:

```text
See what foundation repair usually costs in {stateName}, then get a free Scout Report with a cost sanity check and local contractor options for your ZIP.
```

Current primary CTA:

```text
Get Your Free {stateName} Estimate
```

Test CTA:

```text
Get My Free Scout Report
```

Alternative CTA:

```text
Get Cost Check + Local Options
```

Keep the calculator CTA, but make the distinction clearer:

- Scout Report = email / concierge / contractor options
- Calculator = self-serve estimate, no email required

### Phase 6: CTA event tracking

Existing `data-event-name` attributes exist for calculator clicks. Estimate buttons currently open the modal but do not appear to pass a CTA source/event name.

Add event tracking for:

- `cost_page_estimate_click_hero`
- `cost_page_estimate_click_cost_section`
- `cost_page_calculator_click_hero`
- `cost_page_calculator_click_inline`
- `cost_page_calculator_click_pre_faq`
- `quote_wizard_started`
- `quote_wizard_completed`
- `lead_submitted`
- `scout_report_generated`
- `scout_report_email_sent`
- `user_followup_sent`
- `contractor_contacted`
- `contractor_responded`
- `monetization_conversation_logged`

If using GA:

- Use existing `trackEvent` helper in `src/components/ConversionTracker.tsx`.

If using Plausible:

- Add Plausible custom events or `data-event-name` handling if supported in current script setup.

Implementation file likely touched:

```text
src/components/EstimateButton.tsx
src/components/QuoteWizard.tsx
src/app/api/leads/route.ts
src/app/api/scout-report/route.ts
```

---

## 9. Success Metrics

### 30-day success metrics

| Metric | Target |
|---|---:|
| Legitimate form/email submissions | 5+ |
| User replies after report/follow-up | 2+ |
| Manual fulfillment time | <30 min per legitimate lead by end of test |
| Contractor response rate | Any positive signal |
| Spam/garbage lead rate | <50% |
| **Monetization validation conversations** | **3+ conversations with potential payers (contractors or homeowners) explicitly testing one of: per-lead fee, contractor subscription, affiliate referral, paid Scout Report. Captured as verbatim quotes in the lead log.** |
| **Identified monetization path with a willing payer** | **At least 1 candidate path with a person or company who said "yes I would pay $X for this"** |

### SEO leading indicators

| Metric | Target |
|---|---:|
| CTR lift on test-state cost pages | +50% relative |
| At least one 0-click page-one state earns clicks | Yes |
| Cost-page clicks | 40+ over next 30 days |

Important caveat:

> A 50% relative CTR lift from the current overall baseline would still be commercially weak. SEO CTR lift is a supporting signal. Concierge response and monetization signals are the business signal.

### Per-hook SEO evaluation (Phase 4 specific)

The 4-hook directional test (Hook 1: Benefit-led on Arizona, Hook 2: Outcome-led on Texas, Hook 3: Trust-led on Oklahoma, Hook 4: Helper-led on California) requires per-state evaluation, not aggregate. After 14 days of post-ship data:

> **Important caveat on interpretation.** This is a *directional* test, not a statistically controlled A/B test. State-effect confounds (CA's SERP differs from TX's; impression volumes differ; SERP-feature crowding differs; competitors at each position differ) mean that a hook winning in one state isn't proof that hook would win in any state. Read results as "this hook style produced a strong signal in this state" rather than "this hook style is the winner."
>
> **Decision rule for declaring a winner:** confirm any apparent winner by extending it to a 2nd state in a follow-up 14-day window before scaling. If helper-led wins on California, ship helper-led to one more comparable state (e.g., Florida loses control status, gets helper) and verify the lift replicates. Only after 2-state confirmation should the winning hook roll out to additional states. This protects against the most likely failure mode: declaring a state-specific lift as a hook-specific lift.
>
> **At the impression volumes in play (~200-700 imp per state per 14-day window), only dramatic differences will be detectable.** A 0% → 0.3% CTR lift is 1-2 clicks of difference and is statistical noise. A 0% → 3%+ lift is real signal. Plan for "find the dramatic winner" not "rank all four hooks by performance."

| Per-state metric | Target | What it tells us |
|---|---:|---|
| **CTR per hook style** | Best hook reaches >1% CTR at avg pos ≤15 on non-branded queries | Which positioning category wins for FoundationScout |
| **CTR delta vs Florida/NY controls** | Active states ≥2x control states' CTR over the same window | Confirms the lift is real, not natural drift or seasonal noise |
| **Lead-quality per hook style** | Helper-led leads convert to monetization conversation at rate ≥ benefit-led leads | Tests whether helper attracts higher-intent users despite lower raw click rate |
| **Bounce / dwell time per hook style** (Plausible) | Helper-led visitors spend ≥45s on page; benefit-led ≥30s | NavBoost-positive signal — proves the SERP promise matches the post-click experience |

**Decision matrix at 14 days:**

| Result | Action |
|---|---|
| One hook clearly wins CTR (>2x the others) AND maintains lead quality | Roll that hook to 5 more states. Kill the other three variants on the test states. |
| Two hooks tie on CTR but differ on lead quality | Keep both, allocate per state market profile (high-intent states get one, research-heavy states get the other). |
| Helper-led wins CTR but produces no leads | Helper hooks are SERP-positive but funnel-negative. Switch to trust-led for production while exploring why. |
| All four lose to controls | The cost-page template itself is the bottleneck, not snippet copy. Pivot Phase 5 (hero refinement) to the highest-priority next move. |
| Helper-led wins both CTR AND lead quality | This is the strongest-possible outcome — the brand is positioned in a category Angi can't credibly compete in. Roll out aggressively to all 50 states once stable. |

### Business-readiness indicators

FoundationScout becomes a serious build candidate if:

- 5-10 legitimate homeowner requests arrive in 30 days,
- at least 2 users engage after delivery,
- repeated contractor-research steps are obvious,
- manual fulfillment can be reduced to a repeatable checklist,
- and at least one contractor shows interest in receiving referrals.
- or at least one homeowner expresses willingness to pay for a deeper Scout Report.

---

## 10. Proposed Implementation Plan

### Day 0: Lead-source forensic check

- Identify the exact source of the weekend lead.
- Determine whether it came from cost page, calculator, state page, city page, business page, or another route.
- Check whether Scout Report generated and email sent successfully.
- Check whether the user replied.
- Check whether OpenClaw/manual outreach contacted contractors successfully.
- Pull pre/post April 23 GSC data for MI/TN/OH/GA state pages and related cost pages.

### Day 1: Instrumentation and concierge log

- Add event tracking for EstimateButton open events.
- Add event tracking for quote wizard start/completion.
- Add source context to lead submissions if missing.
- Create manual concierge lead log.
- Add landing page URL and referrer URL capture where feasible.

### Day 2: Manual concierge operation begins

- Fulfill every legitimate lead within 24 hours.
- Use OpenClaw/manual research to source contractor options.
- Send follow-up value beyond the automated Scout Report.
- Log fulfillment time and user response.

### Day 3: Metadata experiment

- Add `stateMetaOverrides` for selected cost-page test states only.
- Change title/meta only for test states.
- Do not change all cost pages.

### Day 4: Hero CTA copy test

- Update hero copy and CTA labels on cost-page template.
- Keep existing page structure.
- Keep calculator CTA visible.

### Days 5-30: Concierge + monetization conversations

- Fulfill every legitimate lead within 24 hours.
- Log what happened.
- Do not automate beyond light OpenClaw-assisted research.
- Complete at least 3 monetization conversations.

### Day 30: Decision review

Choose one:

- **Green:** more legitimate leads and responses → build automation around repeated manual workflow.
- **Yellow:** impressions/clicks improve but few leads → continue CTA/snippet testing.
- **Red:** no leads, no CTR lift → leave pages stable, revisit after more authority/traffic.

---

## 11. Risks

### Risk: SERP CTR does not improve

If users still do not click page-one results, the issue may be structural: Local Pack, Angi, HomeAdvisor, and familiar contractor brands may dominate trust.

Mitigation:

- Test only 7 states first.
- Compare CTR against unchanged states.
- Do not roll out all-state metadata changes until test has signal.
- Treat CTR work as supporting infrastructure, not as the primary proof.

### Risk: More leads create manual burden

Manual concierge work can become a job.

Mitigation:

- Cap manual test at 30 days.
- Track fulfillment time.
- Only automate repeated steps.

### Risk: Lead quality is poor

Some users may be tire-kickers, outside coverage, or not ready to hire.

Mitigation:

- Track urgency and issue type.
- Add qualifying copy: “Best for homeowners seeing cracks, settling, bowing walls, or basement water.”

### Risk: Contractor monetization is harder than homeowner capture

Homeowners may request help, but contractors may not pay yet.

Mitigation:

- Start with manual contractor outreach.
- Validate contractor willingness before building marketplace/CRM features.
- Run at least 3 monetization conversations during the 30-day test.

---

## 12. Open Questions

### Blocking (must answer before kickoff)

**Q1. Which exact lead came in over the weekend: cost page, calculator, state page, business page, or another route?**
This is the single most important data point in the document. The PRD is being written *because* a real lead arrived; without knowing the source URL/page, the entire SEO-promise hypothesis cannot be tested against this lead's behavior, and we can't replicate the conversion path. **5-minute Supabase lookup. Do not start Phases 1-3 until answered.**

**Q5. Does the lead table store enough source attribution to identify the page/CTA?**
If no, that schema change is Day 1 work — Phases 1-3 are unevaluable without it. The Phase 4 lead log additions (`landing_page`, `referrer`, `cta_source`) depend on this answer.

### Non-blocking (answer during 30-day window)

2. Did the user reply after receiving the report, or only submit once?
3. Did OpenClaw contact contractors successfully?
4. Are Scout Report emails landing reliably in inboxes? *(Note: 4 email-formatting bugs were fixed in commit `ffa50e1` on 2026-04-27. Any pre-fix emails landed in inboxes but rendered with shredded cost values, missing leading characters, lowercase state names, and no comparison grid. Resend or follow up with users who received pre-fix emails.)*
6. Is Plausible custom-event tracking already active, or should GA events be the primary measurement layer?
7. Did the April 23 `d8b4ebb` state-page metadata overrides improve CTR for MI/TN/OH/GA?
8. Which monetization path is easiest to test first: contractor per-lead, contractor subscription, affiliate/referral, or paid homeowner Scout Report?

---

## 13. Acceptance Criteria

This PRD is complete when:

- Weekend lead source is identified.
- Pre/post April 23 metadata impact is checked for affected states.
- Manual concierge lead log exists with landing page and referrer fields.
- Estimate CTA clicks and quote wizard completions are tracked.
- Lead submissions include source page/source CTA where feasible.
- Cost-page hero promise is updated without redesigning the page.
- Test-state metadata overrides are live for the selected states.
- At least one monetization path is selected for 3 conversations during the 30-day test.
- 30-day review date is set.

---

## 14. Key Principle

Do not confuse “we need a new product” with “we need to make the existing product promise sharper.”

FoundationScout already has the right skeleton. The next move is to make the promise clearer, measure the funnel, and manually run the service until the automation path reveals itself.

---

## 15. Sequencing & Schedule Integration

This PRD doesn't run in isolation — three measurement windows are already on the calendar from prior shipped work. The order of operations matters.

### Active commitments already on the calendar

| Date | Event | Source |
|---|---|---|
| **2026-04-23 (already shipped)** | Phase 1 state-directory meta overrides for 9 states (PA/NC/IL/MI/OH/TN/GA/MO/VA), commit `d8b4ebb`. Affects state-directory pages (e.g. `/michigan`), **not** cost pages | First Phase 1 plan |
| **2026-04-25 (already shipped)** | Calculator linking from cost pages, commit `1fd429f` → `ffa50e1` | Calculator-link PRD |
| **2026-04-27 (already shipped)** | Scout Report email bug fixes (4 bugs + 9-feature comparison grid), commit `ffa50e1` | This-session bug report |
| **2026-05-07** | First measurement window for the April 23 state-directory experiment opens (~14 days post-ship) | Existing scheduled task `check-seo-rankings` |
| **2026-05-09 to 2026-05-10** | First measurement window for calculator linking opens (~14 days post-ship) | Calculator-link PRD success criteria |
| **2026-07-25** | 90-day full review for calculator linking | Calculator-link PRD |

### How this PRD's phases sequence against those commitments

```
2026-05-03 (today) — KICKOFF
│
├─ Phase 0 forensic check: Q1 + Q5 answered.  Blocking, ~30 min.
│   Where did the weekend lead come from?  Does the lead table
│   capture enough source attribution?
│
├─ Phase 2 lead log set up (Sheet/Notion).  No SEO risk.
├─ Phase 6 event-tracking instrumentation.  Ship as separate atomic
│   commit. No SEO risk (client-side analytics only).
├─ Phase 1 manual concierge fulfillment begins.  Operational, not code.
└─ Lead-table schema additions if Phase 0 reveals attribution gaps.

✗ DO NOT ship Phase 4 cost-page meta overrides today.
   The April 23 state-directory experiment is mid-window.
   Adding a second SEO change before May 7 violates retrospective
   rule #6 (don't stack SEO changes during settlement).

✗ DO NOT ship Phase 5 hero CTA copy today either, unless it's a
   pure cosmetic refinement that doesn't change click-target wording.
   The hero already has a calculator-linking change from April 25
   that's still in its own measurement window (May 9-10).

═══════════════════════════════════════════════════════════════════════
2026-05-07 — DECISION POINT #1: April 23 state-directory results
                                  (also answers Open Question Q7)
═══════════════════════════════════════════════════════════════════════

Pull GSC CTR for the 9 states (PA/NC/IL/MI/OH/TN/GA/MO/VA) since Apr 23.

  GREEN (any state hits CTR >1% at avg pos ≤15):
    ✓ Soil/cost-range hooks proven on state-directory pages
    → Skip Phase 4 OR restrict to fresh states only (CA/OK/AZ + FL/NY
      controls). Don't touch MI/TN/OH/GA cost pages until we've
      measured whether the proven state-page lift bleeds into cost
      pages too.
    → Expand the proven pattern to 5 more state-directory pages in a
      separate atomic commit (rule #6: one experiment at a time)
    → Phase 1 concierge work continues as primary

  YELLOW (some movement but inconclusive):
    → Wait another 7-14 days, re-evaluate
    → Begin Phase 4 of THIS PRD on CA/TX/OK/AZ as the alternate hypothesis
      with the 4-hook directional test (Helper/Outcome/Trust/Benefit-led —
      different category entirely from the soil-led April 23 hooks)
    → Phase 1 concierge continues

  RED (still 0% CTR after 14 days on the state-directory pages):
    → April 23 soil-led hooks failed
    → Phase 4 of this PRD becomes the primary alternate hypothesis
    → Ship the 4-hook directional test on CA/TX/OK/AZ:
       • CA → Hook 4 (Helper-led, "Here's What It Actually Costs")
       • TX → Hook 2 (Outcome-led, "+ 3 Local Contractor Options")
       • OK → Hook 3 (Trust-led, "Verified Contractors, No Paid Placement")
       • AZ → Hook 1 (Benefit-led, "Estimate Before You Call")
       Keep FL/NY as untouched controls.
    → Phase 5 hero CTA copy can ship in the same deploy window
      (helper-led hero copy paired with helper-led SERP snippet on CA)
    → Phase 1 concierge continues; SEO is now clearly secondary

  In all paths, the May 3 GSC preview (site-wide impressions +113%, avg
  position improved 7+ ranks, but CTR -60% relative) is the supporting
  evidence: the relevance work is succeeding, but the SERP-level
  positioning ISN'T. Helper-led on California is the single biggest bet
  in the 4-hook test because it's the only hook that escapes the
  directory category Angi/HomeAdvisor dominate.

═══════════════════════════════════════════════════════════════════════
2026-05-09 to 2026-05-10 — DECISION POINT #2: Calculator linking results
═══════════════════════════════════════════════════════════════════════

  • Calculator's first organic keyword should appear (was 0 keywords).
  • Cost-page positions should hold (no regression from second hero CTA).

If calculator earned its first keyword: authority transfer working,
  boosts the case for expanding internal linking patterns. Doesn't
  change this PRD's plan, but informs the May 7 decision retrospectively.

If cost-page positions dropped: the second hero CTA may have hurt
  click-through to cost-page content. Investigate before any further
  hero CTA changes (Phase 5 of this PRD).

═══════════════════════════════════════════════════════════════════════
2026-06-02 — INTERIM CHECK: 30 days into concierge (Phase 1)
═══════════════════════════════════════════════════════════════════════

Per Section 9 success metrics + Phase 3 monetization criterion:

  GREEN (5-10 leads, 2+ replies, ≥1 monetization candidate, repeated steps):
    → Build automation around concierge workflow
    → SEO copy work continues as supporting infrastructure
    → Begin contractor-facing product validation

  YELLOW (impressions/clicks improve but lead volume low OR
          leads come in but no monetization signal):
    → Continue CTA/snippet testing
    → Continue manual fulfillment but reduce time investment
    → Try a different monetization angle (Phase 3 path #2 or #3)

  RED (no leads, no CTR lift, no monetization signal):
    → Park FoundationScout
    → Document learnings
    → Pivot energy elsewhere
```

### What can ship today vs. what waits

**Ship today, no SEO risk:**
- **Phase 0** forensic check (read-only Supabase lookup + GSC pull)
- **Phase 1** manual concierge fulfillment workflow (operational, not code)
- **Phase 2** concierge lead log (external — Sheet/Notion, not in-app)
- **Phase 6** event-tracking instrumentation (client-side analytics only)
- Lead-table schema additions for source attribution (`landing_page`, `referrer`, `cta_source`) — Day 1 prerequisite
- **Phase 3** monetization conversations (operational, off-codebase)

**Hold until 2026-05-07:**
- **Phase 4** cost-page meta overrides on any state
- **Phase 5** hero copy/CTA refinement *(could ship sooner if it's pure cosmetic, but if it materially changes click-target wording, rule #6 still applies — recommend waiting)*

**Hold until 2026-05-08 or later:**
- Phase 4 rollout to additional states beyond the active test set
- Any changes to the 9 already-shipped state-directory pages

### Net effect on velocity

This PRD adds ~30 days of concierge runway with only ~1 day of code work upfront (Phase 6 + lead-table schema additions). Phases 4-5 SEO changes are pushed 4-7 days, which is genuinely correct discipline rather than a velocity hit. **Net velocity loss: near zero.** The concierge experiment, which is the primary bet, runs in full parallel with the existing measurement windows. The only thing this scheduling discipline costs is the urge to ship Phase 4 cost-page overrides immediately — that urge is the exact failure mode rule #6 names.
