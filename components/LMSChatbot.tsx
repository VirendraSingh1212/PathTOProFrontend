"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * LMS Chatbot – ChatGPT-style full-screen dark UI (Stage 3)
 *
 * Behavior:
 * - Floating 💬 button (bottom-right) opens a centered full-screen dark overlay.
 * - Matches user messages against keyword-based intent rules.
 * - Offers quick-action buttons below bot responses.
 * - Quick actions navigate safely: if not logged in (no token), redirects to /login.
 * - Persists conversation in sessionStorage.
 */

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
  actions?: { id: string; label: string; action: string }[];
};

const INTENTS: {
  keywords: string[];
  response: string;
  actions?: { id: string; label: string; action: string }[];
}[] = [
    {
      keywords: ["course", "courses", "subjects", "catalog"],
      response:
        "You can browse all available courses on the Subjects page. Select a subject to see sections and lessons.",
      actions: [{ id: "go_subjects", label: "Go to Subjects →", action: "subjects" }],
    },
    {
      keywords: ["progress", "progress bar", "completed", "completion"],
      response:
        "Progress is tracked when you mark lessons complete. Open a subject and click 'Mark as Complete' on each lesson.",
      actions: [{ id: "go_subjects", label: "View Subjects →", action: "subjects" }],
    },
    {
      keywords: ["lesson", "lessons", "play", "video"],
      response:
        "Open any subject and click a lesson from the left sidebar to start the video. Use the Next button to go forward.",
      actions: [{ id: "go_subjects", label: "Open Subjects →", action: "subjects" }],
    },
    {
      keywords: ["mark complete", "mark as complete", "complete"],
      response:
        "Use the 'Mark as Complete' button below the video to mark a lesson finished. This updates your course progress.",
    },
    {
      keywords: ["resume", "continue", "where i left", "last lesson"],
      response:
        "To resume, use the Continue / Resume feature on the course card or click the button below.",
      actions: [{ id: "resume", label: "Resume Learning →", action: "resume" }],
    },
    {
      keywords: ["login", "sign in", "register", "signup", "sign up"],
      response:
        "If you are not logged in, please sign in or register to access courses and save progress.",
      actions: [{ id: "login", label: "Login / Register →", action: "login" }],
    },
    {
      keywords: ["help", "support", "assist"],
      response:
        "I can help you find courses, explain how progress works, and navigate to lessons. Try: 'show courses', 'how to mark complete', or 'resume learning'.",
    },
  ];

function detectIntent(text: string) {
  const clean = text.toLowerCase();
  for (const intent of INTENTS) {
    for (const kw of intent.keywords) {
      if (clean.includes(kw)) return intent;
    }
  }
  return null;
}

