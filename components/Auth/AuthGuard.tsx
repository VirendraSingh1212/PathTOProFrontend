'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { isValidToken } from '@/lib/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, accessToken, loading } = useAuthStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // List of routes that don't require authentication
        const publicPaths = ['/auth/login', '/auth/register', '/'];
        const isPublicPath = publicPaths.includes(pathname);

        const checkAuth = () => {
            const validToken = isValidToken(accessToken);

            if (!isPublicPath && (!isAuthenticated || !validToken)) {
                router.replace('/auth/login');
                return; // Don't set isReady when redirecting
            }
            
            if (isPublicPath && isAuthenticated && validToken) {
                if (pathname === '/auth/login' || pathname === '/auth/register') {
                    router.replace('/subjects');
                    return; // Don't set isReady when redirecting
                }
            }
            
            setIsReady(true); // Only set ready when not redirecting
        };

        checkAuth();
    }, [isAuthenticated, accessToken, pathname, router]);

    if (!isReady || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return <>{children}</>;
}
