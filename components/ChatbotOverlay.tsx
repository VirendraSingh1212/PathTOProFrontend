"use client";

import React, { useState, useEffect, useRef } from "react";

type Message = { id: string; from: "user" | "bot"; text: string };

type Props = {
    open: boolean;
    onClose: () => void;
};

const SUGGESTIONS = [
    "Explain this topic",
    "Give a short summary",
    "Help me understand this concept",
    "What should I learn next?"
];

export default function ChatbotOverlay({ open, onClose }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

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
        send(suggestion);
    };

    if (!open) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                paddingTop: "6vh",
                zIndex: 1200,
                background: "rgba(0,0,0,0.85)",
                backdropFilter: "blur(4px)",
            }}
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            {/* Step 1 — Modal */}
            <div className="chatbot-modal" onClick={(e) => e.stopPropagation()}>

                {/* Step 2 — Header */}
                <div className="chatbot-header">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {/* Step 4 — Avatar */}
                        <div className="chatbot-avatar">🤖</div>
                        {/* Step 3 — Identity */}
                        <div>
                            <div className="chatbot-title">PathToPro AI Assistant</div>
                            <div className="chatbot-subtitle">
                                {loading ? "Thinking..." : "Your personal learning guide"}
                            </div>
                        </div>
                    </div>
                    {/* Step 5 — Close */}
                    <button className="chatbot-close" onClick={onClose} aria-label="Close">✕</button>
                </div>

                {/* Step 6 — Body */}
                <div className="chatbot-body" ref={scrollRef}>

                    {/* Step 9 — Context */}
                    <div className="chatbot-context">
                        💡 Ask me anything about your current lesson or course
                    </div>

                    {/* Step 7 — Starter (only when no messages) */}
                    {messages.length === 0 && !loading && (
                        <div className="chatbot-starter">
                            <h3>Ask me anything about this lesson</h3>
                            <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "14px" }}>
                                I can explain concepts, summarize topics, or help you understand tricky parts.
                            </p>
                            {/* Step 8 — Suggestions */}
                            <div className="chatbot-suggestions">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        className="suggestion-pill"
                                        onClick={() => handleSuggestionClick(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 13 — Messages */}
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={m.from === "user" ? "user-message" : "assistant-message"}
                        >
                            {m.text}
                        </div>
                    ))}

                    {/* Step 12 — Typing Indicator */}
                    {loading && (
                        <div className="chatbot-typing">
                            <span>PathToPro Assistant is thinking</span>
                            <span className="dot" />
                            <span className="dot" />
                            <span className="dot" />
                        </div>
                    )}
                </div>

                {/* Step 10 — Input */}
                <div className="chatbot-input-container">
                    <input
                        ref={inputRef}
                        className="chatbot-input"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                send();
                            }
                        }}
                        placeholder="Message PathToPro Assistant..."
                        disabled={loading}
                        aria-label="Chat input"
                    />
                    {/* Step 11 — Send */}
                    <button
                        className="send-button"
                        onClick={() => send()}
                        disabled={loading || !text.trim()}
                        aria-label="Send message"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="19" x2="12" y2="5" />
                            <polyline points="5 12 12 5 19 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
