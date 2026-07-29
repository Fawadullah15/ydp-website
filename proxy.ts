import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const authSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
const secret = authSecret ? new TextEncoder().encode(authSecret) : null

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // For admin routes, check for session token cookie
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    // Check for YDP session cookie
    const token = request.cookies.get('ydp-session')

    if (!token || !secret) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    try {
      await jwtVerify(token.value, secret)
    } catch {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('ydp-session')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
