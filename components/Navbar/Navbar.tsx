'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/auth/login');
    };

    return (
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                            <span className="font-bold text-xl tracking-tight text-gray-900">PathToPro</span>
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
