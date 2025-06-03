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

  // Definir rutas protegidas (puedes agregar más aquí)
  const protectedRoutes = ["/", "/agenda", "/invitados"];

  // Verificar si la ruta actual es protegida
  const isProtectedRoute = protectedRoutes.some((route) => pathname === route);

  // Redirigir a /login si está en ruta protegida y no hay token
  if (isProtectedRoute && !token) {
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
    "/agenda",
    "/invitados",
    "/:path*",
  ],
};
