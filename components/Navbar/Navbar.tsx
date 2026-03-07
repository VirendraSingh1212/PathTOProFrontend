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
        <nav className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-6">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <BookOpen className="h-8 w-8 text-black" />
                            <span className="font-semibold text-lg tracking-tight text-gray-900">PathToPro</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                            Home
                        </Link>
                        <Link href="/subjects" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                            Course
                        </Link>
                        <Link href="/connect" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                            Connect
                        </Link>
                        <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                            About us
                        </Link>

                        {isAuthenticated ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleLogout}
                                className="ml-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full px-5"
                            >
                                Logout
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2 ml-2">
                                <Link href="/auth/login">
                                    <Button variant="ghost" size="sm" className="rounded-full">Login</Button>
                                </Link>
                                <Link href="/auth/login">
                                    <button className="h-9 px-4 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors font-medium text-sm">
                                        Register
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
