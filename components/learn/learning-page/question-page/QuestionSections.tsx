"use client";

import ActionButtons from "./ActionButtons";
import ChatBotSection from "./ChatBotSection";
import HintSection from "./HintSection";
import ReportSection from "./ReportSection";
import { QuestionAnswer } from "@/types/question-answer";
import NoteSection from "./NoteSection";

interface QuestionSectionsProps {
  activeSection: "note" | "chatbot" | "hint" | "report";
  setActiveSection: (section: "note" | "chatbot" | "hint" | "report") => void;
  question: QuestionAnswer;
}

export default function QuestionSections({
  activeSection,
  setActiveSection,
  question,
}: QuestionSectionsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Switcher Buttons */}
      <ActionButtons
        activeSelection={activeSection}
        setActiveSelection={setActiveSection}
      />

      {/* Conditional Sections */}
      {activeSection === "note" && <NoteSection questionId={question.id} />}
      {activeSection === "chatbot" && <ChatBotSection questionId={question.id}/>}
      {activeSection === "hint" && <HintSection hint={question?.hint || ""} />}
      {activeSection === "report" && <ReportSection questionId={question.id} />}
    </div>
  );
}
