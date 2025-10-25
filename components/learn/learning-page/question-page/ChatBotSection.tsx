"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import ChatBubble from "./ChatBubble"; // Assuming this component takes role and text props
import { useMutation } from "@tanstack/react-query";
import { InitiateChatPayload, SendMessagePayload } from "@/types/learn-type"; // Assuming these types are correct
import apiService from "@/service/api";

interface ChatBotSectionProps {
  questionId: number; // Assuming questionId is a string (UUID) based on backend DTOs
}

// Interface for messages displayed in the UI
interface Message {
  role: "user" | "model" | "system";
  content: string;
}

// Define expected response types from your API functions
interface InitiateChatResponse {
  firstMessage: string;
}
interface SendMessageResponse {
  response: string;
}

// --- API Call Functions (could be moved to a separate api/chatApi.ts file) ---
const initiateChatApi = async (
  payload: InitiateChatPayload,
): Promise<InitiateChatResponse> => {
  const { data } = await apiService.post("/chat/initiate", payload);
  return data;
};

const sendMessageApi = async (
  payload: SendMessagePayload,
): Promise<SendMessageResponse> => {
  const { data } = await apiService.post("/chat/send", payload);
  return data;
};
// --- End API Call Functions ---

export default function ChatBotSection({ questionId }: ChatBotSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isChatReady, setIsChatReady] = useState(false); // Controls if user can send messages
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // --- React Query Mutations (defined at the top level) ---
  const initiateChatMutation = useMutation({
    mutationFn: initiateChatApi,
    onSuccess: (data) => {
      // Add the AI's first greeting and enable the chat input
      setMessages([{ role: "model", content: data.firstMessage }]);
      setIsChatReady(true);
      console.log("Chat initiated.");
    },
    onError: (error) => {
      console.error("Error initiating chat:", error);
      setMessages([
        {
          role: "system",
          content: "Error connecting to the tutor. Please try refreshing.",
        },
      ]);
      setIsChatReady(false); // Keep chat disabled on error
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: sendMessageApi,
    onSuccess: (data) => {
      // Add the AI's response to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "model", content: data.response },
      ]);
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "system", content: "Error: Could not get response." },
      ]);
    },
  });
  // --- End Mutations ---

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, initiateChatMutation.isPending, sendMessageMutation.isPending]);

  // Initiate chat when the component mounts or questionId changes
  useEffect(() => {
    if (questionId) {
      console.log(`Initiating chat for questionId: ${questionId}`);
      setMessages([{ role: "system", content: "Connecting to tutor..." }]);
      setIsChatReady(false); // Disable input while connecting
      initiateChatMutation.mutate({ questionId }); // Trigger initiation
    }
    // Optional: Cleanup function if needed when component unmounts or questionId changes before finishing
    return () => {
      // You might want to reset mutation state if navigating away quickly,
      // though react-query often handles this well.
      // initiateChatMutation.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]); // Rerun effect if questionId changes

  // Handle sending a message
  const handleSendMessage = () => {
    if (
      !input.trim() ||
      !isChatReady ||
      sendMessageMutation.isPending ||
      initiateChatMutation.isPending
    )
      return;

    // Add user message immediately (Optimistic UI update)
    const userMessage: Message = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Send message to the backend via mutation
    sendMessageMutation.mutate({ message: input });

    setInput(""); // Clear input field
  };

  // Determine overall loading state
  const isLoading =
    initiateChatMutation.isPending || sendMessageMutation.isPending;

  return (
    <div className="bg-gray-100 h-96 flex flex-col justify-start rounded-2xl p-4 dark:bg-gray-900">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {" "}
        {/* Added pr-2 for scrollbar */}
        {messages.map((msg, i) => (
          // *** Ensure ChatBubble expects 'role' and 'content' or adjust props ***
          <ChatBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {/* Loading indicator using mutation state */}
        {isLoading && <ChatBubble role="system" content="Thinking..." />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="flex items-center bg-white rounded-xl shadow-sm p-2 dark:bg-gray-800">
        <input
          className="flex-1 px-2 py-2 break-all focus:outline-none text-sm dark:bg-gray-800 dark:text-white"
          placeholder="Type your message..."
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          // Send on Enter key press
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              // Prevent send on Shift+Enter
              e.preventDefault(); // Prevent newline in input
              handleSendMessage();
            }
          }}
          // Disable input if not ready or loading
          disabled={!isChatReady || isLoading}
        />
        {/* <Paperclip className="w-5 h-5 text-gray-400 cursor-pointer mr-2" /> */}
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSendMessage}
          // Disable button if not ready or loading
          disabled={!isChatReady || isLoading || !input.trim()}
        >
          <Send size={16} /> <span className="max-md:hidden">Send</span>
        </button>
      </div>
    </div>
  );
}
