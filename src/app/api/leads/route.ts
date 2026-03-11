import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for inserts (anon key blocked by RLS)
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function sendTelegramNotification(lead: Record<string, string>) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!botToken || !chatId) return

  const lines = [
    `📋 *New Foundation Scout Lead*`,
    ``,
    `👤 *${lead.name}*`,
    lead.email ? `📧 ${lead.email}` : '',
    lead.phone ? `📞 ${lead.phone}` : '',
    lead.zip_code ? `📍 ZIP: ${lead.zip_code}` : '',
    lead.service_needed ? `🔧 Service: ${lead.service_needed}` : '',
    lead.city ? `📍 City: ${lead.city}` : '',
    lead.notes ? `\n💬 "${lead.notes}"` : '',
    ``,
    `🔗 Source: ${lead.source || 'website'}`,
  ].filter(Boolean).join('\n')

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines,
        parse_mode: 'Markdown',
      }),
    })
  } catch (err) {
    console.error('Telegram notification failed:', err)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { business_id, name, email, phone, service_needed, zip_code, city, state, notes } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const supabase = getSupabase()

    const { data, error } = await supabase.from('leads').insert({
      business_id: business_id || null,
      name,
      email,
      phone: phone || null,
      service_needed: service_needed || null,
      zip_code: zip_code || null,
      city: city || null,
      state: state || null,
      notes: notes || null,
      source: 'website',
      status: 'new',
    }).select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
    }

    console.log('New lead saved:', data?.[0])

    // Send Telegram notification (must await on serverless — Vercel kills process otherwise)
    await sendTelegramNotification({
      name, email, phone: phone || '',
      service_needed: service_needed || '',
      zip_code: zip_code || '', city: city || '',
      notes: notes || '', source: 'website',
    })

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
