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
      auth: {
        persistSession: false, // Important: ne pas persister côté serveur
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  )

  // Récupérer l'utilisateur - être plus permissif avec les erreurs
  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser()
    if (data?.user && !error) {
      user = data.user;
    }
  } catch (error) {
    console.log('Middleware - Error getting user:', error);
    // Continue sans user, ne pas bloquer
  }

  // Log pour debug (à retirer en prod)
  console.log('Middleware - Path:', request.nextUrl.pathname, 'User:', !!user)

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register')
  
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard') || 
                          request.nextUrl.pathname.startsWith('/interview') || 
                          request.nextUrl.pathname.startsWith('/settings')

  // Vérifier s'il y a des tokens dans les cookies comme fallback
  const accessToken = request.cookies.get('sb-access-token')?.value;
  const refreshToken = request.cookies.get('sb-refresh-token')?.value;
  const hasTokens = !!(accessToken || refreshToken);

  // Si c'est une page protégée et pas d'utilisateur ET pas de tokens
  if (isProtectedPage && !user && !hasTokens) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Si c'est une page d'auth et utilisateur connecté OU tokens présents
  if (isAuthPage && (user || hasTokens)) {
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