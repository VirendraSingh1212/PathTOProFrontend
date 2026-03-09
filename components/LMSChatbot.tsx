"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, X, Send, Sparkles, User, Bot, ArrowRight, Square } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { ENDPOINTS } from "@/utils/api";
import ReactMarkdown from "react-markdown";


/**
 * Typewriter Component
 * Simulates real-time typing for bot messages
 */
const TypewriterText = ({ text, onComplete, isStopped }: { text: string; onComplete?: () => void, isStopped: boolean }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (isStopped) {
      if (onComplete) onComplete();
      return;
    }

    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 5); // Fast typing speed
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, onComplete, isStopped]);

  return (
    <div className={`prose prose-invert max-w-none text-sm leading-relaxed ${index < text.length && !isStopped ? "typing-cursor" : ""}`}>
      <ReactMarkdown>{displayedText}</ReactMarkdown>
    </div>
  );
};

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
  isNew?: boolean;
  isError?: boolean;
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
  const { isAuthenticated, authLoading } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = sessionStorage.getItem("lms_chat_messages");
        if (raw) return JSON.parse(raw) as Message[];
      } catch { }
    }
    return [];
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("lms_chat_messages", JSON.stringify(messages));
      } catch { }
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-chatbot", handleOpen);
    return () => window.removeEventListener("open-chatbot", handleOpen);
  }, []);


  // If not authenticated or loading, don't show the chatbot at all
  if (authLoading || !isAuthenticated) return null;

  function pushMessage(m: Message) {
    setMessages((prev) => [...prev, m]);
  }

  async function sendToBackend(text: string, isRetry = false) {
    const { accessToken } = useAuthStore.getState();
    setIsTyping(true);
    setIsStopped(false);

    // If it's a retry, we don't need to push the user message again
    if (!isRetry) {
      pushMessage({ id: uid(), sender: "user", text });
    }

    const performFetch = async (url: string) => {
      return await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { "Authorization": `Bearer ${accessToken}` })
        },
        credentials: "include",
        body: JSON.stringify({ message: text }),
      });
    };

    try {
      let response = await performFetch(ENDPOINTS.CHATBOT);

      // Robustness: Try with trailing slash if 404 (Render.com/Next.js routing quirk)
      if (response.status === 404 && !ENDPOINTS.CHATBOT.endsWith("/")) {
        response = await performFetch(`${ENDPOINTS.CHATBOT}/`);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      let reply = data?.data?.reply || data?.reply;

      // Detect the backend's "service unavailable" fallback string
      const isBackendFallback = reply && reply.toLowerCase().includes("service is temporarily unavailable");

      if (isBackendFallback || !reply) {
        throw new Error("AI_OFFLINE");
      }

      // Push bot message with isNew flag to trigger typewriter
      pushMessage({ id: uid(), sender: "bot", text: reply, isNew: true });
    } catch (err) {
      const isOffline = err instanceof Error && err.message === "AI_OFFLINE";
      const errorMessage = isOffline
        ? "The AI service is currently deep in thought (or offline). Would you like to try again?"
        : `Connection lost (${err instanceof Error ? err.message : "Error"}). Please try again.`;

      pushMessage({
        id: uid(),
        sender: "bot",
        text: errorMessage,
        isNew: true,
        isError: true
      });
    } finally {
      setIsTyping(false);
    }
  }


  async function handleSend() {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput("");
    await sendToBackend(text);
  }


  return (
    <>
      {/* ── Side Chat Tab (Vertical) ── */}
      <div className="fixed right-0 top-[45%] z-[1100] translate-y-[-50%] animate-in slide-in-from-right duration-700">
        {!open && (
          <button
            aria-label="Open ProChat AI assistant"
            onClick={() => setOpen(true)}
            className="flex flex-col items-center gap-4 bg-blue-600 text-white pt-6 pb-4 px-3 rounded-l-[24px] shadow-[-10px_0_30px_rgba(37,99,235,0.2)] hover:pl-5 transition-all duration-300 group relative border-y border-l border-blue-400/30"
          >
            {/* Ambient Pulse */}
            <div className="absolute inset-0 bg-blue-500 rounded-l-[24px] animate-pulse opacity-20 -z-10 group-hover:scale-105 transition-transform" />

            <span className="[writing-mode:vertical-lr] rotate-180 font-black tracking-[0.2em] text-[10px] uppercase opacity-90 group-hover:opacity-100 transition-opacity">
              ProChat AI
            </span>

            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white shadow-inner flex items-center justify-center p-0.5 group-hover:scale-110 transition-transform duration-300 border border-white/20">
              <img
                src="/chatbot-avatar.png"
                alt="AI Assistant"
                className="w-full h-full object-contain filter drop-shadow-sm"
              />
            </div>

            {/* Micro-Interaction: Indicator Dot */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
          </button>
        )}
      </div>

      {/* ── Chat Modal Overlay ── */}
      {open && (
        <div
          className="fixed inset-0 z-[1200] flex items-start justify-center pt-[6vh] bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setOpen(false)}
        >
          <div
            className="chatbot-modal bg-[#0b0b0b] border border-[#1f1f1f] shadow-[0_32px_64px_rgba(0,0,0,0.6)] animate-in slide-in-from-bottom-8 duration-500"
            onClick={(e) => e.stopPropagation()}
            style={{ width: '850px', maxWidth: '95vw', height: '650px' }}
          >

            {/* Header */}
            <div className="flex items-center justify-between p-7 border-b border-[#1f1f1f] bg-black/40 backdrop-blur-sm">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-white border border-zinc-800 shadow-2xl">
                  <img src="/chatbot-avatar-dark.png" className="w-8 h-8 object-contain" alt="ProChat Logo" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight uppercase">ProChat AI</h2>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                      {isTyping ? "Synthesizing..." : "Active Intelligence"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-zinc-800 hover:text-white transition-all duration-300"
                onClick={() => setOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="chatbot-body flex-1 p-8 overflow-y-auto flex flex-col gap-6" ref={scrollRef}>

              {/* Context/Tip */}
              <div className="bg-[#111] border border-[#1f1f1f] p-4 rounded-xl text-xs text-gray-400 flex items-start gap-3">
                <span className="text-base">💡</span>
                <p>You can ask about lesson summaries, technical concepts, or your career roadmap. I&apos;m here to guide your professional journey.</p>
              </div>

              {/* Starter State */}
              {messages.length === 0 && !isTyping && (
                <div className="py-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h3 className="text-xl font-black text-white mb-2">How can I help you today?</h3>
                  <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">Select a quick topic or type your query below to start a conversation with our AI.</p>
                  <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
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

              {/* Messages Container */}
              <div className="flex flex-col gap-6">
                {messages.map((m, idx) => (
                  <div key={m.id} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      {m.sender === "bot" ? (
                        <>
                          <Bot size={12} className="text-gray-500" />
                          <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-500">PathToPro AI</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-500">You</span>
                          <User size={12} className="text-gray-500" />
                        </>
                      )}
                    </div>

                    <div className={m.sender === "user" ? "user-message" : "assistant-message"}>
                      {m.sender === "bot" && m.isNew ? (
                        <>
                          <TypewriterText
                            text={m.text}
                            isStopped={isStopped}
                            onComplete={() => {
                              // Clear isNew flag once typing is finished
                              setMessages(prev => prev.map(msg =>
                                msg.id === m.id ? { ...msg, isNew: false } : msg
                              ));
                            }}
                          />
                        </>
                      ) : m.sender === "bot" ? (
                        <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                          <ReactMarkdown>{m.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                      )}

                      {/* Retry Button for Errors */}
                      {m.isError && !isTyping && (
                        <div className="mt-4 pt-4 border-t border-[#1f1f1f]">
                          <button
                            onClick={() => {
                              const lastUserMsg = [...messages].reverse().find(msg => msg.sender === "user");
                              if (lastUserMsg) {
                                sendToBackend(lastUserMsg.text, true);
                              }
                            }}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:text-gray-300 transition-colors"
                          >
                            <ArrowRight size={12} className="rotate-180" />
                            Retry Request
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-3 p-4 bg-[#111] border border-[#1f1f1f] rounded-xl w-fit animate-pulse">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                  </div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Bot is thinking...</span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-[#1f1f1f] bg-[#0b0b0b]">
              <div className="relative flex items-center">
                <input
                  ref={inputRef}
                  className="w-full bg-[#111] border border-[#1f1f1f] rounded-2xl py-4 pl-6 pr-14 text-sm text-white focus:outline-none focus:border-white transition-all placeholder:text-gray-600"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Describe what you want to learn..."
                  disabled={isTyping}
                />

                <div className="absolute right-3 flex items-center gap-2">
                  {/* Stop Button - ONLY SHOWS WHEN TYPING */}
                  {isTyping && !isStopped && (
                    <button
                      className="p-2.5 bg-[#1a1a1a] border border-[#333] text-red-400 rounded-xl hover:bg-[#2a2a2a] hover:text-red-300 hover:scale-105 active:scale-95 transition-all"
                      onClick={() => setIsStopped(true)}
                      title="Stop generating"
                    >
                      <Square size={18} className="fill-current" />
                    </button>
                  )}

                  {/* Send Button */}
                  <button
                    className="p-2.5 bg-white text-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                  >
                    <Send size={18} />
                  </button>
                </div>

              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">AI Engine Online · Verified Response System</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
