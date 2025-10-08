"use client";

import Link from "next/link";

import MyCard from "@/components/common/Card";
import { useApi } from "@/service/useApi";
import { useQuery } from "@tanstack/react-query";
import { School } from "@/types/school";

const mockUniversities = [
  {
    id: 1,
    image: "/images/uni-logo/itc-logo.png",
    title: "វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា",
    subjects: 12,
  },
  {
    id: 2,
    image: "/images/uni-logo/uhs-logo.png",
    title: "សាកលវិទ្យាល័យវិទ្យាសាស្ត្រ សុខាភិបាល",
    subjects: 8,
  },
  {
    id: 3,
    image: "/images/uni-logo/rupp-logo.png",
    title: "សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ",
    subjects: 15,
  },
  {
    id: 4,
    image: "/images/uni-logo/cadt-logo.png",
    title: "សាកលវិទ្យាល័យពុទ្ធិសាស្ត្រ (UP)",
    subjects: 6,
  },
  {
    id: 5,
    image: "/images/uni-logo/cadt-logo.png",
    title: "សាកលវិទ្យាល័យពុទ្ធិសាស្ត្រ (UP)",
    subjects: 6,
  },
  {
    id: 6,
    image: "/images/uni-logo/cadt-logo.png",
    title: "សាកលវិទ្យាល័យពុទ្ធិសាស្ត្រ (UP)",
    subjects: 6,
  },
];

export default function LearningPage() {
  const { getSchools } = useApi();

  const { data, isLoading, isError } = useQuery<School[]>({
    queryKey: ["schools"],
    queryFn: getSchools,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load schools</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 bg-white dark:bg-gray-900 transition-colors">
      {data?.map((s) => (
        <Link key={s.id} href={`/learn/learning/${s.id}`}>
          <MyCard image={s.logoUrl} subjects={s.subjectCount} title={s.name} />
        </Link>
      ))}
    </div>
  );
}
