import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { IAuth } from "@/src/modules/auth/interfaces/auth.interface";
import { loginAction } from "./src/modules/auth/actions/auth.actions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Google,
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required.");
        }

        const payload = await loginAction(credentials.email as string, credentials.password as string);
        const user = payload.user;

        if (!user) throw new Error("Invalid credentials.");

        console.log("Authorized user:", user);

        // devuelvo solo la info que quieras exponer a NextAuth
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          access_token: payload.access_token,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.access_token = user.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;
      session.user.access_token = token.access_token as string;

      return session;
    },
  }
})