// proxy.ts (Next.js 16)
import { NextRequest, NextResponse } from "next/server";

// AUTH.JS
import { auth } from "@/auth";

// next-intl
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ⭐ Proteger /admin/*
  if (pathname.includes("/admin")) {
    const session = await auth();

    if (!session?.user) {
      const loginUrl = new URL("/login?error=auth-required", req.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // ⭐ Otras rutas => next-intl
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|trpc|static|assets|robots|sitemap|sw|service-worker|manifest|.*\\..*|_next|_vercel).*)",
  ],
};
