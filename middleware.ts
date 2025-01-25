import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { NextResponse } from "next/server"

const { auth: middleware } = NextAuth(authConfig)

const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/api/auth/verify-email",
]

export default middleware((req) => {
    const { nextUrl, auth } = req
    // Con el doble exclamación lo hace un boleano la cual nos va a devolver solo verdadero o falso
    const isLoggedIn = !!auth?.user

    // proteger /dashboard /admin
    if (!publicRoutes.includes(nextUrl.pathname) && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }
    return NextResponse.next();
});

// https://clerk.com/docs/quickstarts/nextjs
// LO QUE NOS INTERESA DE "clerk" es el CODIGO del middleware que tiene para usarlo con "matcher"

export const config = {
    matcher: [
      // Skip Next.js internals and all static files, unless found in search params
      // Es una expresion regular para el middleware lo que hace es que este middleware no va a estar pendiente de ciertos archivos que nosotros no necesitamos
      '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
      // Always run for API routes
      '/(api|trpc)(.*)',
    ],
  }
