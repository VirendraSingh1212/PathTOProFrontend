"use client";

import { useState } from "react";

export default function LMSChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I'm the PathToPro assistant. Ask me about courses or lessons."
    }
  ]);
  const [input, setInput] = useState("");

  function getBotResponse(message: string) {
    const msg = message.toLowerCase();

    if (msg.includes("course") || msg.includes("subjects")) {
      return "You can explore all courses from the Subjects page.";
    }

    if (msg.includes("progress")) {
      return "Your learning progress updates when you mark lessons complete.";
    }

    if (msg.includes("lesson")) {
      return "Select a lesson from the sidebar to start watching the video.";
    }

    if (msg.includes("hello") || msg.includes("hi")) {
      return "Hello! I'm here to help you navigate PathToPro.";
    }

    return "I'm here to help with courses, lessons, and progress tracking.";
  }

  function sendMessage() {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input
    };

    const botMessage = {
      sender: "bot",
      text: getBotResponse(input)
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInput("");
  }

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-2xl"
        >
          💬
        </button>
      </div>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white shadow-xl rounded-lg flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex items-center justify-between">
            <span className="font-semibold text-sm">PathToPro Assistant</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-gray-200 text-xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "text-right"
                    : "text-left"
                }
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg text-sm max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-2 flex bg-white rounded-b-lg">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
