import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const role = request.cookies.get("role")?.value;
  console.log("token:", token);

  const pathname = request.nextUrl.pathname;

  const isAuthPage = pathname.startsWith("/login");
  console.log("isAuthPage", isAuthPage);

  // เช็ค Login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // กันกลับไปหน้า Login ถ้ามี token แล้ว
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // protect admin route
  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/bookings/:path*", "/admin/:path*"],
};
