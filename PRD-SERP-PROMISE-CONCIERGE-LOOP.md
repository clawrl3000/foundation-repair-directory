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

### Phase 4: SERP title/meta experiment

Run a controlled title/meta experiment on high-opportunity, 0-click cost pages.

> **Coordinate with the existing Phase 1 (April 23) meta overrides.** Commit `d8b4ebb` already shipped custom soil/cost-range hook titles for 9 *state directory* pages (PA, NC, IL, MI, OH, TN, GA, MO, VA). Their measurement window opens 2026-05-07. Do not retest adjacent MI/TN/OH/GA cost pages until the existing state-page test is checked — otherwise we risk confusing state-page and cost-page signals.
>
> **Test states for this PRD's cost-page experiment:**
> - **Active variants:** California, Oklahoma, Arizona (page-1, 0% CTR, no prior intervention)
> - **Pure controls (no change, baseline measurement):** Florida, New York
> - **Excluded:** Michigan, Tennessee, Ohio, Georgia — already in the April 23 state-page experiment; revisit only after May 7 results

Candidate title patterns to test (rotate across the 3 active variants — one per state):

**Benefit-led:**

```text
California Foundation Repair Cost: Estimate Before You Call
```

**Outcome-led:**

```text
Oklahoma Foundation Repair Cost + 3 Local Contractor Options
```

**Trust-led (added per review feedback — directly differentiates from Angi):**

```text
Arizona Foundation Repair Cost — Verified Contractors, No Paid Placement
```

```text
Arizona Foundation Repair Cost: $5K–$25K · BBB-Verified Local Contractors
```

Candidate meta description pattern:

```text
See typical {state} foundation repair costs, then get a free Scout Report with a cost sanity check and local contractor options for your ZIP. License-verified, BBB-checked, no paid placement.
```

Implementation note:

Current metadata is generated in:

```text
src/app/cost/[state]/foundation-repair-cost/page.tsx
```

Add a small `stateMetaOverrides` map for the test states. Do not change all 50 states until there is a measurable CTR result. Do not change the 4 already-shipped state-directory states until the April 23 experiment resolves on May 7.

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
    → Begin Phase 4 of THIS PRD on CA/OK/AZ as the alternate hypothesis
      (different hook style: benefit-led / trust-led, not soil-led)
    → Phase 1 concierge continues

  RED (still 0% CTR after 14 days on the state-directory pages):
    → April 23 hooks failed
    → Phase 4 of this PRD becomes the primary alternate hypothesis
    → Ship cost-page benefit-led / trust-led overrides for CA/OK/AZ
      (the 3 fresh states), keep FL/NY as untouched controls
    → Phase 5 hero CTA copy can ship in the same deploy window
    → Phase 1 concierge continues; SEO is now clearly secondary

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
