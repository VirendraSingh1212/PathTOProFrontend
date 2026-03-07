"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPolicyPage() {
    const router = useRouter();

    const sections = [
        {
            title: "1. Information We Collect",
            content: "We collect information you provide directly to us when you create an account, such as your name, email address, and password. We also automatically collect certain technical information when you access the platform, such as your IP address, browser type, device information, and usage patterns."
        },
        {
            title: "2. How We Use Your Information",
            content: "We use the information we collect to operate, maintain, and improve the PathToPro platform. This includes processing transactions, personalizing your educational experience, tracking course progress, and communicating with you about updates and support."
        },
        {
            title: "3. Information Sharing and Disclosure",
            content: "We do not sell your personal information to third parties. We may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential."
        },
        {
            title: "4. Data Security",
            content: "We implement reasonable security measures designed to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure."
        },
        {
            title: "5. Cookies and Tracking Technologies",
            content: "PathToPro uses cookies and similar tracking technologies to track the activity on our platform and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
        },
        {
            title: "6. Your Data Rights",
            content: "Depending on your location, you may have the right to access, correct, delete, or restrict the processing of your personal information. You can manage your account information through your profile settings or by contacting support."
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
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">Privacy Policy</h1>
                    <p className="text-gray-400 text-sm tracking-wide">Last updated: March 2026</p>
                </div>

                <div className="px-8 py-12 sm:px-16 text-gray-700 leading-relaxed">
                    <p className="mb-10 text-lg">
                        At PathToPro, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and manage your personal data when you interact with our educational platform.
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
                            If you have any questions or concerns regarding this Privacy Policy or your data, please contact our privacy team at <a href="mailto:privacy@pathtopro.com" className="text-black font-semibold hover:underline">privacy@pathtopro.com</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
