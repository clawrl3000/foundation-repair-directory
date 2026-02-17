import { NextRequest, NextResponse } from 'next/server'
import { createClientForMiddleware } from '@/lib/supabase-server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  try {
    const supabase = await createClientForMiddleware(request, response)
    
    // Refresh session if expired - required for Server Components
    await supabase.auth.getUser()
    
    return response
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}