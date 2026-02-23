import type { NextAuthConfig } from "next-auth"

export const authConfig = {
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
        // session.user.id = token.id;
      }
      return session;
    },
  },
  providers: [], // Add providers with window/node dependencies in auth.ts
} satisfies NextAuthConfig;
