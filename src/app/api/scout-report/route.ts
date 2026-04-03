import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { getEnrichedContractors, type ContractorProfile } from '@/lib/contractor-scraper'

// ── Config ──────────────────────────────────────────────────────────────────
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ── Cost data by state (from our cost pages) ────────────────────────────────
const STATE_COST_DATA: Record<string, { avg: string; range: string; pier: string; crack: string; waterproof: string }> = {
  AL: { avg: '$4,500', range: '$2,000–$12,000', pier: '$1,200–$2,500/pier', crack: '$250–$800/crack', waterproof: '$3,000–$10,000' },
  AK: { avg: '$6,000', range: '$3,000–$15,000', pier: '$1,500–$3,000/pier', crack: '$300–$1,000/crack', waterproof: '$4,000–$12,000' },
  AZ: { avg: '$4,800', range: '$2,500–$13,000', pier: '$1,200–$2,800/pier', crack: '$250–$900/crack', waterproof: '$3,500–$11,000' },
  AR: { avg: '$4,200', range: '$2,000–$11,000', pier: '$1,100–$2,400/pier', crack: '$200–$750/crack', waterproof: '$3,000–$9,000' },
  CA: { avg: '$6,500', range: '$3,000–$18,000', pier: '$1,500–$3,500/pier', crack: '$300–$1,200/crack', waterproof: '$4,000–$15,000' },
  CO: { avg: '$5,200', range: '$2,500–$14,000', pier: '$1,300–$3,000/pier', crack: '$250–$900/crack', waterproof: '$3,500–$12,000' },
  CT: { avg: '$5,500', range: '$2,800–$14,000', pier: '$1,400–$3,000/pier', crack: '$300–$1,000/crack', waterproof: '$4,000–$12,000' },
  DE: { avg: '$5,000', range: '$2,500–$13,000', pier: '$1,300–$2,800/pier', crack: '$250–$900/crack', waterproof: '$3,500–$11,000' },
  FL: { avg: '$5,000', range: '$2,500–$15,000', pier: '$1,200–$3,000/pier', crack: '$250–$1,000/crack', waterproof: '$3,500–$12,000' },
  GA: { avg: '$4,500', range: '$2,000–$12,000', pier: '$1,200–$2,500/pier', crack: '$250–$800/crack', waterproof: '$3,000–$10,000' },
  HI: { avg: '$7,000', range: '$3,500–$18,000', pier: '$1,800–$3,500/pier', crack: '$400–$1,200/crack', waterproof: '$5,000–$15,000' },
  ID: { avg: '$4,800', range: '$2,500–$12,000', pier: '$1,200–$2,800/pier', crack: '$250–$900/crack', waterproof: '$3,500–$10,000' },
  IL: { avg: '$5,000', range: '$2,500–$14,000', pier: '$1,200–$2,800/pier', crack: '$250–$900/crack', waterproof: '$3,500–$12,000' },
  IN: { avg: '$4,500', range: '$2,000–$12,000', pier: '$1,100–$2,500/pier', crack: '$200–$800/crack', waterproof: '$3,000–$10,000' },
  IA: { avg: '$4,500', range: '$2,000–$12,000', pier: '$1,100–$2,500/pier', crack: '$200–$800/crack', waterproof: '$3,000–$10,000' },
  KS: { avg: '$4,500', range: '$2,000–$12,000', pier: '$1,100–$2,500/pier', crack: '$200–$800/crack', waterproof: '$3,000–$10,000' },
  KY: { avg: '$4,500', range: '$2,000–$12,000', pier: '$1,100–$2,500/pier', crack: '$200–$800/crack', waterproof: '$3,000–$10,000' },
  LA: { avg: '$4,800', range: '$2,500–$13,000', pier: '$1,200–$2,800/pier', crack: '$250–$900/crack', waterproof: '$3,500–$11,000' },
  ME: { avg: '$5,500', range: '$2,800–$14,000', pier: '$1,400–$3,000/pier', crack: '$300–$1,000/crack', waterproof: '$4,000–$12,000' },
  MD: { avg: '$5,200', range: '$2,500–$14,000', pier: '$1,300–$3,000/pier', crack: '$250–$900/crack', waterproof: '$3,500–$12,000' },
  MA: { avg: '$5,800', range: '$3,000–$15,000', pier: '$1,400–$3,200/pier', crack: '$300–$1,100/crack', waterproof: '$4,000–$13,000' },
  MI: { avg: '$5,000', range: '$2,500–$13,000', pier: '$1,200–$2,800/pier', crack: '$250–$900/crack', waterproof: '$3,500–$11,000' },
  MN: { avg: '$5,200', range: '$2,500–$14,000', pier: '$1,300–$3,000/pier', crack: '$250–$900/crack', waterproof: '$3,500–$12,000' },
  MS: { avg: '$4,200', range: '$2,000–$11,000', pier: '$1,100–$2,400/pier', crack: '$200–$750/crack', waterproof: '$3,000–$9,000' },
  MO: { avg: '$4,800', range: '$2,500–$13,000', pier: '$1,200–$2,800/pier', crack: '$250–$900/crack', waterproof: '$3,500–$11,000' },
  MT: { avg: '$5,000', range: '$2,500–$13,000', pier: '$1,300–$2,800/pier', crack: '$250–$900/crack', waterproof: '$3,500–$11,000' },
  NE: { avg: '$4,500', range: '$2,000–$12,000', pier: '$1,100–$2,500/pier', crack: '$200–$800/crack', waterproof: '$3,000–$10,000' },
  NV: { avg: '$5,000', range: '$2,500–$14,000', pier: '$1,200–$3,000/pier', crack: '$250–$900/crack', waterproof: '$3,500–$12,000' },
  NH: { avg: '$5,500', range: '$2,800–$14,000', pier: '$1,400–$3,000/pier', crack: '$300–$1,000/crack', waterproof: '$4,000–$12,000' },
  NJ: { avg: '$5,500', range: '$2,800–$15,000', pier: '$1,400–$3,200/pier', crack: '$300–$1,000/crack', waterproof: '$4,000–$13,000' },
  NM: { avg: '$4,800', range: '$2,500–$12,000', pier: '$1,200–$2,800/pier', crack: '$250–$900/crack', waterproof: '$3,500–$10,000' },
  NY: { avg: '$6,000', range: '$3,000–$16,000', pier: '$1,500–$3,500/pier', crack: '$300–$1,200/crack', waterproof: '$4,000–$14,000' },
  NC: { avg: '$4,800', range: '$2,500–$13,000', pier: '$1,200–$2,800/pier', crack: '$250–$900/crack', waterproof: '$3,500–$11,000' },
  ND: { avg: '$5,000', range: '$2,500–$13,000', pier: '$1,200–$2,800/pier', crack: '$250–$900/crack', waterproof: '$3,500–$11,000' },
  OH: { avg: '$4,800', range: '$2,500–$13,000', pier: '$1,200–$2,800/pier', crack: '$250–$900/crack', waterproof: '$3,500–$11,000' },
  OK: { avg: '$4,500', range: '$2,000–$12,000', pier: '$1,100–$2,500/pier', crack: '$200–$800/crack', waterproof: '$3,000–$10,000' },
  OR: { avg: '$5,200', range: '$2,500–$14,000', pier: '$1,300–$3,000/pier', crack: '$250–$900/crack', waterproof: '$3,500–$12,000' },
  PA: { avg: '$5,200', range: '$2,500–$14,000', pier: '$1,300–$3,000/pier', crack: '$250–$900/crack', waterproof: '$3,500–$12,000' },
  RI: { avg: '$5,500', range: '$2,800–$14,000', pier: '$1,400–$3,000/pier', crack: '$300–$1,000/crack', waterproof: '$4,000–$12,000' },
  SC: { avg: '$4,500', range: '$2,000–$12,000', pier: '$1,200–$2,500/pier', crack: '$250–$800/crack', waterproof: '$3,000–$10,000' },
  SD: { avg: '$4,800', range: '$2,500–$12,000', pier: '$1,200–$2,800/pier', crack: '$250–$900/crack', waterproof: '$3,500–$10,000' },
  TN: { avg: '$4,500', range: '$2,000–$12,000', pier: '$1,200–$2,500/pier', crack: '$250–$800/crack', waterproof: '$3,000–$10,000' },
  TX: { avg: '$4,800', range: '$2,500–$14,000', pier: '$1,200–$2,800/pier', crack: '$250–$900/crack', waterproof: '$3,500–$12,000' },
  UT: { avg: '$5,000', range: '$2,500–$13,000', pier: '$1,200–$2,800/pier', crack: '$250–$900/crack', waterproof: '$3,500–$11,000' },
  VT: { avg: '$5,500', range: '$2,800–$14,000', pier: '$1,400–$3,000/pier', crack: '$300–$1,000/crack', waterproof: '$4,000–$12,000' },
  VA: { avg: '$5,000', range: '$2,500–$14,000', pier: '$1,200–$3,000/pier', crack: '$250–$900/crack', waterproof: '$3,500–$12,000' },
  WA: { avg: '$5,500', range: '$2,800–$15,000', pier: '$1,400–$3,200/pier', crack: '$300–$1,000/crack', waterproof: '$4,000–$13,000' },
  WV: { avg: '$4,500', range: '$2,000–$12,000', pier: '$1,100–$2,500/pier', crack: '$200–$800/crack', waterproof: '$3,000–$10,000' },
  WI: { avg: '$5,000', range: '$2,500–$13,000', pier: '$1,200–$2,800/pier', crack: '$250–$900/crack', waterproof: '$3,500–$11,000' },
  WY: { avg: '$5,000', range: '$2,500–$13,000', pier: '$1,300–$2,800/pier', crack: '$250–$900/crack', waterproof: '$3,500–$11,000' },
}

