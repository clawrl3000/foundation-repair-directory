import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

async function sendTelegramNotification(lead: Record<string, string>) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!botToken || !chatId) return

  const urgencyEmoji = lead.urgency === 'emergency' ? '🚨' : lead.urgency === 'high' ? '⚠️' : '📋'
  const lines = [
    `${urgencyEmoji} **New Foundation Scout Lead**`,
    ``,
    `👤 **${lead.name}**`,
    lead.email ? `📧 ${lead.email}` : '',
    lead.phone ? `📞 ${lead.phone}` : '',
    lead.zip ? `📍 ZIP: ${lead.zip}` : '',
    lead.service_needed ? `🔧 Service: ${lead.service_needed}` : '',
    lead.property_type ? `🏠 Property: ${lead.property_type}` : '',
    lead.urgency ? `⏰ Urgency: ${lead.urgency}` : '',
    lead.message ? `\n💬 "${lead.message}"` : '',
    ``,
    `🔗 Source: ${lead.source_page || 'direct'}`,
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

    // Send Telegram notification (fire-and-forget, don't block response)
    sendTelegramNotification({
      name, email, phone: phone || '', message: message || '',
      service_needed: service_needed || '', property_type: property_type || '',
      urgency: urgency || 'medium', zip: zip || '', source_page,
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
