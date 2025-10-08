"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuestions } from "@/hooks/useQuestions";
import QuestionCard from "@/components/learn/learning-page/question-page/QuestionCard";
import QuestionNavigation from "@/components/learn/learning-page/question-page/QuestionNavigation";
import QuestionSections from "@/components/learn/learning-page/question-page/QuestionSections";
import SidebarProgress from "@/components/learn/learning-page/question-page/SidebarProgress";
import Header from "@/components/learn/learning-page/question-page/Header";
import historyData from "@/data/user_question_history.json";
import { useApi } from "@/service/useApi";

export default function QuestionPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const params = useParams();
  const subjectId = params?.subjectId as string;
  const { updateUserProgress } = useApi();

  const { data, isLoading, isError } = useQuestions(subjectId);

  console.log("data", data);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSection, setActiveSection] = useState<
    "note" | "chatbot" | "hint" | "report"
  >("note");

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const incompleteQuestions = useMemo(() => {
    if (!data) return [];
    const answeredIds = historyData
      .filter((h) => h.id == "0")
      .map((h) => Number(h.question_id));
    return data.filter((q) => !answeredIds.includes(q.id));
  }, [data]);

  const currentQuestion = incompleteQuestions[currentIndex];

  if (!currentQuestion) return <p className="p-4">No questions available</p>;

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load questions</p>;
  if (incompleteQuestions.length === 0)
    return <p className="p-4">🎉 You have completed all questions!</p>;

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

      <div className="w-full h-full flex flex-col gap-5 md:flex-row">
        <div className="flex flex-col flex-1 gap-5 ">
          <QuestionCard question={currentQuestion} />

          <QuestionNavigation
            currentIndex={currentIndex}
            total={incompleteQuestions.length}
            onPrev={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
            onNext={async () => {
              const nextIndex = Math.min(
                currentIndex + 1,
                incompleteQuestions.length - 1,
              );

              // call API to update progress
              try {
                await updateUserProgress(Number(subjectId));
                console.log("Progress updated for subject:", subjectId);
              } catch (err) {
                console.error("Failed to update progress:", err);
              }

              setCurrentIndex(nextIndex);
            }}
          />

          <QuestionSections
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            question={incompleteQuestions[currentIndex]}
          />
        </div>
        {/* <SidebarProgress questions={incompleteQuestions} /> */}
      </div>
    </div>
  );
}
