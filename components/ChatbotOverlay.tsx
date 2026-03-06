"use client";

import React, { useState, useEffect, useRef } from "react";

type Message = { id: string; from: "user" | "bot"; text: string };

type Props = {
    open: boolean;
    onClose: () => void;
};

const SUGGESTIONS = [
    "Show my progress",
    "How to mark complete",
    "Resume learning"
];

export default function ChatbotOverlay({ open, onClose }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (open) {
            if (messages.length === 0) {
                setMessages([{
                    id: 'init-msg',
                    from: "bot",
                    text: "Have doubt? Ask me anything — try: 'Resume learning', 'Show my progress', 'How to mark complete'."
                }]);
            }
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open, messages.length]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const send = async (overrideText?: string) => {
        const userMsg = (overrideText || text).trim();
        if (!userMsg || loading) return;

        setMessages((m) => [...m, { id: Date.now().toString(), from: "user", text: userMsg }]);
        setText("");
        setLoading(true);

        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://pathtopro-backend.onrender.com";
            const res = await fetch(`${apiBase}/api/chatbot/message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg }),
            });

            if (!res.ok) {
                setMessages((m) => [
                    ...m,
                    { id: Date.now().toString(), from: "bot", text: "AI service is temporarily unavailable. Please try again later." },
                ]);
            } else {
                const data = await res.json();
                setMessages((m) => [...m, { id: Date.now().toString(), from: "bot", text: data?.data?.reply || data.reply || "No answer" }]);
            }
        } catch (err) {
            console.error(err);
            setMessages((m) => [
                ...m,
                { id: Date.now().toString(), from: "bot", text: "AI service is temporarily unavailable. Please try again later." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        if (loading) return;
        setText(suggestion);
        inputRef.current?.focus();
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 flex justify-center z-[1200] p-4 pt-[6vh]"
            style={{ background: "rgba(10,10,10,0.98)" }}
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="w-full max-w-[980px] mx-auto flex flex-col bg-[#111111] border border-white/10 rounded-xl text-white shadow-2xl overflow-hidden relative"
                style={{ height: "70vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors z-10"
                    aria-label="Close"
                >
                    ✕
                </button>

                <div className="flex flex-col items-center justify-center p-8 border-b border-white/5">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl mb-3">
                        🤖
                    </div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
                        Ready when you are.
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 text-center max-w-md">
                        Ask me anything about your courses, lessons, or progress.
                    </p>

                    <div className="flex flex-wrap gap-2 justify-center mt-5">
                        {SUGGESTIONS.map(s => (
                            <button
                                key={s}
                                onClick={() => handleSuggestionClick(s)}
                                className="bg-white/5 border border-white/10 hover:bg-white/10 text-xs px-3 py-1.5 rounded-full transition-colors text-gray-300"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6 flex flex-col gap-5 bg-[#0a0a0a]" ref={scrollRef}>
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`flex flex-col max-w-[85%] ${m.from === "user" ? "self-end items-end" : "self-start items-start"
                                }`}
                        >
                            <div
                                className={`py-2.5 px-4 rounded-2xl text-[15px] leading-relaxed ${m.from === "user"
                                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-sm shadow-md"
                                        : "bg-[#18181b] text-gray-200 rounded-bl-sm border border-white/5"
                                    }`}
                            >
                                {m.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="self-start items-start flex flex-col max-w-[80%]">
                            <div className="py-2.5 px-4 rounded-2xl bg-[#18181b] text-gray-200 rounded-bl-sm border border-white/5 flex gap-1.5 items-center h-10">
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-[#111]">
                    <div className="relative max-w-4xl mx-auto flex items-center bg-[#1a1a1a] rounded-xl border border-white/5 focus-within:border-white/20 transition-colors">
                        <input
                            ref={inputRef}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    send();
                                }
                            }}
                            placeholder="Message PathToPro Assistant..."
                            className="flex-1 bg-transparent border-none outline-none text-white px-5 py-4 text-[15px] placeholder:text-gray-500"
                            disabled={loading}
                            aria-label="Chat input"
                        />
                        <button
                            onClick={() => send()}
                            disabled={loading || !text.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:hover:bg-white"
                            aria-label="Send message"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
