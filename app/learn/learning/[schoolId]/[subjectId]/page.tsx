"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QuestionCard from "@/components/learn/learning-page/question-page/QuestionCard";
import QuestionNavigation from "@/components/learn/learning-page/question-page/QuestionNavigation";
import QuestionSections from "@/components/learn/learning-page/question-page/QuestionSections";
import SidebarProgress from "@/components/learn/learning-page/question-page/SidebarProgress";
import Header from "@/components/learn/learning-page/question-page/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/service/api"; // Assuming the API service instance
import { AxiosError, AxiosResponse } from "axios";
import { Question } from "@/types/question"; // Assuming a type for Question

// ❌ REMOVED: useQuestions, UserProgressApi, UserQuestionHistoryApi

// Placeholder for missing toast function
const addToast = (params: any) =>
  console.log("Toast:", params.title, params.description);

export default function QuestionPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const router = useRouter();
  const subjectId = params?.subjectId as string;
  const queryClient = useQueryClient();
  const questionsQueryKey = ["questions", subjectId];
  const subjectIdNumber = Number(subjectId);

  // --- State Hooks ---
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

  const isValidSubjectId =
    !!subjectId && !isNaN(subjectIdNumber) && subjectIdNumber > 0;

  // --- 1. QUESTIONS USE QUERY ---
  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery<Question[], AxiosError>({
    queryKey: questionsQueryKey,
    queryFn: async () => {
      // We use a generic type here temporarily to inspect the response structure
      const res: AxiosResponse<Question[] | { data: Question[] }> =
        await apiService.get(`/questions/subject`, {
          subjectId: subjectIdNumber,
        });

      // ⭐️ LIKELY FIX: Return res.data if the array is not nested
      if (Array.isArray(res.data)) {
        return res.data as Question[];
      }

      // Fallback (if the API response shape is confirmed to be {data: []})
      return (res.data as { data: Question[] }).data;
    },
    enabled: isValidSubjectId,
  });

  // --- 2. UPDATE USER PROGRESS MUTATION ---
  const { mutateAsync: updateProgressMutation } = useMutation({
    // Endpoint: /api/user-progress/1/update (1 is subjectId)
    mutationFn: (subId: number) =>
      apiService.patch(`/user-progress/${subId}/update`, {}),
    onError: (err: any) =>
      addToast({
        title: "Error",
        description: "Progress update failed.",
        color: "danger",
      }),
  });

  // --- 3. START QUESTION MUTATION ---
  const { mutateAsync: startQuestionMutation } = useMutation({
    // Endpoint: /api/user/user-question-history/1/start (1 is questionId)
    mutationFn: (questionId: number) =>
      apiService.post(`/user/user-question-history/${questionId}/start`, {}),
    onError: (err: any) => console.error("Start question failed:", err),
  });

  // --- 4. END QUESTION MUTATION ---
  const { mutateAsync: endQuestionMutation } = useMutation({
    // Endpoint: /api/user/user-question-history/1/end (1 is questionId)
    mutationFn: (questionId: number) =>
      apiService.post(`/user/user-question-history/${questionId}/end`, {}),
    onError: (err: any) => console.error("End question failed:", err),
  });

  // --- Effects ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`currentIndex_${subjectId}`, String(currentIndex));
    }
  }, [currentIndex, subjectId]);

  const currentQuestion = questions?.[currentIndex];

  // Track start/end of each question
  useEffect(() => {
    // ⭐️ CRITICAL FIX: Check if the ID is a valid number ⭐️
    if (
      !currentQuestion ||
      typeof currentQuestion.id !== "number" ||
      currentQuestion.id <= 0
    ) {
      return;
    }

    // If we reach here, currentQuestion.id is a valid number
    startQuestionMutation(currentQuestion.id).catch(console.error);

    return () => {
      // The cleanup function runs on component unmount OR when dependencies change.
      // We must ensure the ID is valid for the cleanup to run safely.
      // However, the dependencies will correctly capture the ID from the previous render.
      endQuestionMutation(currentQuestion.id).catch(console.error);
    };
  }, [currentQuestion, startQuestionMutation, endQuestionMutation]);

  // --- Handlers ---
  const handleNext = async () => {
    if (!currentQuestion) return;

    // ⭐️ Use new mutation ⭐️
    await endQuestionMutation(currentQuestion.id);
    await updateProgressMutation(subjectIdNumber);

    // Invalidate/refetch questions to potentially see the newly updated status
    await queryClient.invalidateQueries({ queryKey: questionsQueryKey });
    await queryClient.refetchQueries({ queryKey: questionsQueryKey });

    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handleFinish = async () => {
    if (!currentQuestion) return;

    // ⭐️ Use new mutation ⭐️
    await endQuestionMutation(currentQuestion.id);
    await updateProgressMutation(subjectIdNumber);

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
  // ... (early returns remain the same)
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
  // if (questions?.every((q: any) => q.status === "completed"))
  //   // Added optional chaining
  //   return (
  //     <div className="flex flex-col items-center justify-center h-screen gap-2">
  //       <p className="text-lg font-semibold">
  //         🎉 You’ve completed all questions!
  //       </p>
  //       <button
  //         onClick={() => router.push("/learn/learning")}
  //         className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
  //       >
  //         Back to Lessons
  //       </button>
  //     </div>
  //   );

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
