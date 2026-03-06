"use client";

import React, { useState, useEffect, useRef } from "react";

type Message = { from: "user" | "bot"; text: string };

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function ChatbotOverlay({ open, onClose }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (open) {
            if (messages.length === 0) {
                setMessages([{ from: "bot", text: "Have doubt? Ask me anything about your courses." }]);
            }
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open, messages.length]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const send = async () => {
        if (!text.trim() || loading) return;
        const userMsg = text.trim();
        setMessages((m) => [...m, { from: "user", text: userMsg }]);
        setText("");
        setLoading(true);

        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://pathtopro-backend.onrender.com";
            const res = await fetch(`${apiBase}/api/chatbot/message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // if user token is required it needs to be attached or passed with credentials: 'include'
                body: JSON.stringify({ message: userMsg }),
            });

            if (!res.ok) {
                setMessages((m) => [
                    ...m,
                    { from: "bot", text: "AI service is temporarily unavailable. Please try again later." },
                ]);
            } else {
                const data = await res.json();
                setMessages((m) => [...m, { from: "bot", text: data?.data?.reply || data.reply || "No answer" }]);
            }
        } catch (err) {
            console.error(err);
            setMessages((m) => [
                ...m,
                { from: "bot", text: "AI service is temporarily unavailable. Please try again later." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-[1200] p-4"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="w-full max-w-3xl flex flex-col bg-[#0f1720] rounded-xl text-white shadow-2xl overflow-hidden"
                style={{ height: "70vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center px-5 py-4 border-b border-white/10 font-bold">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🤖</span>
                        <span>PathToPro Assistant</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-5 flex flex-col gap-4" ref={scrollRef}>
                    {messages.map((m, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col max-w-[80%] ${m.from === "user" ? "self-end items-end" : "self-start items-start"
                                }`}
                        >
                            <div
                                className={`py-2.5 px-4 rounded-2xl text-sm leading-relaxed ${m.from === "user"
                                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-sm"
                                        : "bg-white/5 text-gray-200 rounded-bl-sm border border-white/5"
                                    }`}
                            >
                                {m.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="self-start items-start flex flex-col max-w-[80%]">
                            <div className="py-2.5 px-4 rounded-2xl text-sm leading-relaxed bg-white/5 text-gray-200 rounded-bl-sm border border-white/5 flex gap-1 items-center">
                                <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-white/5 bg-white/5 flex gap-2">
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
                        placeholder="Ask anything about your courses..."
                        className="flex-1 bg-white/10 border-none outline-none text-white px-4 py-3 rounded-lg text-sm placeholder:text-gray-400 focus:bg-white/20 transition-colors"
                        disabled={loading}
                    />
                    <button
                        onClick={send}
                        disabled={loading || !text.trim()}
                        className="bg-purple-600 text-white border-none px-5 rounded-lg flex items-center justify-center font-bold text-lg hover:bg-purple-500 transition-colors disabled:opacity-50"
                    >
                        {loading ? "…" : "↵"}
                    </button>
                </div>
            </div>
        </div>
    );
}
