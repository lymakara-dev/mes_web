"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QuestionCard from "@/components/learn/learning-page/question-page/QuestionCard";
import QuestionNavigation from "@/components/learn/learning-page/question-page/QuestionNavigation";
import QuestionSections from "@/components/learn/learning-page/question-page/QuestionSections";
import SidebarProgress from "@/components/learn/learning-page/question-page/SidebarProgress";
import Header from "@/components/learn/learning-page/question-page/Header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiService from "@/service/api";
import { AxiosError, AxiosResponse } from "axios";
import { IQuestionAnswer } from "@/types/learn-type";

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
  const [canGoNext, setCanGoNext] = useState(false);

  const isValidSubjectId =
    !!subjectId && !isNaN(subjectIdNumber) && subjectIdNumber > 0;

  // --- 1. QUESTIONS USE QUERY ---
  const {
    data: questions,
    isLoading,
    isError,
  } = useQuery<IQuestionAnswer[], AxiosError>({
    queryKey: questionsQueryKey,
    queryFn: async () => {
      const res: AxiosResponse<
        IQuestionAnswer[] | { data: IQuestionAnswer[] }
      > = await apiService.get(`/questions/subject`, {
        subjectId: subjectIdNumber,
      });

      if (Array.isArray(res.data)) {
        return res.data as IQuestionAnswer[];
      }

      return (res.data as { data: IQuestionAnswer[] }).data;
    },
    enabled: isValidSubjectId,
  });

  // --- 2. UPDATE USER PROGRESS MUTATION ---
  const { mutateAsync: updateProgressMutation } = useMutation({
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
    mutationFn: (questionId: number) =>
      apiService.post(`/user/user-question-history/${questionId}/start`, {}),
    onError: (err: any) => console.error("Start question failed:", err),
  });

  // --- 4. END QUESTION MUTATION ---
  const { mutateAsync: endQuestionMutation } = useMutation({
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
      endQuestionMutation(currentQuestion.id).catch(console.error);
    };
  }, [currentQuestion, startQuestionMutation, endQuestionMutation]);

  // --- Handlers ---
  const handleNext = async () => {
    if (!currentQuestion) return;

    await endQuestionMutation(currentQuestion.id);
    await updateProgressMutation(subjectIdNumber);

    // Invalidate/refetch questions to potentially see the newly updated status
    await queryClient.invalidateQueries({ queryKey: questionsQueryKey });
    await queryClient.refetchQueries({ queryKey: questionsQueryKey });

    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handleFinish = async () => {
    if (!currentQuestion) return;

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
          <QuestionCard
            question={currentQuestion}
            onNext={handleNext}
            onSubmitAnswer={() => {}}
            setCanGoNext={setCanGoNext}
          />

          <QuestionNavigation
            currentIndex={currentIndex}
            total={questions.length}
            onPrev={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
            onNext={handleNext}
            onFinish={handleFinish}
            disabledNext={!canGoNext}
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
