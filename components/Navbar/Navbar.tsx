'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import Typewriter from '@/components/Typewriter';

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
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <img
                                src="https://static.thenounproject.com/png/2645458-200.png"
                                alt="PathToPro Logo"
                                className="h-10 w-10 object-contain"
                            />
                            <span className="font-bold text-xl tracking-tighter text-gray-900">
                                <Typewriter text="PathToPro" speed={150} showCursor={false} />
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-sm font-bold text-blue-600 bg-blue-50/80 px-4 py-2 rounded-full hover:bg-blue-100 transition-all">
                            Home
                        </Link>
                        <Link href="/subjects?tab=courses" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
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
