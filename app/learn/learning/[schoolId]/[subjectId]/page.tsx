"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuestions } from "@/hooks/useQuestions";
import QuestionCard from "@/components/learn/learning-page/question-page/QuestionCard";
import QuestionNavigation from "@/components/learn/learning-page/question-page/QuestionNavigation";
import QuestionSections from "@/components/learn/learning-page/question-page/QuestionSections";
import SidebarProgress from "@/components/learn/learning-page/question-page/SidebarProgress";
import Header from "@/components/learn/learning-page/question-page/Header";
import { UserProgressApi } from "@/hooks/learn/user-progress-api";
import { UserQuestionHistoryApi } from "@/hooks/learn/user-question-history";
import { useQueryClient } from "@tanstack/react-query";

export default function QuestionPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const router = useRouter();
  const subjectId = params?.subjectId as string;

  const queryClient = useQueryClient();
  const { updateUserProgress } = UserProgressApi();
  const { startQuestion, endQuestion } = UserQuestionHistoryApi();
  const { data: questions, isLoading, isError } = useQuestions(subjectId);

  const [activeSection, setActiveSection] = useState<
    "note" | "chatbot" | "hint" | "report"
  >("note");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (typeof window !== "undefined") {
      const savedIndex = localStorage.getItem(`currentIndex_${subjectId}`);
      return savedIndex ? Number(savedIndex) : 0;
    }
    return 0;
  });

  // Save current index persistently
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`currentIndex_${subjectId}`, String(currentIndex));
    }
  }, [currentIndex, subjectId]);

  // Fullscreen tracking
  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const currentQuestion = questions?.[currentIndex];

  // Track start/end of each question
  useEffect(() => {
    if (!currentQuestion) return;

    startQuestion(currentQuestion.id).catch(console.error);

    return () => {
      endQuestion(currentQuestion.id).catch(console.error);
    };
  }, [currentQuestion, startQuestion, endQuestion]);

  const handleNext = async () => {
    if (!currentQuestion) return;

    await endQuestion(currentQuestion.id);
    await updateUserProgress(Number(subjectId));

    // instantly update without reloading
    await queryClient.invalidateQueries({ queryKey: ["questions", subjectId] });
    await queryClient.refetchQueries({ queryKey: ["questions", subjectId] });

    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handleFinish = async () => {
    if (!currentQuestion) return;

    await endQuestion(currentQuestion.id);
    await updateUserProgress(Number(subjectId));

    router.push(`/learn/learning`);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  // --- Early returns ---
  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading questions...
      </div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Failed to load questions
      </div>
    );
  if (!currentQuestion)
    return <p className="p-4 text-gray-500">No questions available</p>;
  if (questions.every((q: any) => q.status === "completed"))
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-2">
        <p className="text-lg font-semibold">
          🎉 You’ve completed all questions!
        </p>
        <button
          onClick={() => router.push("/learn/learning")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Lessons
        </button>
      </div>
    );

  return (
    <div
      ref={containerRef}
      className="flex flex-col gap-5 bg-white dark:bg-gray-900"
    >
      <Header
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      <div className="w-full h-full flex flex-col gap-5 md:flex-row">
        <div className="flex flex-col flex-1 gap-5">
          <QuestionCard question={currentQuestion} />

          <QuestionNavigation
            currentIndex={currentIndex}
            total={questions.length}
            onPrev={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            onNext={handleNext}
            onFinish={handleFinish}
          />

          <QuestionSections
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            question={currentQuestion}
          />
        </div>
        <SidebarProgress
          questions={questions}
          currentIndex={currentIndex}
          onSelectQuestion={(index) => setCurrentIndex(index)}
        />
      </div>
    </div>
  );
}
