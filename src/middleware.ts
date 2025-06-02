import { NextRequest, NextResponse } from "next/server";

// Middleware sin internacionalización
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const staticFiles = [
    "/favicon.ico",
    "/_next",
    "/static",
    "/fonts",
    "/images",
    "/messages",
    "/placeholder.png",
  ];
  if (staticFiles.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("user_token")?.value;

  // Ruta protegida raíz "/"
  const isProtectedRoot = pathname === "/" || pathname === "";

  // Redirige a /login si no hay token
  if (isProtectedRoot && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/:path*",
  ],
};
