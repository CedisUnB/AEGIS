import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/core/security";

const PROTECTED_PREFIXES = ["/tracks", "/practice", "/progress", "/revision", "/admin"];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function buildCsp(nonce: string) {
  const isProd = process.env.NODE_ENV === "production";

  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isProd ? "" : " 'unsafe-eval'"}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
}

export async function proxy(request: NextRequest) {
  if (isProtectedPath(request.nextUrl.pathname)) {
    const token = request.cookies.get("token")?.value;
    const session = token ? await verifyToken(token) : null;

    if (!session) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Testando página de erro padrão, controle de acesso sendo feito direto na página do admin
    // if (
    //   request.nextUrl.pathname.startsWith("/admin") &&
    //   session.role !== "admin"
    // ) {
    //   return NextResponse.redirect(new URL("/tracks", request.url));
    // }
  }

  // Nonce novo a cada requisição; o Next lê o nonce do cabeçalho CSP da requisição
  // e o aplica aos scripts que ele mesmo injeta.
  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};