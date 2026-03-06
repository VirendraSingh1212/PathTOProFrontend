"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
    open: boolean;
    onClose: () => void;
    message?: string;
};

export default function ProtectedActionModal({ open, onClose, message = "Please login for the full immersive experience." }: Props) {
    const router = useRouter();

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div
                className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
                role="dialog"
                aria-modal="true"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Close modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Sign in required</h3>
                    <p className="text-gray-500 mb-8">{message}</p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => router.push("/auth/register")}
                        >
                            Create Account
                        </Button>
                        <Button
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => router.push("/auth/login")}
                        >
                            Sign In
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
