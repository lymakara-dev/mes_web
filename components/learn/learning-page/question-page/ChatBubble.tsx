"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

interface ChatBubbleProps {
  role: "user" | "model" | "system";
  content: string; // <-- Prop is named 'content'
}

// Split text by $$...$$ (block) or $...$ (inline)
const parseLatexSegments = (text: string) => {
  // ... (this function seems correct)
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


// FIX: Destructure 'content' instead of 'text' to match the interface
export default function ChatBubble({ content, role }: ChatBubbleProps) {
  // FIX: Pass 'content' to the parsing function
  const segments = parseLatexSegments(content);

  // Handle system messages with slightly different styling if desired
  const isSystem = role === "system";
  const bubbleClasses = isSystem
    ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs italic text-center mx-auto" // Example system styling
    : role === "user"
    ? "bg-blue-600 text-white"
    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white";
  const alignmentClass = isSystem
    ? "justify-center"
    : role === "user"
    ? "justify-end"
    : "justify-start";


  return (
    <div className={`flex ${alignmentClass} my-1`}> {/* Added my-1 for spacing */}
      <div
        className={`px-3 py-2 rounded-xl max-w-md text-sm whitespace-pre-wrap break-words ${bubbleClasses}`} // Increased max-w
      >
        {/* Render segments */}
        {segments.map((seg, i) =>
          seg.isLatex ? (
            <Latex key={i}>{seg.content}</Latex>
          ) : (
            // Added inline paragraph for markdown to render correctly within div
            <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} components={{ p: React.Fragment }}>
              {seg.content}
            </ReactMarkdown>
          )
        )}
      </div>
    </div>
  );
}