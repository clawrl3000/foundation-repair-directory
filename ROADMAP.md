# FoundationScout Product Roadmap

> Last updated: 2026-04-03
> Owner: Shaquille Oatmeal / Clawrl

---

## Phase 1: AI Research Report Flow (BUILD NOW)
**Goal:** Homeowner gets real value, we capture qualified leads, Shaquille Oatmeal gets notified.

### Flow:
1. Homeowner fills out existing quote form (name, email, zip, problem type)
2. AI generates personalized repair report:
   - Problem analysis based on their description
   - Cost estimate range (using our state-level cost data)
   - Top 3-5 matched contractors from OUR database (name, rating, phone, website)
   - Smart questions to ask each contractor
   - Timeline expectations for their repair type
3. Report emailed to homeowner within minutes
4. Lead saved to Supabase `leads` table
5. Notifications sent to Shaquille Oatmeal:
   - Telegram DM (primary)
   - Email to Proton Mail + Gmail (backup/redundancy)
6. Lead status tracked: new → notified → contacted → closed

### Copy fixes (same deploy):
- Replace all "free quote" / "free estimate" language
- Safe alternatives: "Get Your Repair Estimate", "Get Matched with Local Pros", "Compare Estimates"
- No promising free anything on behalf of contractors
- SEO-neutral — ranking keywords are location + service, not CTAs

### Tech:
- Claude Haiku API call (~$0.01/lead)
- Existing form component → enhanced API route
- Resend or SMTP for email delivery
- Telegram bot for instant notification
- Cost per lead: essentially zero

### Success metrics:
- Form submissions > 0
- Email delivery rate > 95%
- Telegram notification reliability 100%

---

## Phase 2: Contractor Bid/Ask Marketplace (BUILD WHEN 10+ LEADS/WEEK)
**Goal:** Connect homeowners with contractors who actively want the job. No spam calls.

### Flow:
1. (Phase 1 complete — homeowner submitted form, got AI report)
2. We email matched contractors: "A homeowner in your area needs [service]. Estimated job: $X-$Y. Want to bid?"
3. Contractor clicks link → submits their bid (price, timeline, notes)
4. We collect bids over 24-48 hours
5. Homeowner gets email: "3 contractors submitted estimates for your project"
6. Homeowner reviews bids, picks their preferred contractor
7. We facilitated the match — everyone wins

### Key difference from Angi/HomeAdvisor:
- Homeowner is in CONTROL (no spam calls from 8 contractors in 60 seconds)
- Contractors only bid on jobs they actually want
- Transparent pricing — homeowner sees all bids side by side
- Nobody gets harassed

### Prerequisites:
- Verified contractor email addresses (partial from Google Places, need enrichment)
- Sufficient lead volume to make bidding worthwhile
- Contractor onboarding flow (claim your listing, verify email)
- Bid submission form/page
- Bid collection + homeowner notification system

### Revenue models this unlocks:
- **Per-bid fee:** Contractor pays $5-25 to submit a bid (Angi charges $15-80)
- **Per-match fee:** Only charge when homeowner picks them ($50-200)
- **Subscription:** Monthly fee to be in the bid pool ($49-199/mo)
- **Featured placement:** Show up first in AI reports ($X/mo)
- **Verified badge:** Pay for enhanced listing with trust signals

### Tech:
- Contractor auth/claim flow
- Bid submission API + form
- Email orchestration (contractor outreach + homeowner bid summary)
- Payment integration (Stripe)
- Bid tracking dashboard

---

## Phase 3: Full Marketplace + Scale
**Goal:** Self-sustaining marketplace with recurring revenue.

- Contractor dashboard (manage bids, track wins, analytics)
- Homeowner accounts (save reports, track project status)
- Review system (verified reviews from matched projects)
- Multi-service expansion (beyond foundation repair)
- Mobile app or PWA
- Contractor CRM integration
- Automated follow-ups

---

## Current Priorities (April 2026)

| Priority | Task | Status |
|----------|------|--------|
| 1 | Bulk fill contractors (1000+ cities) | 🔄 In progress |
| 2 | Fix "free quote" copy sitewide | ⬜ Next |
| 3 | Dual notifications (Telegram + email) | ⬜ Next |
| 4 | AI research report flow (Phase 1) | ⬜ Next |
| 5 | Backlink campaign (biggest SEO blocker) | ⬜ Planned |
| 6 | Contractor bid/ask (Phase 2) | 📋 After 10+ leads/week |

---

## Infrastructure Already Done
- ✅ 600+ pages indexed by Google
- ✅ 18.3K impressions/month across 1,000 queries
- ✅ Cost pages ranking PAGE 1 (AR, HI, FL, IL, NH)
- ✅ Leads table + API route + form component
- ✅ Telegram bot token configured
- ✅ Supabase Management API access (direct SQL via HTTPS)
- ✅ Google Places API (server-side key, unrestricted)
- ✅ UNIQUE constraint on google_place_id (added 2026-04-03)
- ✅ 1,000+ contractors added via bulk fill (2026-04-03, in progress)
