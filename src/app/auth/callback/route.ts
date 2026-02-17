import { NextRequest, NextResponse } from 'next/server'
import { createClientForMiddleware } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin
  
  if (code) {
    const response = NextResponse.redirect(`${origin}/`)
    const supabase = await createClientForMiddleware(request, response)
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
    }
    
    return response
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/login?error=no_code`)
}