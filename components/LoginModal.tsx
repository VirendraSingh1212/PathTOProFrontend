import React from "react";
import Link from "next/link";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function LoginModal({ open, onClose }: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white p-8 rounded-xl w-full max-w-sm text-center shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    aria-label="Close"
                >
                    ✕
                </button>
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    🔒
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Login Required</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    To mark lessons complete, use the AI assistant, or unlock courses, please sign in.
                </p>
                <div className="flex flex-col gap-3">
                    <Link
                        href="/auth/login"
                        className="w-full bg-gray-900 text-white font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Log In
                    </Link>
                    <Link
                        href="/auth/register"
                        className="w-full bg-white text-gray-900 border border-gray-200 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