// ── ZIP to state mapping (simplified — first 3 digits) ──────────────────────
function zipToState(zip: string): string | null {
  const prefix = parseInt(zip.substring(0, 3))
  // Simplified mapping — covers major ranges
  if (prefix >= 100 && prefix <= 149) return 'NY'
  if (prefix >= 150 && prefix <= 196) return 'PA'
  if (prefix >= 197 && prefix <= 199) return 'DE'
  if (prefix >= 200 && prefix <= 205) return 'DC'
  if (prefix >= 206 && prefix <= 246) return 'VA'
  if (prefix >= 247 && prefix <= 268) return 'WV'
  if (prefix >= 270 && prefix <= 289) return 'NC'
  if (prefix >= 290 && prefix <= 299) return 'SC'
  if (prefix >= 300 && prefix <= 319) return 'GA'
  if (prefix >= 320 && prefix <= 349) return 'FL'
  if (prefix >= 350 && prefix <= 369) return 'AL'
  if (prefix >= 370 && prefix <= 385) return 'TN'
  if (prefix >= 386 && prefix <= 397) return 'MS'
  if (prefix >= 400 && prefix <= 427) return 'KY'
  if (prefix >= 430 && prefix <= 458) return 'OH'
  if (prefix >= 460 && prefix <= 479) return 'IN'
  if (prefix >= 480 && prefix <= 499) return 'MI'
  if (prefix >= 500 && prefix <= 528) return 'IA'
  if (prefix >= 530 && prefix <= 549) return 'WI'
  if (prefix >= 550 && prefix <= 567) return 'MN'
  if (prefix >= 570 && prefix <= 577) return 'SD'
  if (prefix >= 580 && prefix <= 588) return 'ND'
  if (prefix >= 590 && prefix <= 599) return 'MT'
  if (prefix >= 600 && prefix <= 629) return 'IL'
  if (prefix >= 630 && prefix <= 658) return 'MO'
  if (prefix >= 660 && prefix <= 679) return 'KS'
  if (prefix >= 680 && prefix <= 693) return 'NE'
  if (prefix >= 700 && prefix <= 714) return 'LA'
  if (prefix >= 716 && prefix <= 729) return 'AR'
  if (prefix >= 730 && prefix <= 749) return 'OK'
  if (prefix >= 750 && prefix <= 799) return 'TX'
  if (prefix >= 800 && prefix <= 816) return 'CO'
  if (prefix >= 820 && prefix <= 831) return 'WY'
  if (prefix >= 832 && prefix <= 838) return 'ID'
  if (prefix >= 840 && prefix <= 847) return 'UT'
  if (prefix >= 850 && prefix <= 865) return 'AZ'
  if (prefix >= 870 && prefix <= 884) return 'NM'
  if (prefix >= 889 && prefix <= 898) return 'NV'
  if (prefix >= 900 && prefix <= 961) return 'CA'
  if (prefix >= 967 && prefix <= 968) return 'HI'
  if (prefix >= 970 && prefix <= 979) return 'OR'
  if (prefix >= 980 && prefix <= 994) return 'WA'
  if (prefix >= 995 && prefix <= 999) return 'AK'
  if (prefix >= 10 && prefix <= 69) return 'NY' // NYC/NJ area
  if (prefix >= 70 && prefix <= 89) return 'NJ'
  if (prefix >= 1 && prefix <= 9) return 'MA'
  return null
}

