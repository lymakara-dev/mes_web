"use client";

import { useState } from "react";
import Latex from "react-latex-next";
import Image from "next/image";

import "katex/dist/katex.min.css";
import { Answer, QuestionCardProps } from "@/types/question-answer";

export default function QuestionCard({ question }: QuestionCardProps) {
  const [selected, setSelected] = useState<number>();
  const [isCorect, setIsCorrect] = useState<boolean | null>(null);

  if (!question) return <p>Loading...</p>;

  // Render question
  const renderQuestion = () => {
    switch (question.contentType) {
      case "LATEX":
        return <Latex>{`$$${question.content}$$`}</Latex>;
      case "IMAGE":
        return (
          <Image
            alt="Question"
            height={300}
            src={question.content!}
            width={300}
          />
        );
      case "VIDEO":
        return (
          <video controls className="w-full max-h-[400px] rounded">
            <source src={question.content} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      default:
        return question.content;
    }
  };

  // Render answer option
  const renderAnswer = (ans: Answer) => {
    if (ans.contentType === "LATEX") return <Latex>{ans.content}</Latex>;
    if (ans.contentType === "IMAGE")
      return <Image alt="answer" height={100} src={ans.content} width={100} />;

    return ans.content;
  };

  const toKhmerLetter = (num: number) => ["ក", "ខ", "គ", "ឃ", "ង"][num] || num;

  const handleSelect = (ans: Answer) => {
    setSelected(ans.id);
    setIsCorrect(ans.isCorrect);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 rounded-2xl p-4">
      <div>
        <div>{renderQuestion()}</div>
        {isCorect}
        <div className="answers mt-4 flex flex-col gap-3">
          {question.answers.map((ans: any, index) => (
            <button
              key={ans.id}
              className={`p-2 border rounded flex justify-start items-center ${
                selected === ans.id ? "bg-blue-100 border-blue-500" : ""
              }`}
              onClick={() => handleSelect(ans)}
            >
              <span className="w-6">{toKhmerLetter(index)}. </span>
              {renderAnswer(ans)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
