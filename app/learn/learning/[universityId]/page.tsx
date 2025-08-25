import SubjectCard from "@/components/learn/learning-page/SubjectCard";
import Link from "next/link";
import React from "react";

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
  params: { universityId: string };
}

export default function SubjectPage({ params }: SubjectPageProps) {
  const { universityId } = params;
  console.log("uni id: ", universityId);
  return (
    <div>
      {subjects.map((subject) => (
        <Link
          key={subject.id}
          href={`/learn/learning/${universityId}/${subject.id}`}
        >
          <SubjectCard
            title={subject.title}
            questions={subject.questions}
            progress={subject.progress}
            image={subject.image}
            buttonLabel={subject.buttonLabel}
          />
        </Link>
      ))}
    </div>
  );
}
