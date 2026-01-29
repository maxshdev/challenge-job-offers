import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    role: string;
    access_token?: string;
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      email: string;
      role: string;
      access_token?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    role?: string;
    access_token?: string;
  }
}