const uid = () => Math.random().toString(36).slice(2, 9);

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

  // Focus input when chat opens
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

  function handleSend() {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: uid(), sender: "user", text };
    pushMessage(userMsg);
    setInput("");
    setIsTyping(true);

    const intent = detectIntent(text);

    setTimeout(() => {
      if (intent) {
        pushMessage({
          id: uid(),
          sender: "bot",
          text: intent.response,
          actions: intent.actions?.map((a) => ({ ...a })),
        });
      } else {
        pushMessage({
          id: uid(),
          sender: "bot",
          text: "I didn't fully understand. Try: 'show courses', 'how to mark complete', or 'resume learning'.",
          actions: [{ id: "go_subjects", label: "Show Courses →", action: "subjects" }],
        });
      }
      setIsTyping(false);
    }, 500);
  }

  const QUICK_PROMPTS = [
    "Show courses",
    "How progress works",
    "How to mark complete",
    "Resume learning",
  ];

  /* ─── TAILWIND NOTE ────────────────────────────────────────────────────
     The component uses only core Tailwind utilities that are already
     generated in your project via @tailwind base/components/utilities.
     No new config changes are needed.
  ─────────────────────────────────────────────────────────────────────── */

  return (
    <>
      {/* ── Floating Chat Button ── */}
      <button
        aria-label="Open PathToPro chat assistant"
        onClick={() => setOpen((o) => !o)}
        style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl
                   flex items-center justify-center text-white text-2xl
                   hover:scale-110 active:scale-95 transition-transform duration-200"
      >
        {open ? "✕" : "💬"}
      </button>

      {/* ── Full-Screen Chat Overlay ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col"
          style={{ background: "#0d0d0d" }}
        >
          {/* ── Header ── */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: "#1f1f1f" }}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
              >
                🤖
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">PathToPro Assistant</p>
                <p className="text-xs mt-0.5" style={{ color: "#a3a3a3" }}>
                  {isTyping ? "Typing…" : "Online"}
                </p>
              </div>
            </div>

            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center
                         text-white text-sm hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* ── Message Area ── */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-6"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}
          >
            <div className="max-w-2xl mx-auto space-y-5">

              {/* Empty state */}
              {messages.length === 0 && !isTyping && (
                <div className="flex flex-col items-center justify-center h-full pt-24 gap-6 text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                    style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
                  >
                    🤖
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-2">
                      Ready when you are.
                    </h2>
                    <p style={{ color: "#737373" }} className="text-sm">
                      Ask me anything about your courses, lessons, or progress.
                    </p>
                  </div>

                  {/* Quick prompts in empty state */}
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {QUICK_PROMPTS.map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setInput(q);
                          setTimeout(() => {
                            const text = q.trim();
                            if (!text) return;
                            pushMessage({ id: uid(), sender: "user", text });
                            setIsTyping(true);
                            const intent = detectIntent(text);
                            setTimeout(() => {
                              if (intent) {
                                pushMessage({
                                  id: uid(),
                                  sender: "bot",
                                  text: intent.response,
                                  actions: intent.actions?.map((a) => ({ ...a })),
                                });
                              } else {
                                pushMessage({
                                  id: uid(),
                                  sender: "bot",
                                  text: "I didn't fully understand. Try: 'show courses', 'how to mark complete', or 'resume learning'.",
                                  actions: [{ id: "go_subjects", label: "Show Courses →", action: "subjects" }],
                                });
                              }
                              setIsTyping(false);
                              setInput("");
                            }, 500);
                          }, 0);
                        }}
                        className="px-4 py-2 rounded-full text-sm border hover:bg-white/5 transition-colors"
                        style={{ borderColor: "#292929", color: "#d4d4d4" }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold"
                    style={
                      m.sender === "bot"
                        ? { background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", color: "#fff" }
                        : { background: "#1f1f1f", color: "#a3a3a3" }
                    }
                  >
                    {m.sender === "bot" ? "🤖" : "👤"}
                  </div>

                  <div className={`flex flex-col gap-2 max-w-[75%] ${m.sender === "user" ? "items-end" : "items-start"}`}>
                    {/* Bubble */}
                    <div
                      className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                      style={
                        m.sender === "user"
                          ? { background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", color: "#fff", borderBottomRightRadius: 4 }
                          : { background: "#1a1a1a", color: "#e5e5e5", borderBottomLeftRadius: 4, border: "1px solid #262626" }
                      }
                    >
                      {m.text}
                    </div>

                    {/* Action buttons for bot messages */}
                    {m.sender === "bot" && m.actions && m.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {m.actions.map((a) => (
                          <button
                            key={a.id}
                            onClick={() => handleAction(a.action)}
                            className="text-xs px-3 py-1.5 rounded-full border
                                       hover:bg-indigo-500/10 hover:border-indigo-500/60
                                       transition-colors"
                            style={{ borderColor: "#404040", color: "#a78bfa" }}
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm"
                    style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
                  >
                    🤖
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl flex items-center gap-1"
                    style={{ background: "#1a1a1a", border: "1px solid #262626", borderBottomLeftRadius: 4 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: "#6366f1",
                          display: "inline-block",
                          animation: `bounce 1.2s infinite`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Input Bar ── */}
          <div
            className="px-4 pb-6 pt-3"
            style={{ borderTop: "1px solid #1f1f1f" }}
          >
            <div className="max-w-2xl mx-auto">
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask anything about your courses..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-600"
                  style={{ color: "#e5e5e5" }}
                  disabled={isTyping}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-9 h-9 rounded-xl flex items-center justify-center
                             text-white text-sm font-medium transition-all
                             disabled:opacity-30 disabled:cursor-not-allowed
                             hover:scale-105 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
                  aria-label="Send message"
                >
                  ↑
                </button>
              </div>
              <p className="text-center text-xs mt-2" style={{ color: "#404040" }}>
                PathToPro Assistant · Course help only
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bounce keyframes for typing dots */}
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%            { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
