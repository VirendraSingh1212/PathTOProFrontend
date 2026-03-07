"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsPage() {
    const router = useRouter();

    const sections = [
        {
            title: "1. Acceptance of Terms",
            content: "By accessing and using PathToPro, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions in this agreement, you may not access the platform or use any of its services."
        },
        {
            title: "2. User Accounts and Registration",
            content: "In order to access certain features, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to keep your account information updated."
        },
        {
            title: "3. Educational Content and Licensing",
            content: "All courses, materials, videos, and texts available on PathToPro are the intellectual property of PathToPro or its content creators. You are granted a limited, personal, non-exclusive, non-transferable license to access and view the content for personal educational purposes."
        },
        {
            title: "4. User Conduct guidelines",
            content: "You agree not to use the platform for any unlawful purpose or to solicit others to perform illegal acts. You also agree not to share your account credentials, reproduce or distribute course materials without authorization, or engage in automated scraping of the site."
        },
        {
            title: "5. Refunds and Payments",
            content: "Payments made for premium courses are generally non-refundable unless specified otherwise under a specific course's money-back guarantee policy. PathToPro reserves the right to modify pricing at any time."
        },
        {
            title: "6. Limitation of Liability",
            content: "PathToPro and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the services."
        }
    ];

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#f9fafb] pt-12 px-4 sm:px-6 lg:px-8 pb-24 font-sans">
            <div className="max-w-4xl w-full mx-auto mb-8">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Home
                </button>
            </div>

            <div className="max-w-4xl w-full mx-auto bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-[#1f1f1f] px-8 py-16 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">Terms of Service</h1>
                    <p className="text-gray-400 text-sm tracking-wide">Last updated: March 2026</p>
                </div>

                <div className="px-8 py-12 sm:px-16 text-gray-700 leading-relaxed">
                    <p className="mb-10 text-lg">
                        Welcome to PathToPro. These Terms of Service ("Terms") govern your access to and use of the PathToPro website, services, and educational platform. Please read them carefully.
                    </p>

                    <div className="space-y-10">
                        {sections.map((section, idx) => (
                            <div key={idx}>
                                <h2 className="text-xl font-bold text-black mb-3">{section.title}</h2>
                                <p className="text-gray-600 text-[15px]">{section.content}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-100">
                        <h2 className="text-xl font-bold text-black mb-3">7. Contact Us</h2>
                        <p className="text-gray-600 text-[15px]">
                            If you have any questions about these Terms, please contact us at <a href="mailto:support@pathtopro.com" className="text-black font-semibold hover:underline">support@pathtopro.com</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
