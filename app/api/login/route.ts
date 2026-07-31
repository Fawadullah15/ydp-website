import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'ydp-super-secret-key-for-jwt-signing-2024'
)

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Return generic error to prevent email enumeration
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Account is deactivated' }, { status: 403 })
    }

    // Check lockout status
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000)
      return NextResponse.json(
        { error: `Account is temporarily locked due to multiple failed attempts. Please try again in ${remainingTime} minutes.` },
        { status: 429 }
      )
    }

    if (!user.password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      // Increment failed attempts
      const newFailedAttempts = user.failedAttempts + 1;
      let lockedUntil = null;
      
      // Lock account after 5 failed attempts for 15 minutes
      if (newFailedAttempts >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60000);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { 
          failedAttempts: newFailedAttempts,
          lockedUntil: lockedUntil
        }
      });

      // Log failed attempt for Super Admin notification
      await prisma.notification.create({
        data: {
          title: "Failed Admin Login Attempt",
          description: `Failed login attempt for email: ${email}`,
          category: "SECURITY",
          priority: "HIGH",
        }
      });

      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Reset failed attempts on successful login
    if (user.failedAttempts > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: 0,
          lockedUntil: null
        }
      });
    }

    // Create JWT token
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(SECRET)

    // Set cookie and return success
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    })

    response.cookies.set('ydp-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
