"use client";

import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

type HintSectionProps = {
  hint: string;
};

export default function HintSection({ hint }: HintSectionProps) {
  if (!hint)
    return (
      <div className="bg-gray-100 h-full flex flex-col justify-start rounded-2xl p-4 dark:bg-gray-900">
        <h3 className="font-semibold mb-2">💡 Hint</h3>
        <p>No hint available for this question.</p>
      </div>
    );

  return (
    <div className="bg-gray-100 h-full flex flex-col justify-start rounded-2xl p-4 dark:bg-gray-900">
      <h3 className="font-semibold mb-2">💡 Hint</h3>
      <div>
        {/* Wrap the hint in $$ for block LaTeX rendering */}
        <Latex>{`$$${hint}$$`}</Latex>
      </div>
    </div>
  );
}
