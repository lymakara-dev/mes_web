"use client";

import SubjectCard from "@/components/learn/learning-page/SubjectCard";
import { SubjectApi } from "@/hooks/learn/subject-api";
import { UserProgressApi } from "@/hooks/learn/user-progress-api";
import { Subject } from "@/types/subject";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

const subjects = [
  {
    id: 1,
    title: "Math",
    questions: 2379,
    progress: 79,
    image: "/images/country/country-01.svg",
    buttonLabel: "ចាប់ផ្ដើម",
  },
  {
    id: 2,
    title: "Physics",
    questions: 1500,
    progress: 45,
    image: "/images/country/country-02.svg",
    buttonLabel: "ចាប់ផ្ដើម",
  },
  {
    id: 3,
    title: "Logic",
    questions: 980,
    progress: 62,
    image: "/images/country/country-03.svg",
    buttonLabel: "ចាប់ផ្ដើម",
  },
  {
    id: 4,
    title: "Chemistry",
    questions: 2120,
    progress: 30,
    image: "/images/country/country-04.svg",
    buttonLabel: "ចាប់ផ្ដើម",
  },
];

export default function SubjectPage() {
  const params = useParams();
  const schoolId = params?.schoolId;
  const router = useRouter();

  const { getSubjectBySchool } = SubjectApi();
  const { startLearning, resetProgress } = UserProgressApi();

  const { data, isLoading, isError, refetch } = useQuery<Subject[]>({
    queryKey: ["subject"],
    queryFn: () => getSubjectBySchool(Number(schoolId)),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Fail to load subjects</p>;

  const handleStartLearning = async (subjectId: number, progress: number) => {
    try {
      if (progress === 100) {
        await resetProgress(subjectId);
        await refetch();
      }

      await startLearning(subjectId);
      router.push(`/learn/learning/${schoolId}/${subjectId}`);
    } catch (err) {
      console.error("Failed to start learning:", err);
    }
  };

  return (
    <div>
      {data?.map((subject) => {
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
