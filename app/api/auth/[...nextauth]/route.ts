import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import  prisma  from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) throw new Error("Missing email or password")
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user) throw new Error("User not found")
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) throw new Error("Invalid password")
        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) { if (user) token.role = (user as any).role; return token },
    async session({ session, token }) { if (token) { (session.user as any).id = token.sub; (session.user as any).role = token.role }; return session },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
