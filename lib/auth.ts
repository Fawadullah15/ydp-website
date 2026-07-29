import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}
export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "ydp-super-secret-key-for-jwt-signing-2024",
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("=== AUTHORIZE CALLED ===")
        console.log("Credentials received:", JSON.stringify(credentials))
        
        if (!credentials?.email || !credentials?.password) {
          console.log("FAIL: Missing email or password")
          return null
        }
        
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })

          console.log("User found:", user ? user.email : "NOT FOUND")

          if (!user || !user.password) {
            console.log("FAIL: User not found or no password")
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          console.log("Password valid:", isPasswordValid)

          if (!isPasswordValid) {
            console.log("FAIL: Password mismatch")
            return null
          }

          const result = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
          console.log("SUCCESS: Returning user", JSON.stringify(result))
          return result
        } catch (err) {
          console.error("AUTHORIZE ERROR:", err)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
  },
  debug: true,
})

