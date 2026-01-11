import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { sqlite } from "@/lib/prisma"
import { getUserByEmail, getUserById } from "@/lib/db-adapter"
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth"

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
        console.log("Authorize called with:", credentials);
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }
        const user = await getUserByEmail(credentials.email as string);
        if (!user) {
          console.log("No user found");
          return null;
        }
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!passwordMatch) {
          console.log("Password does not match");
          return null;
        }
        console.log("Login successful for user:", user.email);
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
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

export const { handlers, auth: nextAuth } = NextAuth(authConfig)

export async function auth() {
  return getServerSession(authConfig)
}

export async function getSessionUserByEmail(email: string) {
  return getUserByEmail(email)
}

export async function getSessionUserById(id: string) {
  return getUserById(id)
}

// Add your NextAuth options here:
export const authOptions = {
  // ...your NextAuth config...
  // Example:
  // providers: [...],
  // adapter: ...,
  // session: ...,
  // callbacks: ...,
}

// Optionally, export a helper for getServerSession if you want:
export { getServerSession } from "next-auth"
