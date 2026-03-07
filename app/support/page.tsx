"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";

export default function SupportPage() {
    const router = useRouter();

    // Typewriter effect state
    const [typedText, setTypedText] = useState("");
    const fullText = "Stuck? Don't worry, we got you!";

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        let i = 0;
        const typingInterval = setInterval(() => {
            setTypedText(fullText.substring(0, i + 1));
            i++;
            if (i === fullText.length) clearInterval(typingInterval);
        }, 60); // typing speed

        return () => clearInterval(typingInterval);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
            setFormData({ name: "", phone: "", email: "", message: "" });

            // Reset success message after 5 seconds
            setTimeout(() => setSubmitSuccess(false), 5000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#f9fafb] flex flex-col pt-12 px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="max-w-3xl w-full mx-auto mb-8">
                <button
                    onClick={() => router.push('/subjects')}
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Dashboard
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl w-full mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="bg-[#1f1f1f] px-8 py-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gray-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 relative z-10 min-h-[48px]">
                        {typedText}
                        <span className="animate-pulse">|</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto relative z-10 text-sm sm:text-base">
                        Whether you are facing technical issues, need help with billing, or have questions about a course, our support team is here to assist you.
                    </p>
                </div>

                {/* Form Section */}
                <div className="px-8 py-10 sm:px-12">
                    {submitSuccess ? (
                        <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-6 text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send className="text-green-600" size={24} />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Message Sent Successfully!</h3>
                            <p className="text-sm">Our support team has received your request and will get back to you shortly.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 border focus:border-black focus:bg-white focus:ring-4 focus:ring-gray-200 transition-all outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 border focus:border-black focus:bg-white focus:ring-4 focus:ring-gray-200 transition-all outline-none"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 border focus:border-black focus:bg-white focus:ring-4 focus:ring-gray-200 transition-all outline-none"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-700">Describe Your Issue</label>
                                <textarea
                                    id="message"
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 border focus:border-black focus:bg-white focus:ring-4 focus:ring-gray-200 transition-all outline-none resize-none"
                                    placeholder="Please provide as much detail as possible so we can best assist you..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending Message...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        Submit Support Request
                                        <Send size={16} className="ml-2" />
                                    </span>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
