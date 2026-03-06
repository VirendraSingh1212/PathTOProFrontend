"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Rule-based LMS Chatbot (Stage 2)
 *
 * Behavior:
 * - Matches user message against simple keyword rules (intents).
 * - Returns canned responses and offers quick action buttons.
 * - Quick actions navigate safely: if not logged in (no token), navigate to /login first.
 *
 * Safety: Frontend-only, no backend changes.
 */

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
  // optional action buttons for this message
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
    actions: [{ id: "go_subjects", label: "Go to Subjects", action: "subjects" }],
  },
  {
    keywords: ["progress", "progress bar", "completed", "completion"],
    response:
      "Progress is tracked when you mark lessons complete. Open a subject and click 'Mark as Complete' on each lesson.",
    actions: [{ id: "go_subjects", label: "View Subjects", action: "subjects" }],
  },
  {
    keywords: ["lesson", "lessons", "play", "video"],
    response:
      "Open any subject and click a lesson from the left sidebar to start the video. Use the Next button to go forward.",
    actions: [{ id: "go_subjects", label: "Open Subjects", action: "subjects" }],
  },
  {
    keywords: ["mark complete", "mark as complete", "complete"],
    response:
      "Use the 'Mark as Complete' button below the video to mark a lesson finished. This updates your course progress.",
  },
  {
    keywords: ["resume", "continue", "where i left", "last lesson"],
    response:
      "To resume, use the Continue / Resume feature on the course card or click the Resume button below.",
    actions: [{ id: "resume", label: "Resume Learning", action: "resume" }],
  },
  {
    keywords: ["login", "sign in", "register", "signup", "sign up"],
    response:
      "If you are not logged in, please sign in or register to access courses and save progress.",
    actions: [{ id: "login", label: "Login / Register", action: "login" }],
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
      if (clean.includes(kw)) {
        return intent;
      }
    }
  }
  return null;
}

// Helper: small UID for messages
const uid = () => Math.random().toString(36).slice(2, 9);

export default function LMSChatbot() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => {
    // load from sessionStorage if exists for small persistence
    try {
      const raw = sessionStorage.getItem("lms_chat_messages");
      if (raw) return JSON.parse(raw) as Message[];
    } catch {}
    return [
      {
        id: uid(),
        sender: "bot",
        text: "Hi — I'm PathToPro Assistant. Ask about courses, lessons, or progress.",
      },
    ];
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem("lms_chat_messages", JSON.stringify(messages));
    } catch {}
    // scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Safe check for authentication token in localStorage.
  // Adjust key if your app uses a different name. This is a non-invasive read only.
  const isAuthenticated = () => {
    try {
      const token = localStorage.getItem("token");
      return Boolean(token);
    } catch {
      return false;
    }
  };

  function pushMessage(m: Message) {
    setMessages((prev) => [...prev, m]);
  }

  function handleAction(action: string) {
    // All navigation decisions are client-side only and safe.
    // If the user is not authenticated, navigate to /login.
    if (action === "login") {
      router.push("/login");
      return;
    }

    if (!isAuthenticated()) {
      // require login for protected actions
      router.push("/login");
      return;
    }

    switch (action) {
      case "subjects":
        router.push("/subjects");
        break;
      case "resume":
        // Best-effort resume: navigate to /subjects — the app should show continue option.
        // Optional: if you have an endpoint to get lastLessonId, you could call it here.
        router.push("/subjects");
        break;
      case "progress":
        router.push("/subjects");
        break;
      default:
        // fallback: open subjects
        router.push("/subjects");
        break;
    }
    // also show a bot confirmation message
    pushMessage({
      id: uid(),
      sender: "bot",
      text: "Done — taking you there now.",
    });
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: uid(), sender: "user", text };
    pushMessage(userMsg);
    setInput("");

    // Find intent
    const intent = detectIntent(text);

    if (intent) {
      const botMsg: Message = {
        id: uid(),
        sender: "bot",
        text: intent.response,
        actions: intent.actions?.map((a) => ({ ...a })),
      };
      // small delay to feel natural
      setTimeout(() => pushMessage(botMsg), 300);
    } else {
      // default fallback
      setTimeout(
        () =>
          pushMessage({
            id: uid(),
            sender: "bot",
            text:
              "I didn't fully understand. Try: 'show courses', 'how to mark complete', or 'resume learning'.",
            actions: [{ id: "go_subjects", label: "Show Courses", action: "subjects" }],
          }),
        300
      );
    }
  }

  // quick pre-built message buttons (optional)
  const QUICK_PROMPTS = [
    "Show courses",
    "How progress works",
    "How to mark complete",
    "Resume learning",
  ];

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          aria-label="Open chat"
          onClick={() => setOpen((o) => !o)}
          className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-700"
        >
          💬
        </button>
      </div>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-[420px] bg-white shadow-xl rounded-lg flex flex-col z-50">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex items-center justify-between">
            <div className="font-medium">PathToPro Assistant</div>
            <button
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="text-white opacity-80 hover:opacity-100"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={m.sender === "user" ? "text-right" : "text-left"}>
                <div
                  className={
                    m.sender === "user"
                      ? "inline-block bg-blue-600 text-white px-3 py-2 rounded-lg text-sm"
                      : "inline-block bg-gray-100 text-gray-900 px-3 py-2 rounded-lg text-sm"
                  }
                >
                  {m.text}
                </div>

                {/* If the bot message has actions, show them below the message */}
                {m.sender === "bot" && m.actions && m.actions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.actions.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => handleAction(a.action)}
                        className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border rounded"
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick prompts */}
          <div className="p-2 border-t flex gap-2 overflow-x-auto">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                onClick={() => {
                  setInput(q);
                  // emulate user pressing send for convenience
                  setTimeout(() => handleSend(), 50);
                }}
                className="text-xs px-2 py-1 bg-gray-100 rounded"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="p-2 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Ask about courses or progress..."
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-blue-600 text-white px-3 rounded text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
