"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

interface ChatBubbleProps {
  text: string;
  role: "user" | "ai";
}

// Split text by $$...$$ (block) or $...$ (inline)
const parseLatexSegments = (text: string) => {
  const segments: { content: string; isLatex: boolean }[] = [];
  let lastIndex = 0;

  const regex = /(\$\$[\s\S]+?\$\$|\$(?!\$)[\s\S]+?\$)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        content: text.slice(lastIndex, match.index),
        isLatex: false,
      });
    }
    segments.push({ content: match[0], isLatex: true });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ content: text.slice(lastIndex), isLatex: false });
  }

  return segments;
};

export default function ChatBubble({ text, role }: ChatBubbleProps) {
  const segments = parseLatexSegments(text);

  return (
    <div
      className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`px-3 py-2 rounded-xl max-w-xs text-sm whitespace-pre-wrap break-words ${
          role === "user"
            ? "bg-blue-600 text-white"
            : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        }`}
      >
        {segments.map((seg, i) =>
          seg.isLatex ? (
            <Latex key={i}>{seg.content}</Latex>
          ) : (
            <ReactMarkdown key={i} remarkPlugins={[remarkGfm]}>
              {seg.content}
            </ReactMarkdown>
          ),
        )}
      </div>
    </div>
  );
}
