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

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Save the lead
    const { data, error } = await supabase.from('leads').insert({
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
    }).select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
    }

    const leadId = data?.[0]?.id
    console.log('New lead saved:', leadId)

    // Parse the urgency from notes (format: "Issues: X | Urgency: Y | From: Z")
    const urgencyMatch = notes?.match(/Urgency:\s*([^|]+)/)
    const urgency = urgencyMatch?.[1]?.trim() || 'Planning Ahead'

    // Trigger Scout Report generation (fire and don't block the response)
    // We use the internal API route — on Vercel this stays within the same process
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
    
    // Fire scout report generation asynchronously
    fetch(`${baseUrl}/api/scout-report`, {
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
    }).catch(err => {
      console.error('Scout report trigger failed:', err)
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Your Scout Report is being generated! Check your email in a few minutes.',
      lead_id: leadId,
    })
  } catch (error) {
    console.error('Lead submission error:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
