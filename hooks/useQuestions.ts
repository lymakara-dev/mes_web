import { useApi } from "@/service/useApi";
import { useQuery } from "@tanstack/react-query";
import { QuestionAnswer } from "@/types/question-answer";

export function useQuestions(subjectId: string) {
  const { getQuestionBySubjectId } = useApi();

  return useQuery<QuestionAnswer[]>({
    queryKey: ["question", subjectId],
    queryFn: () => getQuestionBySubjectId(subjectId),
  });
}
