"use client";

import { useState } from "react";
import { Answer, QuestionCardProps } from "@/types/question";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

export default function QuestionCard({ question }: QuestionCardProps) {
  const [selected, setSelected] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  if (!question) return <p>Loading...</p>;

  // Render question
  const renderQuestion = () => {
    if (
      question.questionType === "latex" ||
      question.questionType === "mixed"
    ) {
      return <Latex>{question.question}</Latex>;
    }
    if (question.questionType === "image") {
      return <img src={question.questionImage!} alt="Question" />;
    }
    return question.question;
  };

  // Render answer option
  const renderAnswer = (ans: Answer) => {
    if (ans.type === "latex") return <Latex>{ans.content}</Latex>;
    if (ans.type === "image") return <img src={ans.content} alt="answer" />;
    return ans.content;
  };

  const toKhmerLetter = (num: number) => ["ក", "ខ", "គ", "ឃ", "ង"][num] || num;

  const handleSelect = (ans: Answer) => {
    setSelected(ans.id);
    setIsCorrect(ans.isCorrect);
    console.log(ans.isCorrect);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 rounded-2xl p-4">
      <div>
        <div>{renderQuestion()}</div>

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
