import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Define the shape of the decoded token payload
interface DecodedToken {
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  // Add other properties from your token payload if needed (e.g., sub, email)
}

export function middleware(request: NextRequest) {
  // 1. Get the authentication token from the cookies
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Rule 1: Protect all routes if the user is not logged in
  // If there's no token and the user is trying to access any page
  // other than the login page, redirect them to login.
  if (!token && pathname !== '/auth/login') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If a token exists, we can check the user's role and current location
  if (token) {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const userRole = decodedToken.role;

      // Rule 2: Prevent logged-in users from accessing the login page
      if (pathname.startsWith('/auth/login')) {
        // Redirect them to their appropriate dashboard
        const redirectUrl = userRole === 'STUDENT' ? '/exam' : '/exam/admin';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
      
      // Rule 3: Protect admin routes from students
      if (pathname.startsWith('/exam/admin') && userRole === 'STUDENT') {
        // If a student tries to access an admin page, redirect them to the student dashboard
        return NextResponse.redirect(new URL('/exam', request.url));
      }

    } catch (error) {
      // This will catch invalid/malformed tokens.
      // We'll clear the cookie and force a re-login.
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('auth_token');
      console.error("Invalid token found, redirecting to login.");
      return response;
    }
  }

  // If none of the rules above are met, allow the request to continue
  return NextResponse.next();
}

// Config to specify which paths the middleware should run on.
// This is more efficient than running it on every single request.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};