// ── Issue labels ────────────────────────────────────────────────────────────
const ISSUE_DETAILS: Record<string, { name: string; description: string }> = {
  'Foundation Cracks': { name: 'Foundation Cracks', description: 'Visible cracks in walls, floors, or the foundation itself. These can range from hairline cosmetic cracks to structural concerns.' },
  'Settling / Sinking': { name: 'Settling/Sinking Foundation', description: 'Uneven or sloping floors, doors and windows that stick, or visible gaps between walls and ceilings.' },
  'Bowing Walls': { name: 'Bowing/Leaning Walls', description: 'Basement or retaining walls that are leaning, bowing inward, or showing horizontal cracks from lateral earth pressure.' },
  'Water / Moisture': { name: 'Water & Moisture Issues', description: 'Basement leaks, standing water, efflorescence (white mineral deposits), or persistent dampness and humidity.' },
  'Crawl Space': { name: 'Crawl Space Problems', description: 'Sagging floors above the crawl space, musty odors, moisture/mold underneath the home, or deteriorating supports.' },
  'Other / Not Sure': { name: 'Foundation Concerns', description: 'Various foundation concerns that may need professional evaluation to properly diagnose.' },
}

// ── Urgency context ─────────────────────────────────────────────────────────
const URGENCY_CONTEXT: Record<string, string> = {
  'Planning Ahead': 'The homeowner is researching options proactively — no immediate emergency. This is a good time to get multiple opinions and compare contractors.',
  'Within a Few Weeks': 'The homeowner has noticed issues and wants to address them soon. Timely action can prevent problems from worsening.',
  'ASAP': 'The problems are getting worse and need prompt attention. Delays could increase repair costs significantly.',
  'Emergency': 'This is an urgent situation with active damage or safety concerns. Immediate professional assessment is critical.',
}

