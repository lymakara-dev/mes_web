import { useQuery } from "@tanstack/react-query";
import { QuestionApi } from "./learn/question-api";

export function useQuestions(subjectId: string) {
  const { getQuestionBySubjectId } = QuestionApi();

  return useQuery({
    queryKey: ["question", subjectId],
    queryFn: () => getQuestionBySubjectId(subjectId),
  });
}
