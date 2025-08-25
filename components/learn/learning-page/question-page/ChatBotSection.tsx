"use client";

import { Send, Paperclip } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChatBubble from "./ChatBubble";

export default function ChatBotSection() {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([{ role: "ai", text: "Hi, how can I help you today?" }]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message immediately
    const newMessages = [...messages, { role: "user" as const, text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      // Send request to API route
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();

      // Add AI reply
      setMessages([
        ...newMessages,
        { role: "ai", text: data.text || "⚠️ No response" },
      ]);
    } catch (err) {
      console.error("Error talking to Gemini:", err);
      setMessages([
        ...newMessages,
        { role: "ai", text: "⚠️ Error: could not get response" },
      ]);
    }
  };

  return (
    <div className="bg-gray-100 h-96 flex flex-col justify-start rounded-2xl p-4 dark:bg-gray-900">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <ChatBubble key={i} text={msg.text} role={msg.role} />
        ))}
      </div>

      {/* Input box */}
      <div className="flex items-center bg-white rounded-xl shadow-sm p-2 dark:bg-gray-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-2 py-2 break-all focus:outline-none text-sm dark:bg-gray-800"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Paperclip className="w-5 h-5 text-gray-400 cursor-pointer mr-2" />
        <button
          onClick={sendMessage}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Send size={16} /> <span className="max-md:hidden">Send</span>
        </button>
      </div>
    </div>
  );
}
