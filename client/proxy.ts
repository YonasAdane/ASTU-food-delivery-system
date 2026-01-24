import { NextRequest, NextResponse } from 'next/server';
import { getUserFromCookie } from './lib/auth';
import { hasRole } from './lib/has-role';

/**
 * Protected application routes
 */
const protectedRouteRegex = /^\/(customer|restaurant|driver|admin)(\/.*)?$/;

/**
 * Auth-related pages (must be inaccessible when logged in)
 */
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

/**
 * Public routes (always accessible)
 */
const publicRoutes = ['/'];

/**
 * Role → dashboard mapping
 */
const roleRedirectMap: Record<string, string> = {
  customer: '/customer/restaurant',
  restaurant: '/restaurant',
  driver: '/driver/dashboard',
  admin: '/admin',
};

/**
 * Role-based permissions
 */
const routePermissions: Record<string, string[]> = {
  '/customer': ['customer'],
  '/restaurant': ['restaurant'],
  '/driver': ['driver'],
  '/admin': ['admin'],
};

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRouteRegex.test(path);
  const isAuthRoute = authRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

const sessionUser = await getUserFromCookie();
  const isAuthenticated = Boolean(sessionUser?.role);
  const role = sessionUser?.role;

  /**
   * 1️⃣ Authenticated user trying to access auth pages → BLOCK
   */
  if (isAuthenticated && isAuthRoute) {
    const redirectTo = roleRedirectMap[role as string] ?? '/';
    return NextResponse.redirect(new URL(redirectTo, req.nextUrl.origin));
  }

  /**
   * 2️⃣ Unauthenticated user accessing protected routes → LOGIN
   */
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.nextUrl.origin));
  }

  /**
   * 3️⃣ Role-based authorization
   */
  if (isAuthenticated && isProtectedRoute) {
    const matchedPrefix = Object.keys(routePermissions).find((prefix) =>
      path.startsWith(prefix)
    );

    if (matchedPrefix) {
      const requiredRoles = routePermissions[matchedPrefix];
      const authorized = await hasRole(requiredRoles);

      if (!authorized) {
        const fallback = roleRedirectMap[role as string] ?? '/';
        return NextResponse.redirect(new URL(fallback, req.nextUrl.origin));
      }
    }
  }

  /**
   * 4️⃣ Allow access
   */
  return NextResponse.next();
}

/**
 * Middleware matcher
 */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
