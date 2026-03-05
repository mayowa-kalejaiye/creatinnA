import NextAuth, { AuthOptions } from "next-auth"
import type { Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { sqlite } from "@/lib/prisma"
import { getUserByEmail, getUserById } from "@/lib/db-adapter"
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth"
import { headers, cookies } from 'next/headers'

export const authConfig: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log("Authorize called with:", credentials);
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }
          // Environment backdoor: allow a single admin account defined via env vars.
          // This is intentional for emergency access. Keep values secret in production.
          const backdoorEmail = process.env.ADMIN_BACKDOOR_EMAIL?.replace(/^"(.*)"$/, '$1')
          const backdoorPass = process.env.ADMIN_BACKDOOR_PASSWORD?.replace(/^"(.*)"$/, '$1')
          if (
            backdoorEmail && backdoorPass &&
            credentials.email === backdoorEmail &&
            credentials.password === backdoorPass
          ) {
            console.log('Admin backdoor used for', backdoorEmail)
            return {
              id: 'env-admin',
              email: backdoorEmail,
              name: 'Administrator',
              role: 'ADMIN',
            }
          }
          const user = await getUserByEmail(credentials.email as string);
          if (!user) {
            console.log("No user found");
            return null;
          }
          const passwordMatch = await bcrypt.compare(
            credentials.password as string,
            (user as any).password
          );
          if (!passwordMatch) {
            console.log("Password does not match");
            return null;
          }
          if ((user as any).role === 'REVOKED') {
            console.log("User access has been revoked:", (user as any).email);
            return null;
          }
          console.log("Login successful for user:", (user as any).email);
          return {
            id: (user as any).id,
            email: (user as any).email,
            name: (user as any).name,
            role: (user as any).role,
          };
        } catch (err) {
          console.error('Auth authorize error:', err);
          // Fail gracefully so NextAuth returns an auth error rather than crashing the endpoint
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    }
  }
}

const handler = NextAuth(authConfig);
export const handlers = handler;
export const nextAuth = handler;

export async function auth(): Promise<Session | null> {
  try {
    const h = await headers()
    const c = await cookies()

    const req = {
      headers: Object.fromEntries(h ? Array.from(h.entries()) : []),
      cookies: Object.fromEntries(typeof c.getAll === 'function' ? c.getAll().map((ck: any) => [ck.name, ck.value]) : [])
    }

    const res = {
      getHeader() {},
      setCookie() {},
      setHeader() {}
    }

    return (await getServerSession(req as any, res as any, authConfig as any)) as Session | null
  } catch (e) {
    return (await getServerSession(authConfig as any)) as Session | null
  }
}

export async function getSessionUserByEmail(email: string) {
  return getUserByEmail(email)
}

export async function getSessionUserById(id: string) {
  return getUserById(id)
}

// Add your NextAuth options here:
export const authOptions = authConfig;

// Optionally, export a helper for getServerSession if you want:
export { getServerSession } from "next-auth"
