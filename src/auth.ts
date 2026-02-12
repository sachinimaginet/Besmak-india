import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import prisma from "@/lib/prisma"
// import bcrypt from "bcryptjs" // using simple comparison for failing install. Will add later

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await prisma.adminUser.findUnique({ where: { email } });
          if (!user) return null;
          
          // Using simple password check for prototype. 
          // Use bcrypt for production!
          // const passwordsMatch = await bcrypt.compare(password, user.password);
          const passwordsMatch = password === user.password; // TODO: FIX THIS
          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        // session.user.id = token.id; // Type issue might occur here without extending types
      }
      return session;
    },
  },
})
