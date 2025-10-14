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

  console.log("question type", question);

  // Render question
  const renderQuestion = () => {
    switch (question.contentType) {
      case "LATEX":
        return <Latex>{question.content}</Latex>;
      case "IMAGE":
        return (
          <Image
            alt="Question"
            height={500}
            src={question.content!}
            width={500}
            className="w-full h-auto"
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
  const renderAnswer = (ans: Answer, index: number) => {
    if (ans.contentType === "LATEX") return <Latex>{`${ans.content}`}</Latex>;
    if (ans.contentType === "IMAGE")
      return (
        <Image
          alt="answer"
          src={`${ans.content!}`}
          width={0}
          height={0}
          className="w-full max-w-[150px] h-auto object-contain"
          unoptimized
        />
      );

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
        <div className="answers mt-4 flex flex-col gap-3">
          {question.answers.map((ans: any, index) => (
            <button
              key={ans.id}
              className={`p-4 border h-24 rounded-xl text-lg flex justify-start items-center transition-all duration-200 ${
                selected === ans.id
                  ? "bg-blue-100 border-blue-500"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => handleSelect(ans)}
            >
              <span className="w-6">{toKhmerLetter(index)}.</span>
              <span className="ml-2">{renderAnswer(ans, index)} </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
