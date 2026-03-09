"use client";

import React from "react";
import { Lock, Crown, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LockedContentOverlay() {
    const router = useRouter();

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 text-center">
            {/* Premium Blur Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[12px]" />

            {/* Content Container */}
            <div className="relative z-10 max-w-md w-full bg-white/10 backdrop-blur-xl border border-white/20 p-10 rounded-[40px] shadow-2xl animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/40 animate-bounce-subtle">
                    <Lock size={40} className="text-white" strokeWidth={2.5} />
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                    <Crown size={12} className="fill-current" /> Premium Lesson
                </div>

                <h2 className="text-3xl font-black text-white mb-4 tracking-tight">
                    Unlock Masterclass content
                </h2>

                <p className="text-blue-100/70 font-medium mb-10 leading-relaxed text-sm">
                    Join PathToPro Career Master to unlock this lesson and 50+ hours of advanced engineering content.
                </p>

                <button
                    onClick={() => router.push('/pricing')}
                    className="w-full py-5 bg-white text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-black/20 group active:scale-95"
                >
                    View Plans <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="mt-6 text-[11px] font-bold text-white/40 uppercase tracking-widest">
                    ONE-TIME PAYMENT • LIFETIME ACCESS
                </p>
            </div>

            <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}