// ── Generate the Scout Report via Claude ────────────────────────────────────
async function generateScoutReport(data: {
  name: string
  issues: string
  urgency: string
  zip: string
  state: string
  contractors: ContractorProfile[]
  costData: typeof STATE_COST_DATA['IL']
}) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const issueList = data.issues.split(', ')
  const issueDetails = issueList.map(i => ISSUE_DETAILS[i] || { name: i, description: '' })
  const urgencyContext = URGENCY_CONTEXT[data.urgency] || ''

  // Build rich contractor profiles from scraped data
  const contractorList = data.contractors.map((c, i) => {
    const lines = [`${i + 1}. **${c.name}**`]
    if (c.rating) lines.push(`   Rating: ${c.rating}⭐ (${c.review_count || 0} reviews)`)
    if (c.phone) lines.push(`   Phone: ${c.phone}`)
    if (c.website_url) lines.push(`   Website: ${c.website_url}`)
    if (c.services.length > 0) lines.push(`   Services: ${c.services.slice(0, 6).join(', ')}`)
    if (c.specialties.length > 0) lines.push(`   Specialties: ${c.specialties.join(', ')}`)
    if (c.pricing_info) lines.push(`   Pricing: ${c.pricing_info}`)
    if (c.warranty_info) lines.push(`   Warranty: ${c.warranty_info}`)
    if (c.free_inspection) lines.push(`   ✅ Offers free inspections/estimates`)
    if (c.years_in_business) lines.push(`   Experience: ${c.years_in_business}`)
    if (c.certifications.length > 0) lines.push(`   Credentials: ${c.certifications.join(', ')}`)
    if (c.service_area) lines.push(`   Service Area: ${c.service_area}`)
    if (c.about_summary) lines.push(`   About: ${c.about_summary.substring(0, 200)}`)
    return lines.join('\n')
  }).join('\n\n')

  const prompt = `You are a foundation repair expert writing a personalized Scout Report for a homeowner. Be helpful, specific, and actionable. Use a warm but professional tone. Do NOT use markdown headers — use plain text with bold labels. Keep it concise but thorough.

HOMEOWNER: ${data.name}
LOCATION: ZIP ${data.zip} (${data.state})
ISSUES REPORTED: ${issueDetails.map(i => `${i.name} — ${i.description}`).join('; ')}
URGENCY: ${data.urgency} — ${urgencyContext}

LOCAL COST DATA:
- Average repair cost in ${data.state}: ${data.costData.avg}
- Typical range: ${data.costData.range}
- Pier installation: ${data.costData.pier}
- Crack repair: ${data.costData.crack}
- Waterproofing: ${data.costData.waterproof}

LOCAL CONTRACTORS (researched from their actual websites):
${contractorList || 'No contractors found in immediate area — we recommend searching nearby cities.'}

Write a personalized Scout Report with these sections:

1. GREETING — Address them by first name, acknowledge their specific issues warmly.

2. YOUR SITUATION — Explain what their reported issues likely mean in plain language. Be honest about severity based on urgency level. Include what could happen if left unaddressed.

3. ESTIMATED COSTS — Give realistic cost ranges for THEIR specific issues using the local data. Explain what factors affect the price (home size, soil type, repair method, accessibility).

4. YOUR LOCAL CONTRACTORS — This is the most valuable section. For each contractor, write a 2-3 sentence mini-profile based on REAL data from their website. Mention specific services they offer that match the homeowner's issues. Note if they offer free inspections, warranties, years of experience, or certifications. Include their phone number. Explain WHY each one might be a good fit for this specific homeowner's situation. If a contractor offers services that directly match the reported issues, call that out explicitly.

5. QUESTIONS TO ASK — Give 5 specific questions they should ask every contractor, tailored to their reported issues (not generic).

6. NEXT STEPS — Clear action items based on their urgency level. If any contractor offers free inspections, suggest starting there.

Keep the total report under 800 words. Be genuinely helpful — this person is worried about their home. The contractor section should feel like a knowledgeable friend did research for them, not like a generic directory listing.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  return response.choices[0]?.message?.content || 'Unable to generate report. Please contact us directly.'
}

// ── Format report as HTML email ─────────────────────────────────────────────
function formatReportEmail(reportText: string, data: { name: string; issues: string; zip: string; state: string }) {
  // Convert plain text to HTML paragraphs
  const htmlBody = reportText
    .split('\n\n')
    .map(para => {
      // Bold text marked with **
      const formatted = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Numbered lists
      if (/^\d+\./.test(formatted)) {
        return `<p style="margin: 0 0 8px 0; padding-left: 16px;">${formatted}</p>`
      }
      return `<p style="margin: 0 0 16px 0; line-height: 1.6; color: #334155;">${formatted}</p>`
    })
    .join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0f172a, #1e293b); border-radius: 12px 12px 0 0; padding: 32px; text-align: center;">
      <h1 style="margin: 0; color: #f59e0b; font-size: 28px; font-weight: 800;">🔍 Your Scout Report</h1>
      <p style="margin: 8px 0 0; color: #94a3b8; font-size: 14px;">Personalized Foundation Repair Analysis</p>
    </div>
    
    <!-- Body -->
    <div style="background: white; padding: 32px; border: 1px solid #e2e8f0; border-top: none;">
      ${htmlBody}
    </div>
    
    <!-- Footer -->
    <div style="background: #f1f5f9; border-radius: 0 0 12px 12px; padding: 24px; text-align: center; border: 1px solid #e2e8f0; border-top: none;">
      <p style="margin: 0 0 8px; color: #64748b; font-size: 13px;">
        This report was generated by <strong>FoundationScout</strong> based on your submitted information.
      </p>
      <p style="margin: 0 0 8px; color: #64748b; font-size: 13px;">
        Cost estimates are approximations and may vary based on your specific situation.
      </p>
      <a href="https://foundationscout.com" style="color: #f59e0b; text-decoration: none; font-weight: 600; font-size: 14px;">
        foundationscout.com
      </a>
    </div>
  </div>
</body>
</html>`
}

