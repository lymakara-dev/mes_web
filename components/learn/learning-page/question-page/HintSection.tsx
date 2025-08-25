"use client";

type HintSectionProps = {
  hint: string;
};

export default function HintSection({ hint }: HintSectionProps) {
  return (
    <div className="bg-gray-100 h-full flex flex-col justify-start rounded-2xl p-4 dark:bg-gray-900">
      <h3 className="font-semibold mb-2">💡 Hint</h3>
      <p>{hint || "No hint available for this question."}</p>
    </div>
  );
}
