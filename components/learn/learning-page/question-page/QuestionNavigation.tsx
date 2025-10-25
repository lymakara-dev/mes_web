import { Button, ButtonGroup } from "@heroui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type QuestionNavigationProps = {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
  disabledNext?: boolean;
};

export default function QuestionNavigation({
  currentIndex,
  total,
  onPrev,
  onNext,
  onFinish,
  disabledNext,
}: QuestionNavigationProps) {
  return (
    <div className="flex justify-between mt-6">
      {/* Hide Prev button on the first question */}
      {currentIndex > 0 ? (
        <Button
          className="px-4 py-2 flex items-center gap-2 rounded-lg border text-gray-600 hover:bg-gray-50"
          onClick={onPrev}
        >
          <ArrowLeft /> Prev
        </Button>
      ) : (
        <div /> // Empty div to keep spacing consistent
      )}

      {/* Change Next button to Finish on the last question */}
      <Button
        disabled={disabledNext}
        className={`px-4 py-2 flex items-center gap-2 rounded-lg text-white ${
          currentIndex === total - 1
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-800"
        }`}
        onClick={currentIndex === total - 1 ? onFinish : onNext}
      >
        {currentIndex === total - 1 ? "Finish" : "Next"}{" "}
        {currentIndex === total - 1 ? null : <ArrowRight />}
      </Button>
    </div>
  );
}