// ── Send email via Resend ───────────────────────────────────────────────────
async function sendReportEmail(to: string, subject: string, html: string) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.error('RESEND_API_KEY not configured')
    return false
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'FoundationScout <reports@foundationscout.com>',
        to: [to],
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('Resend error:', err)
      return false
    }
    return true
  } catch (err) {
    console.error('Email send failed:', err)
    return false
  }
}

// ── Send admin notifications ────────────────────────────────────────────────
async function notifyAdmin(lead: Record<string, string>, reportGenerated: boolean) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  
  const lines = [
    `📋 *New Scout Report Request*`,
    ``,
    `👤 *${lead.name}*`,
    lead.email ? `📧 ${lead.email}` : '',
    lead.zip_code ? `📍 ZIP: ${lead.zip_code}` : '',
    lead.issues ? `🔧 Issues: ${lead.issues}` : '',
    lead.urgency ? `⚡ Urgency: ${lead.urgency}` : '',
    ``,
    reportGenerated ? `✅ Scout Report generated & emailed` : `⚠️ Scout Report generation failed`,
    `🔗 Source: ${lead.source || 'website'}`,
  ].filter(Boolean).join('\n')

  // Telegram notification
  if (botToken && chatId) {
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: lines, parse_mode: 'Markdown' }),
      })
    } catch (err) {
      console.error('Telegram notification failed:', err)
    }
  }

  // Email notifications to admin
  const adminEmails = [process.env.ADMIN_EMAIL_1, process.env.ADMIN_EMAIL_2].filter(Boolean) as string[]
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey && adminEmails.length > 0) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'FoundationScout <reports@foundationscout.com>',
          to: adminEmails,
          subject: `🔍 New Scout Report: ${lead.name} (${lead.zip_code || 'unknown ZIP'})`,
          html: `<pre>${lines.replace(/\*/g, '')}</pre>`,
        }),
      })
    } catch (err) {
      console.error('Admin email notification failed:', err)
    }
  }
}

