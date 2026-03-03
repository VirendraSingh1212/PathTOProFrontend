import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 p-4">
            <div className="text-center">
                <FileQuestion className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">404</h2>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <Link href="/">
                    <Button size="lg">
                        Return Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
