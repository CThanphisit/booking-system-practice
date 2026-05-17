import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("role")?.value;

  const isAdmin = role === "ADMIN";

  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname.startsWith("/login");
  const isAdminRoute = pathname.startsWith("/admin");
  const isSharedRoute = pathname.startsWith("/profile");

  // เช็ค Login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // login แล้ว → กันไม่ให้กลับ login
  if (token && isAuthPage) {
    if (isAdmin) {
      return NextResponse.redirect(
        new URL("/admin/dashboard_admin", request.url),
      );
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ADMIN restriction — ยกเว้น shared routes เช่น /profile
  if (isAdmin && !isAdminRoute && !isSharedRoute) {
    return NextResponse.redirect(
      new URL("/admin/dashboard_admin", request.url),
    );
  }

  // protect admin route
  if (pathname.startsWith("/admin")) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/bookings/:path*", "/admin/:path*", "/profile/:path*", "/profile"],
};
