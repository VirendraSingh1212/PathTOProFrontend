'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global Error Boundary caught:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h2>
                <p className="text-gray-500 mb-8">
                    We apologize for the inconvenience. An unexpected error has occurred.
                </p>
                <div className="flex flex-col gap-3">
                    <Button onClick={() => reset()} size="lg" className="w-full">
                        Try again
                    </Button>
                    <Link href="/">
                        <Button variant="outline" size="lg" className="w-full">
                            Return Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
