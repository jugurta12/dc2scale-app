import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false

      // Crée le user en base s'il n'existe pas encore
      await prisma.user.upsert({
        where: { email: user.email },
        update: { name: user.name },
        create: {
          email: user.email,
          name: user.name,
        },
      })

      return true
    },
  },
}