"use client";

import { useMemo } from "react";

type SidebarProgressProps = {
  questions: any;
  onSelectQuestion: (index: number) => void;
  currentIndex: number;
};

export default function SidebarProgress({
  questions,
  onSelectQuestion,
  currentIndex,
}: SidebarProgressProps) {
  // Merge progress from the question objects themselves
  const questionsWithProgress = useMemo(() => {
    return questions.map((q: any) => ({
      ...q,
      learned: q.status === "completed",
      isCorrect: q.isCorrect ?? null,
    }));
  }, [questions]);

  // Calculate progress
  const total = questions.length;
  const completed = questionsWithProgress.filter((q: any) => q.learned).length;
  const progressPercentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <aside className="w-full h-full md:w-80 bg-white rounded-2xl shadow-sm p-6 dark:bg-gray-800">
      {/* Title */}
      <h3 className="font-semibold text-2xl text-[#06598F] mb-4">លំហាត់សរុប</h3>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mb-4 dark:text-gray-50">
        {completed}/{total} ({progressPercentage}%)
      </p>

      {/* Question list */}
      <div className="space-y-2 max-h-[70vh] overflow-y-auto">
        {questionsWithProgress.map((q: any, index: any) => (
          <button
            key={q.id}
            onClick={() => onSelectQuestion(index)}
            className={`w-full text-left p-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
              index === currentIndex
                ? "bg-blue-100 text-blue-900"
                : q.learned
                  ? "bg-blue-50 text-blue-700"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {/* Status circle */}
            <div
              className={`ml-2 w-6 h-6 flex items-center justify-center rounded-full border ${
                q.learned
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-500 border-gray-300"
              }`}
            >
              {q.learned ? "✓" : ""}
            </div>

            {/* Question content */}
            <span>
              Lesson{index + 1}: {q.contentType}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
