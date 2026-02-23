import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { query as dbQuery } from "@/lib/db"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          const users = await dbQuery<any[]>("SELECT * FROM adminuser WHERE email = ? LIMIT 1", [email]);
          const user = users[0];

          if (!user) return null;
          
          const passwordsMatch = password === user.password;
          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
})
