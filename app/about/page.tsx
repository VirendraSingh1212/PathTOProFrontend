"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Target, Users, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Trigger entrance animation shortly after mount
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const values = [
        { icon: <BookOpen size={24} />, title: "Quality Education", desc: "Curated content designed purely for your success." },
        { icon: <Target size={24} />, title: "Practical Focus", desc: "Learn by building real-world projects, not just theory." },
        { icon: <Users size={24} />, title: "Community Driven", desc: "Join a network of motivated learners and developers." },
        { icon: <Zap size={24} />, title: "Fast-Paced", desc: "Optimized curriculums to get you job-ready faster." },
    ];

    return (
        <div className="min-h-screen bg-[#f9fafb] flex flex-col pt-12 px-4 sm:px-6 lg:px-8 pb-24">
            {/* Back Button */}
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
                {/* Header Hero Section */}
                <div className={`bg-[#1f1f1f] px-8 py-20 text-center transition-all duration-1000 ease-out relative overflow-hidden ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-8 scale-95'}`}>
                    {/* Subtle monochrome background elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gray-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-600/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

                    <div className="flex justify-center mb-8 relative z-10">
                        <div className="bg-white text-black p-4 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 transition-transform hover:rotate-0 duration-300">
                            <BookOpen size={40} strokeWidth={2.5} />
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight relative z-10">
                        About PathToPro
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed relative z-10">
                        PathToPro is a minimalist, premium learning platform dedicated to transforming aspiring developers into seasoned professionals through high-quality, practical coursework.
                    </p>
                </div>

                {/* Core Values Section */}
                <div className={`px-8 py-16 sm:px-16 transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{ transitionDelay: '300ms' }}>
                    <h2 className="text-3xl font-bold text-black mb-12 text-center tracking-tight">Our Core Values</h2>
                    <div className="grid gap-10 grid-cols-1 sm:grid-cols-2">
                        {values.map((v, i) => (
                            <div
                                key={i}
                                className={`flex gap-5 group transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                                style={{ transitionDelay: `${400 + i * 150}ms` }}
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-black shrink-0 transition-all duration-300 group-hover:bg-black group-hover:text-white group-hover:scale-110 shadow-sm group-hover:shadow-md">
                                    {v.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-black mb-2 transition-colors">{v.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
