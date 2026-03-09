"use client";

import React from "react";
import { Check, Zap, Rocket, Crown, ArrowRight } from "lucide-react";

interface PlanProps {
    name: string;
    price: string;
    description: string;
    features: string[];
    icon: React.ReactNode;
    highlighted?: boolean;
    onSelect: () => void;
    index: number;
}

const PlanCard = ({ name, price, description, features, icon, highlighted, onSelect, index }: PlanProps) => {
    return (
        <div
            className={`relative group p-8 rounded-[32px] transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 fill-mode-both ${highlighted
                    ? "bg-white border-2 border-blue-500 shadow-[0_20px_50px_rgba(59,130,246,0.15)] z-10"
                    : "bg-white/50 border border-slate-100 hover:border-blue-200 hover:shadow-xl"
                }`}
            style={{ animationDelay: `${index * 150}ms` }}
        >
            {highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                    Best Value
                </div>
            )}

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${highlighted ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "bg-slate-100 text-slate-600"
                }`}>
                {icon}
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">{name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-slate-900">{price}</span>
                {price !== "Free" && <span className="text-slate-500 font-medium">/lifetime</span>}
            </div>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">
                {description}
            </p>

            <ul className="space-y-4 mb-10">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-semibold text-slate-600">
                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${highlighted ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-400"}`}>
                            <Check size={12} strokeWidth={3} />
                        </div>
                        {feature}
                    </li>
                ))}
            </ul>

            <button
                onClick={onSelect}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${highlighted
                        ? "bg-blue-600 text-white hover:bg-black shadow-xl shadow-blue-500/25"
                        : "bg-slate-900 text-white hover:bg-blue-600 shadow-lg"
                    }`}
            >
                {price === "Free" ? "Get Started" : "Unlock Now"}
                <ArrowRight size={18} />
            </button>
        </div>
    );
};

export default function PricingSection() {
    const handlePayment = (planName: string) => {
        alert(`Initializing Razorpay for ${planName}... (Wait for build!)`);
        // This is where we'll trigger the Razorpay SDK
    };

    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-20 animate-in fade-in slide-in-from-top-8 duration-700">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                    <Crown size={12} className="fill-current" /> Membership
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                    Invest in your <span className="text-blue-600">Pro Career</span>
                </h2>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                    Choose a path that fits your goals. One-time payment, lifetime access to world-class curriculum.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <PlanCard
                    index={0}
                    name="Learning Path"
                    price="Free"
                    description="Perfect for exploring the basics and starting your journey."
                    features={[
                        "Introduction to HTML/CSS",
                        "Core JavaScript Concepts",
                        "Community Support Access",
                        "Public Roadmaps"
                    ]}
                    icon={<Zap size={28} />}
                    onSelect={() => handlePayment("Free")}
                />

                <PlanCard
                    index={1}
                    name="Professional"
                    price="₹4,999"
                    highlighted={true}
                    description="Our most popular plan for aspiring full-stack engineers."
                    features={[
                        "All Learning Path Content",
                        "React & Next.js Masterclass",
                        "Backend (Node/Express) Mastery",
                        "Real-world Portfolio Projects",
                        "AI Assistant Priority Access"
                    ]}
                    icon={<Rocket size={28} />}
                    onSelect={() => handlePayment("Professional")}
                />

                <PlanCard
                    index={2}
                    name="Career Master"
                    price="₹9,999"
                    description="Personalized guidance to land your dream job at top product companies."
                    features={[
                        "All Professional Features",
                        "System Design Interview Prep",
                        "1-on-1 Resume Review",
                        "Mock Technical Interviews",
                        "Direct Job Referral Network"
                    ]}
                    icon={<Crown size={28} />}
                    onSelect={() => handlePayment("Master")}
                />
            </div>

            <div className="mt-20 p-10 rounded-[40px] bg-slate-900 relative overflow-hidden animate-in fade-in zoom-in-95 duration-1000 delay-500">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl font-black text-white mb-2">Still unsure?</h3>
                        <p className="text-slate-400 font-medium">Schedule a free career consultation with our mentors.</p>
                    </div>
                    <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                        Talk to Mentor
                    </button>
                </div>

                {/* Decorative Glow */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600/30 rounded-full blur-[100px] -mr-32 -mb-32" />
            </div>
        </section>
    );
}
