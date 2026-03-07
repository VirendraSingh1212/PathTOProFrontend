import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold tracking-tight text-gray-900">PathToPro</span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
                        <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
                        <Link href="/connect" className="hover:text-gray-900 transition-colors">Contact Us</Link>
                    </div>
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} PathToPro. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
