"use client";

import { Book, Bot, Lightbulb, Flag } from "lucide-react";

interface ActionButtonsProps {
  activeSelection: "note" | "chatbot" | "hint" | "report";
  setActiveSelection: (section: "note" | "chatbot" | "hint" | "report") => void;
}

export default function ActionButtons({
  activeSelection,
  setActiveSelection,
}: ActionButtonsProps) {
  const actions = [
    { icon: <Book size={16} />, label: "Note", key: "note" },
    { icon: <Bot size={16} />, label: "ChatBot", key: "chatbot" },
    { icon: <Lightbulb size={16} />, label: "Hint", key: "hint" },
    { icon: <Flag size={16} />, label: "Report", key: "report" },
  ] as const;

  return (
    <div className="overflow-x-auto overflow-y-hidden scrollbar-hide p-6 dark:bg-gray-900 rounded-2xl flex justify-between items-center">
      <div className="flex gap-5 flex-nowrap w-max">
        {actions.map((a) => (
          <button
            key={a.key}
            onClick={() => setActiveSelection(a.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-gray-600 hover:bg-blue-600 shrink-0 ${activeSelection === a.key ? "bg-blue-500 text-white border-blue-500" : "bg-white gray-600 hover:bg-blue-500 hover:text-white dark:bg-gray-800 dark:text-gray-300"}`}
          >
            {a.icon}
            <span className="text-sm">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
