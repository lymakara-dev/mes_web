"use client";

import SubjectCard from "@/components/learn/learning-page/SubjectCard";
import { useApi } from "@/service/useApi";
import { Subject } from "@/types/subject";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";

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

  const { getSubject } = useApi();

  const { data, isLoading, isError } = useQuery<Subject[]>({
    queryKey: ["subjects", schoolId],
    queryFn: () => getSubject(schoolId as string),
  });

  console.log("subject ser progress", data);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Fail to load subjects</p>;

  return (
    <div>
      {data?.map((subject) => (
        <Link
          key={subject.id}
          href={`/learn/learning/${schoolId}/${subject.id}`}
        >
          <SubjectCard
            buttonLabel={"ចាប់ផ្ដើម"}
            image={subject.logoUrl}
            progress={subject.userProgress}
            questions={subject.questionCount}
            title={subject.name}
          />
        </Link>
      ))}
    </div>
  );
}
