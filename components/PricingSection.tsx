"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Zap, Rocket, Crown, ArrowRight, ChevronDown, ShieldCheck, CreditCard, Lock, Star, ArrowLeft } from "lucide-react";

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
            className={`relative group p-8 rounded-[32px] transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 fill-mode-both border ${highlighted
                ? "bg-white border-black shadow-[0_32px_80px_rgba(0,0,0,0.08)] z-10"
                : "bg-white border-zinc-100 hover:border-black hover:shadow-2xl"
                }`}
            style={{ animationDelay: `${index * 150}ms` }}
        >
            {highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xl">
                    Best Value
                </div>
            )}

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 border ${highlighted ? "bg-black text-white shadow-xl shadow-black/10 border-black" : "bg-zinc-50 text-black border-zinc-100"
                }`}>
                {icon}
            </div>

            <h3 className="text-2xl font-black text-black mb-2 tracking-tight">{name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-black">{price}</span>
                {price !== "Free" && <span className="text-zinc-500 font-medium text-sm">/lifetime</span>}
            </div>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed font-semibold">
                {description}
            </p>

            <ul className="space-y-4 mb-10">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm font-bold text-zinc-700">
                        <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${highlighted ? "bg-black/5 border-black/10 text-black" : "bg-zinc-50 border-zinc-100 text-zinc-400"}`}>
                            <Check size={12} strokeWidth={3} />
                        </div>
                        {feature}
                    </li>
                ))}
            </ul>

            <button
                onClick={onSelect}
                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 border-2 ${highlighted
                    ? "bg-black text-white border-black hover:bg-zinc-900 shadow-xl shadow-black/10"
                    : "bg-transparent border-black text-black hover:bg-black hover:text-white"
                    }`}
            >
                {price === "Free" ? "Get Started" : "Unlock Now"}
                <ArrowRight size={18} strokeWidth={3} />
            </button>
        </div>
    );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-zinc-100 py-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-4 group"
            >
                <h4 className="text-left font-black text-zinc-900 group-hover:text-black transition-colors">{question}</h4>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${isOpen ? "bg-black text-white border-black" : "bg-zinc-50 text-zinc-400 border-zinc-100"}`}>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </div>
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden text-zinc-500 font-medium text-sm leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
};

export default function PricingSection() {
    const router = useRouter();
    const handlePayment = (planName: string) => {
        alert(`Initializing Razorpay for ${planName}... (Wait for build!)`);
    };

    return (
        <section className="pt-12 pb-24 px-6 max-w-7xl mx-auto overflow-hidden">
            {/* ── Navbar-like Header with Back Button ── */}
            <div className="flex items-center justify-between mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <button
                    onClick={() => router.push('/subjects')}
                    className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors group"
                >
                    <div className="w-10 h-10 rounded-full border border-zinc-100 flex items-center justify-center group-hover:bg-zinc-50 transition-all">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Back to Courses</span>
                </button>
            </div>

            {/* ── Trust Indicators ── */}
            <div className="flex justify-center flex-wrap gap-8 mb-12 animate-in fade-in duration-1000">
                {[
                    { icon: <ShieldCheck size={16} />, text: "Secure Payment" },
                    { icon: <Star size={16} />, text: "4.9/5 Rating" },
                    { icon: <Lock size={16} />, text: "Full Access" }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        <span className="text-zinc-300">{item.icon}</span>
                        {item.text}
                    </div>
                ))}
            </div>

            <div className="text-center mb-16 animate-in fade-in slide-in-from-top-8 duration-700">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-50 border border-zinc-100 text-black text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                    <Crown size={12} className="fill-current" /> Membership
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-black mb-6 tracking-tight leading-[1.1]">
                    Invest in your <span className="bg-black text-white px-2 rounded-lg">Pro Career</span>
                </h2>
                <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-semibold leading-relaxed">
                    Choose a path that fits your goals. One-time payment, lifetime access to world-class curriculum.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-32">
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

            {/* ── FAQ Section ── */}
            <div className="max-w-3xl mx-auto mb-32">
                <div className="text-center mb-16">
                    <h3 className="text-3xl font-black text-black mb-4 tracking-tight">Frequently Asked Questions</h3>
                    <p className="text-zinc-500 font-semibold">Everything you need to know about the PathToPro membership.</p>
                </div>
                <div className="space-y-4">
                    <FAQItem
                        question="Is the payment really one-time?"
                        answer="Yes! Once you purchase any of our pro plans, you get lifetime access to the content, including all future updates within that path."
                    />
                    <FAQItem
                        question="What happens after I pay?"
                        answer="You will receive an immediate confirmation, and all premium tracks, AI assistant features, and roadmaps will be instantly unlocked on your dashboard."
                    />
                    <FAQItem
                        question="Can I upgrade my plan later?"
                        answer="Absolutely. You can upgrade from 'Professional' to 'Career Master' at any time by just paying the difference."
                    />
                </div>
            </div>

            {/* ── Mentor CTA ── */}
            <div className="p-10 rounded-[40px] bg-black border border-white/10 relative overflow-hidden animate-in fade-in zoom-in-95 duration-1000 delay-500">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight uppercase">Still unsure?</h3>
                        <p className="text-zinc-400 font-semibold">Schedule a free 15-minute career consultation with our mentors.</p>
                    </div>
                    <button className="bg-white text-black px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-zinc-100 transition-all flex items-center gap-2">
                        Talk to Mentor <ArrowRight size={18} strokeWidth={3} />
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="absolute bottom-10 left-10 opacity-20 hidden lg:block">
                    <CreditCard size={120} className="text-white/10 -rotate-12" />
                </div>
            </div>
        </section>
    );
}
