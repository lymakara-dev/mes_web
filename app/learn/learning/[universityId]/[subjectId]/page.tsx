"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import ActionButtons from "@/components/learn/learning-page/question-page/ActionButtons";
import ChatBotSection from "@/components/learn/learning-page/question-page/ChatBotSection";
import CommentSection from "@/components/learn/learning-page/question-page/NoteSection";
import Header from "@/components/learn/learning-page/question-page/Header";
import HintSection from "@/components/learn/learning-page/question-page/HintSection";
import ReportSection from "@/components/learn/learning-page/question-page/ReportSection";
import SidebarProgress from "@/components/learn/learning-page/question-page/SidebarProgress";
import QuestionCard from "@/components/learn/learning-page/question-page/QuestionCard";
import questionsData from "@/data/questions.json";
import { Question } from "@/types/question";
import historyData from "@/data/user_question_history.json";

export default function QuestionPage(userId: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [activeSection, setActiveSection] = useState<
    "note" | "chatbot" | "hint" | "report"
  >("note");

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleChange);

    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const questions: Question[] = questionsData.map((q) => ({
    ...q,
    questionType: q.questionType as "text" | "latex" | "image" | "mixed",
  }));

  // filter out questions the user has already answered
  const incompleteQuestions = useMemo(() => {
    const answeredQuestonIds = historyData
      .filter((h) => h.id == "1")
      .map((h) => Number(h.question_id));

    return questionsData.filter((q) => !answeredQuestonIds.includes(q.id));
  }, [userId]);

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  // if no more incomplete questions
  if (incompleteQuestions.length === 0) {
    return <p className="p-4">🎉 You have completed all questions!</p>;
  }

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-5 bg-white dark:bg-gray-900"
    >
      <Header
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      <div className="w-full h-full  flex flex-col gap-5 md:flex-row">
        <div className="flex flex-col flex-1 gap-5 ">
          <QuestionCard question={incompleteQuestions[currentIndex]} />
          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              className="px-4 py-2 flex items-center gap-2 rounded-lg border text-gray-600 hover:bg-gray-50"
              disabled={currentIndex === 0}
              onClick={handlePrev}
            >
              <ArrowLeft />
              Prev
            </button>
            <button
              className="px-4 py-2 flex items-center gap-2 rounded-lg bg-blue-600 text-white hover:bg-blue-800"
              disabled={currentIndex === questions.length - 1}
              onClick={handleNext}
            >
              Next
              <ArrowRight />
            </button>
          </div>
          <ActionButtons
            activeSelection={activeSection}
            setActiveSelection={setActiveSection}
          />

          {activeSection === "note" && <CommentSection />}
          {activeSection === "chatbot" && <ChatBotSection />}
          {activeSection === "hint" && (
            <HintSection hint={incompleteQuestions[currentIndex]?.hint || ""} />
          )}
          {activeSection === "report" && <ReportSection />}
        </div>
        <div>
          <SidebarProgress />
        </div>
      </div>
    </div>
  );
}
