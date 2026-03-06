"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * LMS Chatbot – Modern dark overlay AI assistant
 *
 * Behavior:
 * - Floating 💬 button (bottom-right) opens a centered modal overlay.
 * - Sends messages to backend AI endpoint.
 * - Quick-action buttons navigate safely.
 * - Persists conversation in sessionStorage.
 */

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
  actions?: { id: string; label: string; action: string }[];
};

const uid = () => Math.random().toString(36).slice(2, 9);

const QUICK_PROMPTS = [
  "Explain this topic",
  "Give a short summary",
  "How to mark complete",
  "What should I learn next?",
];

export default function LMSChatbot() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const raw = sessionStorage.getItem("lms_chat_messages");
      if (raw) return JSON.parse(raw) as Message[];
    } catch { }
    return [];
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem("lms_chat_messages", JSON.stringify(messages));
    } catch { }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const isAuthenticated = () => {
    try {
      return Boolean(localStorage.getItem("token"));
    } catch {
      return false;
    }
  };

  function pushMessage(m: Message) {
    setMessages((prev) => [...prev, m]);
  }

  function handleAction(action: string) {
    if (action === "login") {
      router.push("/login");
      return;
    }
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    switch (action) {
      case "subjects":
      case "resume":
      case "progress":
      default:
        router.push("/subjects");
        break;
    }
    pushMessage({ id: uid(), sender: "bot", text: "Done — taking you there now." });
  }

  async function sendToBackend(text: string) {
    setIsTyping(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://pathtopro-backend.onrender.com";
      const response = await fetch(`${apiBase}/api/chatbot/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      const reply = data?.data?.reply || "I couldn't generate a response.";
      pushMessage({ id: uid(), sender: "bot", text: reply });
    } catch {
      pushMessage({
        id: uid(),
        sender: "bot",
        text: "Connection error. Please try again.",
      });
    } finally {
      setIsTyping(false);
    }
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || isTyping) return;
    pushMessage({ id: uid(), sender: "user", text });
    setInput("");
    await sendToBackend(text);
  }

  return (
    <>
      {/* ── Floating Chat Button ── */}
      <button
        aria-label="Open PathToPro chat assistant"
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1100,
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg, #6366f1, #3b82f6)",
          color: "white",
          fontSize: 24,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
          transition: "transform 0.2s ease",
        }}
      >
        {open ? "✕" : "💬"}
      </button>

      {/* ── Chat Modal Overlay ── */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1200,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "6vh",
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setOpen(false)}
        >
          <div className="chatbot-modal" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="chatbot-header">
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="chatbot-avatar">🤖</div>
                <div>
                  <div className="chatbot-title">PathToPro AI Assistant</div>
                  <div className="chatbot-subtitle">
                    {isTyping ? "Thinking..." : "Your personal learning guide"}
                  </div>
                </div>
              </div>
              <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="chatbot-body" ref={scrollRef}>
              <div className="chatbot-context">
                💡 Ask me anything about your courses, lessons, or progress
              </div>

              {/* Starter (empty state) */}
              {messages.length === 0 && !isTyping && (
                <div className="chatbot-starter">
                  <h3>Ask me anything about this lesson</h3>
                  <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "14px" }}>
                    I can explain concepts, summarize topics, or help you with your learning path.
                  </p>
                  <div className="chatbot-suggestions">
                    {QUICK_PROMPTS.map((q) => (
                      <button
                        key={q}
                        className="suggestion-pill"
                        onClick={() => {
                          if (isTyping) return;
                          pushMessage({ id: uid(), sender: "user", text: q });
                          setInput("");
                          sendToBackend(q);
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.map((m) => (
                <div key={m.id}>
                  <div className={m.sender === "user" ? "user-message" : "assistant-message"}>
                    {m.text}
                  </div>
                  {/* Action buttons for bot messages */}
                  {m.sender === "bot" && m.actions && m.actions.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8, alignSelf: "flex-start" }}>
                      {m.actions.map((a) => (
                        <button
                          key={a.id}
                          className="suggestion-pill"
                          onClick={() => handleAction(a.action)}
                          style={{ fontSize: "12px", color: "#a78bfa" }}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="chatbot-typing">
                  <span>PathToPro Assistant is thinking</span>
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="chatbot-input-container">
              <input
                ref={inputRef}
                className="chatbot-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask anything about your courses..."
                disabled={isTyping}
              />
              <button
                className="send-button"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </div>

            {/* Footer */}
            <div style={{ textAlign: "center", padding: "0 0 12px", fontSize: "11px", color: "#333" }}>
              PathToPro Assistant · Course help only
            </div>
          </div>
        </div>
      )}
    </>
  );
}
