import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname, searchParams } = request.nextUrl;

  // Gestion du paramètre 'code' (ex: réinitialisation de mot de passe via PKCE)
  const code = searchParams.get("code");
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.searchParams.delete("code");
    if (pathname === "/" || pathname === "/forgot-password" || pathname === "/login") {
      redirectUrl.pathname = "/reset-password";
    }
    return NextResponse.redirect(redirectUrl, { headers: supabaseResponse.headers });
  }

  const publicRoutes = [
    "/",
    "/blog",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/test",
    "/mentions-legales",
    "/cgu",
    "/confidentialite",
    "/a-propos",
    "/contact",
    "/roadmap",
    "/guides",
    "/valider-inscription"
  ];
  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    pathname.startsWith("/blog/") ||
    pathname.startsWith("/guides/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/portail/");

  if (isPublicRoute) return supabaseResponse;

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|google4e61d29fea600ce3.html|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
