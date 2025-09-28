import { ArrowLeft, ArrowRight } from "lucide-react";

type QuestionNavigationProps = {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function QuestionNavigation({
  currentIndex,
  total,
  onPrev,
  onNext,
}: QuestionNavigationProps) {
  return (
    <div className="flex justify-between mt-6">
      <button
        className="px-4 py-2 flex items-center gap-2 rounded-lg border text-gray-600 hover:bg-gray-50"
        disabled={currentIndex === 0}
        onClick={onPrev}
      >
        <ArrowLeft /> Prev
      </button>
      <button
        className="px-4 py-2 flex items-center gap-2 rounded-lg bg-blue-600 text-white hover:bg-blue-800"
        disabled={currentIndex === total - 1}
        onClick={onNext}
      >
        Next <ArrowRight />
      </button>
    </div>
  );
}