// ── Main endpoint ───────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lead_id, name, email, issues, urgency, zip_code, state } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Determine state from ZIP if not provided
    const resolvedState = state || zipToState(zip_code || '') || 'IL'
    const costData = STATE_COST_DATA[resolvedState] || STATE_COST_DATA['IL']

    // Fetch matching contractors from our database
    let rawContractors: any[] = []
    
    if (zip_code) {
      // Look up cities in the same state, prioritize by rating
      const { data: stateCities } = await supabase
        .from('cities')
        .select('id, name, states!inner(abbreviation)')
        .eq('states.abbreviation', resolvedState)
        .limit(20)

      if (stateCities && stateCities.length > 0) {
        const cityIds = stateCities.map((c: any) => c.id)
        const { data: bizData } = await supabase
          .from('businesses')
          .select('id, name, phone, website_url, rating, review_count, address, scraped_data, scraped_at')
          .in('city_id', cityIds)
          .eq('is_active', true)
          .order('rating', { ascending: false, nullsFirst: false })
          .limit(8) // Get 8 so we have options after filtering
        
        rawContractors = bizData || []
      }
    }

    // Enrich contractors with scraped website data
    const enrichedContractors = await getEnrichedContractors(rawContractors)

    // Generate the AI Scout Report
    let reportText = ''
    let reportGenerated = false
    
    try {
      reportText = await generateScoutReport({
        name,
        issues: issues || 'General foundation concerns',
        urgency: urgency || 'Planning Ahead',
        zip: zip_code || 'unknown',
        state: resolvedState,
        contractors: enrichedContractors,
        costData,
      })
      reportGenerated = true
    } catch (err) {
      console.error('Report generation failed:', err)
      reportText = `Hi ${name},\n\nThank you for requesting a Scout Report. We're experiencing a brief delay in generating your personalized analysis, but we wanted to confirm we received your information.\n\nBased on your location (${resolvedState}), the average foundation repair cost ranges from ${costData.range}.\n\nA member of our team will follow up with your full report shortly.\n\nBest,\nFoundationScout`
    }

    // Send the report to the user via email
    const emailHtml = formatReportEmail(reportText, { name, issues, zip: zip_code, state: resolvedState })
    const emailSent = await sendReportEmail(
      email,
      `🔍 Your Foundation Repair Scout Report — ${resolvedState}`,
      emailHtml
    )

    // Save the report to the database
    if (lead_id) {
      await supabase.from('leads').update({
        report_generated_at: new Date().toISOString(),
        notification_status: reportGenerated ? 'report_sent' : 'report_failed',
      }).eq('id', lead_id)
    }

    // Store the report
    if (lead_id && reportGenerated) {
      await supabase.from('scout_reports').insert({
        lead_id,
        content: {
          text: reportText,
          contractors: enrichedContractors.map(c => ({
            name: c.name,
            phone: c.phone,
            website: c.website_url,
            services: c.services,
            free_inspection: c.free_inspection,
            warranty: c.warranty_info,
            scraped: c.scraped,
          })),
          state: resolvedState,
          zip: zip_code,
        },
        email_sent_at: emailSent ? new Date().toISOString() : null,
      }).select()
    }

    // Notify admin
    await notifyAdmin({
      name, email, zip_code: zip_code || '',
      issues: issues || '', urgency: urgency || '',
      source: 'scout-report',
    }, reportGenerated)

    return NextResponse.json({
      success: true,
      report_generated: reportGenerated,
      email_sent: emailSent,
    })
  } catch (error) {
    console.error('Scout report error:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
