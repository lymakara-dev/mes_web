"use client";

import { useMemo, useState } from "react";

import quesitons_data from "@/data/questions.json";
import user_quesiton_history from "@/data/user_question_history.json";

export default function SidebarProgress() {
  const [questions] = useState(quesitons_data);
  const [history] = useState(user_quesiton_history);

  // merge progress
  const questionsWithProgress = useMemo(() => {
    return questions.map((q) => {
      const attempt = history.find((h) => h.question_id === String(q.id));

      return {
        ...q,
        learned: !!attempt,
        isCorrect: attempt?.is_correct ?? null,
      };
    });
  }, [questions, history]);

  // calculate progress
  const total = questions.length;
  const completed = questionsWithProgress.filter((q) => q.learned).length;
  const progressPercentage = Math.round((completed / total) * 100);

  return (
    <aside className="w-full h-full md:w-80 bg-white rounded-2xl shadow-sm p-6 dark:bg-gray-800">
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
        {questionsWithProgress.map((q) => (
          <div
            key={q.id}
            className={`p-2 rounded-lg text-sm flex flex-row justify-start items-center gap-2 ${
              q.learned
                ? "bg-blue-50 text-blue-700"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {/* Status */}
            <div>
              <div
                className={`ml-2 w-6 h-6 flex items-center justify-center rounded-full border ${
                  q.learned
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-500 border-gray-300"
                }`}
              >
                {q.learned ? "✓" : ""}
              </div>
            </div>
            <span>
              Q{q.id}: {q.subject}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
