export type Answer = {
  id: number;
  questionId: number;
  content: string;
  contentType: "TEXT" | "IMAGE" | "LATEX" | "VIDEO";
  isCorrect: boolean;
};

export type QuestionAnswer = {
  id: number;
  subjectId: number;
  content: string;
  contentType: "TEXT" | "IMAGE" | "LATEX" | "VIDEO";
  hint: string;
  answers: Answer[];
};

export type QuestionCardProps = {
  question: QuestionAnswer;
};
