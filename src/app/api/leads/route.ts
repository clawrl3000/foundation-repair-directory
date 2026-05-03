import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for inserts (anon key blocked by RLS)
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { business_id, name, email, service_needed, zip_code, city, state, notes, source } = body

    // Lead-source attribution — added 2026-05-03 (PRD-SERP-PROMISE-CONCIERGE-LOOP).
    // Frontend captures these from window.location.href / document.referrer / the
    // EstimateButton.eventName prop. Server falls back to the HTTP Referer header
    // for `referrer` if the client didn't send one (e.g. submissions from contexts
    // where document.referrer is empty due to noreferrer or app-shell handoff).
    // All three are nullable; never block submission on missing attribution.
    const landing_page: string | null = body.landing_page ?? null
    const referrer: string | null =
      body.referrer
      ?? request.headers.get('referer')
      ?? null
    const cta_source: string | null = body.cta_source ?? null

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Base lead row — always written
    const baseLead = {
      business_id: business_id || null,
      name,
      email,
      phone: body.phone || '',
      service_needed: service_needed || null,
      zip_code: zip_code || null,
      city: city || null,
      state: state || null,
      notes: notes || null,
      source: source || 'website',
      status: 'new',
    }

    // Save the lead. Try with attribution columns first; if Supabase rejects
    // because the migration (20260503_add_lead_attribution.sql) hasn't been
    // applied yet, fall back to the base row so submissions never 500 during
    // a deploy that races the schema change. Attribution is best-effort —
    // missing columns are logged but never block the lead.
    let { data, error } = await supabase
      .from('leads')
      .insert({ ...baseLead, landing_page, referrer, cta_source })
      .select()

    if (error && /column .* does not exist|landing_page|referrer|cta_source/i.test(error.message || '')) {
      console.warn('Lead attribution columns missing — falling back. Run supabase/migrations/20260503_add_lead_attribution.sql to enable. Original error:', error.message)
      const fallback = await supabase.from('leads').insert(baseLead).select()
      data = fallback.data
      error = fallback.error
    }

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
    }

    const leadId = data?.[0]?.id
    console.log('New lead saved:', leadId)

    // Parse the urgency from notes (format: "Issues: X | Urgency: Y | From: Z")
    const urgencyMatch = notes?.match(/Urgency:\s*([^|]+)/)
    const urgency = urgencyMatch?.[1]?.trim() || 'Planning Ahead'

    // Trigger Scout Report generation — MUST await or Vercel kills the function
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    
    let reportResult = { report_generated: false, email_sent: false }
    try {
      const reportRes = await fetch(`${baseUrl}/api/scout-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: leadId,
          name,
          email,
          issues: service_needed || 'General foundation concerns',
          urgency,
          zip_code: zip_code || null,
          state: state || null,
        }),
      })
      reportResult = await reportRes.json()
      console.log('Scout report result:', reportResult)
    } catch (err) {
      console.error('Scout report trigger failed:', err)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Your Scout Report is being generated! Check your email in a few minutes.',
      lead_id: leadId,
      report_generated: reportResult.report_generated,
      email_sent: reportResult.email_sent,
    })
  } catch (error) {
    console.error('Lead submission error:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
