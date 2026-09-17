import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/core/security";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    session.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/trails", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/trails/:path*", "/practice/:path*", "/progress/:path*", "/revision/:path*", "/admin/:path*"],
};