import Link from "next/link";
import React from "react";

import SubjectCard from "@/components/learn/learning-page/SubjectCard";

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

interface SubjectPageProps {
  params: Promise<{ universityId: string }>;
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { universityId } = await params;

  return (
    <div>
      {subjects.map((subject) => (
        <Link
          key={subject.id}
          href={`/learn/learning/${universityId}/${subject.id}`}
        >
          <SubjectCard
            buttonLabel={subject.buttonLabel}
            image={subject.image}
            progress={subject.progress}
            questions={subject.questions}
            title={subject.title}
          />
        </Link>
      ))}
    </div>
  );
}
