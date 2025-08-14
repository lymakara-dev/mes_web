"use client";

import MyCard from "@/components/common/Card";
import React from "react";

export const mockUniversities = [
  {
    image: "/images/uni-logo/itc-logo.png",
    title: "វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា",
    subjects: 12,
  },
  {
    image: "/images/uni-logo/uhs-logo.png",
    title: "សាកលវិទ្យាល័យវិទ្យាសាស្ត្រ សុខាភិបាល",
    subjects: 8,
  },
  {
    image: "/images/uni-logo/rupp-logo.png",
    title: "សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ",
    subjects: 15,
  },
  {
    image: "/images/uni-logo/cadt-logo.png",
    title: "សាកលវិទ្យាល័យពុទ្ធិសាស្ត្រ (UP)",
    subjects: 6,
  },
];

export default function LearningPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 bg-white dark:bg-gray-900 transition-colors">
      {mockUniversities.map((uni, index) => (
        <MyCard
          key={index}
          image={uni.image}
          title={uni.title}
          subjects={uni.subjects}
        />
      ))}
    </div>
  );
}
