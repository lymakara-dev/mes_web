export type Answer = {
  id: number;
  questionId: number;
  content: string;
  contentType: "text" | "image" | "latex" | "video";
  isCorrect: boolean;
};

export type QuestionAnswer = {
  id: number;
  subjectId: number;
  content: string;
  contentType: "text" | "image" | "latex" | "video";
  hint: string;
  answers: Answer[];
};

export type QuestionCardProps = {
  question: QuestionAnswer;
};
