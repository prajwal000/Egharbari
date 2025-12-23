import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Admin routes protection
        if (path.startsWith('/admin')) {
            if (token?.role !== 'admin') {
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const path = req.nextUrl.pathname;

                // Public paths that don't require authentication
                const publicPaths = ['/', '/auth/login', '/auth/register', '/about', '/contact', '/properties'];
                if (publicPaths.some(p => path === p || path.startsWith('/api/auth') || path.startsWith('/api/seed'))) {
                    return true;
                }

                // Protected paths require token
                if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
                    return !!token;
                }

                return true;
            },
        },
    }
);

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'],
};
