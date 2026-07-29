import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'ydp-super-secret-key-for-jwt-signing-2024'
);

export async function verifyAuth(request: NextRequest | Request) {
  try {
    // Determine how to get the cookie based on the request type
    let token: string | undefined;
    
    if (request instanceof NextRequest) {
      token = request.cookies.get('ydp-session')?.value;
    } else {
      // Fallback for standard Request
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const match = cookieHeader.match(/ydp-session=([^;]+)/);
        if (match) {
          token = match[1];
        }
      }
    }

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, SECRET);
    return payload as { id: string; email: string; name: string; role: string };
  } catch (error) {
    console.error('Auth verification failed:', error);
    return null;
  }
}
