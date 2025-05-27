import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value || "";
  const isAuthPage = request.nextUrl.pathname === "/";
  const isDashboardPage = request.nextUrl.pathname === "/dashboard";

  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard"],
};
