import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { business_id, name, email, phone, message, service_needed, property_type, urgency } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // TODO: Insert into Supabase
    // const { data, error } = await supabase.from('leads').insert({
    //   business_id, name, email, phone, message, 
    //   service_needed, property_type, urgency,
    //   source_page: request.headers.get('referer'),
    // })

    // TODO: Send notification email to contractor

    console.log('New lead:', { business_id, name, email, phone, service_needed })

    return NextResponse.json({ success: true, message: 'Your request has been submitted!' })
  } catch (error) {
    console.error('Lead submission error:', error)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
