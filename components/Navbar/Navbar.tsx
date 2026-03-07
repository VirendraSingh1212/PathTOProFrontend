'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm navbar">
            <div className="container mx-auto px-6">
                <div className="flex justify-between h-16 items-center">
                    {/* Left side */}
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <BookOpen className="h-8 w-8 text-blue-600" />
                            <span className="font-semibold text-lg tracking-tight text-gray-900">PathToPro</span>
                        </Link>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                            Home
                        </Link>
                        <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                            About Us
                        </Link>
                        <Link
                            href="/auth/register"
                            style={{
                                background: '#3b5bdb',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontWeight: 600,
                                textDecoration: 'none',
                                fontSize: '14px',
                                display: 'inline-block'
                            }}
                        >
                            ENROLL NOW
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
