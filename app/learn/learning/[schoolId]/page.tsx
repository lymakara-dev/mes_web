"use client";

import SubjectCard from "@/components/learn/learning-page/SubjectCard";
// ❌ REMOVED: import { UserProgressApi } from "@/hooks/learn/user-progress-api";
import apiService from "@/service/api";
import { Subject } from "@/types/subject";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";

// Placeholder for missing context/hooks (assuming they exist elsewhere)
const addToast = (params: any) =>
  console.log("Toast:", params.title, params.description);

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params?.schoolId as string;
  const queryClient = useQueryClient();

  const queryKey = ["sbujects", schoolId];

  // ❌ REMOVED: const { startLearning, resetProgress } = UserProgressApi();

  const {
    data: subjects,
    isLoading,
    isError,
    refetch,
  } = useQuery<Subject[], AxiosError>({
    queryKey: queryKey,
    queryFn: async () => {
      const res = await apiService.get<Subject[]>(`/subjects/school`, {
        schoolId: schoolId,
      });
      return res.data;
    },
    enabled: !!schoolId,
  });

  // ⭐️ 1. START LEARNING MUTATION (Renamed for clarity) ⭐️
  const { mutate: startLearningMutation, isPending: isStarting } = useMutation({
    mutationFn: (subjectId: number) => {
      const url = `/user-progress/${subjectId}/start`;
      return apiService.post(url, {});
    },
    onSuccess: (response, subjectId) => {
      addToast({
        title: "Session Started",
        description: "Learning session started successfully!",
        color: "success",
      });
      queryClient.invalidateQueries({ queryKey });
      router.push(`/learn/learning/${schoolId}/${subjectId}`);
    },
    onError: (err: any) =>
      addToast({
        title: "Error Starting Lesson",
        description:
          err.response?.data?.message || "Failed to start learning session.",
        color: "danger",
      }),
  });

  // ⭐️ 2. RESET PROGRESS MUTATION (NEW) ⭐️
  const {
    mutate: resetProgressMutation,
    mutateAsync: resetProgressMutationAsync,
    isPending: isResetting,
  } = useMutation({
    // The endpoint is a POST or PUT/PATCH, but for a "reset" action,
    // it's often a POST with an empty body, or a DELETE (less likely here).
    // We'll use POST as it's an action, and the backend URL uses path params.
    mutationFn: (subjectId: number) => {
      const url = `/user-progress/${subjectId}/reset`;
      return apiService.delete(url, {});
    },
    // We don't need onSuccess here because we call refetch and startLearning
    // directly in handleStartLearning after the mutation completes.
    onError: (err: any) =>
      addToast({
        title: "Error Resetting Progress",
        description: err.response?.data?.message || "Failed to reset progress.",
        color: "danger",
      }),
  });

  if (isLoading || isStarting || isResetting) return <p>Loading...</p>;
  if (isError) return <p>Fail to load subjects</p>;

  const handleStartLearning = async (subjectId: number, progress: number) => {
    try {
      if (progress === 100) {
        // ⭐️ CALL THE NEWLY DEFINED MUTATION ⭐️
        // We use .mutateAsync() here to await the completion before moving on.
        await resetProgressMutationAsync(subjectId);

        // Clear saved local current question for this subject
        localStorage.removeItem(`currentIndex_${subjectId}`);
        await refetch(); // Refresh to show progress reset to 0
      }

      // Start the learning session (navigation happens inside startLearningMutation's onSuccess)
      startLearningMutation(subjectId);
    } catch (err) {
      console.error("Failed to start learning or reset progress:", err);
    }
  };

  return (
    <div>
      {subjects?.map((subject) => {
        const isCompleted = subject.userProgress === 100;
        const buttonLabel = isCompleted ? "ម្ដងទៀត" : "ចាប់ផ្ដើម";

        return (
          <div key={subject.id}>
            <SubjectCard
              buttonLabel={buttonLabel}
              image={subject.logoUrl}
              progress={subject.userProgress}
              questions={subject.questionCount}
              title={subject.name}
              onClickButton={() =>
                handleStartLearning(subject.id, subject.userProgress)
              }
            />
          </div>
        );
      })}
    </div>
  );
}
