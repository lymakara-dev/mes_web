import { useQuery } from "@tanstack/react-query";
import { QuestionAnswer } from "@/types/question-answer";
import { QuestionApi } from "./learn/question-api";

export function useQuestions(subjectId: string) {
  const { getQuestionBySubjectId } = QuestionApi();

  return useQuery<QuestionAnswer[]>({
    queryKey: ["question", subjectId],
    queryFn: () => getQuestionBySubjectId(subjectId),
  });
}
