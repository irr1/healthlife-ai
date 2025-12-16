import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/focus',
  '/journey',
  '/coach',
  '/you',
  '/tribe',
  '/components-demo',
];

// Routes that are only for non-authenticated users
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = request.cookies.get('access_token')?.value;
  const hasToken = !!token;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect to login if trying to access protected route without token
  if (isProtectedRoute && !hasToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to focus if trying to access auth routes with token
  if (isAuthRoute && hasToken) {
    return NextResponse.redirect(new URL('/focus', request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
