import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/core/security";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isValid = token && (await verifyToken(token));

  if (!isValid) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/trails/:path*", "/practice/:path*", "/progress/:path*", "/revision/:path*", "/admin/:path*"],
};