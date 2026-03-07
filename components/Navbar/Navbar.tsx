'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

// Pages that use their own DashboardLayout (sidebar + header)
const DASHBOARD_ROUTES = ['/subjects'];

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    // Hide the global navbar on dashboard pages that have their own sidebar/header
    if (pathname && DASHBOARD_ROUTES.some(r => pathname === r)) {
        return null;
    }

    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };

    return (
        <nav className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-6">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <BookOpen className="h-8 w-8 text-blue-600" />
                            <span className="font-semibold text-lg tracking-tight text-gray-900">PathToPro</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link href="/subjects" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                                    Subjects
                                </Link>
                                <Link href="/profile" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                                    {user?.name || 'Profile'}
                                </Link>
                                <Button variant="outline" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login">
                                    <Button variant="ghost" size="sm">Login</Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button size="sm">Register</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
