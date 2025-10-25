"use client";

import { useState, useEffect } from "react";
import Latex from "react-latex-next";
import Image from "next/image";
import "katex/dist/katex.min.css";
import { IAnswer, IQuestionAnswer } from "@/types/learn-type";

interface EnhancedQuestionCardProps {
  question: IQuestionAnswer;
  onNext: () => void;
  onSubmitAnswer: (isCorrect: boolean) => void;
  setCanGoNext: (canGoNext: boolean) => void;
}

export default function QuestionCard({
  question,
  onNext,
  onSubmitAnswer,
  setCanGoNext,
}: EnhancedQuestionCardProps) {
  const [selected, setSelected] = useState<number | undefined>();
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);

  // Reset state when the question changes
  useEffect(() => {
    setSelected(undefined);
    setIsAnswered(false);
    setVideoWatched(false);
  }, [question.id]);

  if (!question) return <p>Loading...</p>;

  // --- Render Question
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
          <video
            controls
            className="w-full max-h-[400px] rounded"
            // Track when video ends
            onEnded={() => {
              setVideoWatched(true), setCanGoNext(true);
            }}
          >
            <source src={question.content} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      default:
        return question.content;
    }
  };

  // --- Render Answer (Unchanged) ---
  const renderAnswer = (ans: IAnswer) => {
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

  useEffect(() => {
    setCanGoNext(false); // reset when question changes
  }, [question.id]);

  // This function is called when a QCM answer is clicked
  const handleSelectAnswer = (ans: IAnswer) => {
    if (isAnswered) return; // Don't allow changing the answer

    setIsAnswered(true);
    setSelected(ans.id);
    setIsCorrectAnswer(true);
    setCanGoNext(true);
  };

  // This function is called when the "Next" button for a video is clicked
  const handleVideoComplete = () => {
    onSubmitAnswer(true); // Mark as "correct" or "completed"
    onNext(); // Go to the next question
    setCanGoNext(true);
  };

  // Dynamically get the button class based on the answer state
  const getButtonClass = (ans: IAnswer) => {
    const baseClasses =
      "p-4 border h-auto min-h-[6rem] rounded-xl text-lg flex justify-start items-center transition-all duration-200";

    if (!isAnswered) {
      return `${baseClasses} ${
        selected === ans.id
          ? "bg-blue-100 border-blue-500" // Selected (but not yet submitted)
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
      }`;
    }

    // --- We have answered ---
    if (ans.isCorrect) {
      // This is the correct answer (always show green)
      return `${baseClasses} bg-green-100 border-green-500 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-100 font-medium`;
    }

    if (selected === ans.id && !ans.isCorrect) {
      // This is the one we selected, and it's WRONG (show red)
      return `${baseClasses} bg-red-100 border-red-500 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-100`;
    }

    // This is an incorrect answer we did not select (fade it out)
    return `${baseClasses} bg-gray-50 border-gray-200 text-gray-500 opacity-60 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400`;
  };

  // Check if this is a video-only task (no answers)
  const isVideoTask =
    question.contentType === "VIDEO" &&
    (!question.answers || question.answers.length === 0);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
      {/* --- 1. RENDER THE QUESTION --- */}
      <div>{renderQuestion()}</div>

      {/* --- 2. RENDER ANSWERS (if QCM) or VIDEO NEXT BUTTON --- */}
      <div className="mt-4 flex flex-col gap-3">
        {isVideoTask ? (
          <button
            onClick={handleVideoComplete}
            disabled={!videoWatched}
            className="w-full p-4 rounded-xl text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {videoWatched
              ? "Complete & Continue"
              : "Watch the video to continue"}
          </button>
        ) : (
          question.answers.map((ans: IAnswer, index) => (
            <button
              key={ans.id}
              className={getButtonClass(ans)}
              onClick={() => handleSelectAnswer(ans)}
              disabled={isAnswered}
            >
              <span className="w-6 font-medium">{toKhmerLetter(index)}.</span>
              <span className="ml-2 text-left">{renderAnswer(ans)}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
