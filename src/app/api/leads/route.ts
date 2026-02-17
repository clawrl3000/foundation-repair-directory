import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { business_id, name, email, phone, message, service_needed, property_type, urgency, zip } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Get source page and user agent
    const source_page = request.headers.get('referer') || ''
    const user_agent = request.headers.get('user-agent') || ''
    const forwarded_for = request.headers.get('x-forwarded-for') || ''
    const real_ip = request.headers.get('x-real-ip') || ''
    const client_ip = forwarded_for?.split(',')[0] || real_ip || ''

    const { data, error } = await supabase.from('leads').insert({
      business_id,
      name,
      email,
      phone: phone || '',
      message: message || '',
      service_needed: service_needed || '',
      property_type: property_type || '',
      urgency: urgency || 'medium',
      zip: zip || '',
      source_page,
      user_agent,
      client_ip,
      created_at: new Date().toISOString()
    }).select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
    }

    console.log('New lead saved:', data?.[0])

    // TODO: Send notification email to contractor if business_id is provided

    return NextResponse.json({ 
      success: true, 
      message: 'Your request has been submitted! We\'ll connect you with contractors shortly.',
      lead_id: data?.[0]?.id
    })
  } catch (error) {
    console.error('Lead submission error:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
