export type Answer = {
  id: string;
  content: string;
  type: String;
  isCorrect: boolean;
};

export type Question = {
  id: number;
  subject: string;
  question: string;
  questionType: String;
  questionImage?: string;
  hint: string;
  answers: Answer[];
};

export type QuestionCardProps = {
  question: Question;
};
