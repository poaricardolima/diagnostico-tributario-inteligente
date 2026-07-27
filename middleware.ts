import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "impulso_admin_session";

/** Verificação leve no Edge: presença do cookie. Validação JWT completa no Server Component. */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE)?.value;

  if (pathname.startsWith("/admin/login")) {
    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
