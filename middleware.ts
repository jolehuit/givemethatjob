import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials not configured. Please check your environment variables.');
    return NextResponse.redirect(new URL('/error?message=Configuration+error', request.url));
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          // Important: set cookies sur request ET response
          request.cookies.set(name, value)
          response.cookies.set(name, value, options)
        },
        remove: (name, options) => {
          // Important: remove cookies sur request ET response  
          request.cookies.delete(name)
          response.cookies.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )

  // Récupérer l'utilisateur et rafraîchir la session si nécessaire
  const { data: { user }, error } = await supabase.auth.getUser()

  // Log pour debug (à retirer en prod)
  console.log('Middleware - Path:', request.nextUrl.pathname, 'User:', !!user, 'Error:', error?.message)

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register')
  
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard') || 
                          request.nextUrl.pathname.startsWith('/interview') || 
                          request.nextUrl.pathname.startsWith('/settings')

  // Si c'est une page protégée et pas d'utilisateur
  if (isProtectedPage && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Si c'est une page d'auth et utilisateur connecté
  if (isAuthPage && user) {
    const redirectPath = request.nextUrl.searchParams.get('redirect') || '/dashboard'
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ]
}