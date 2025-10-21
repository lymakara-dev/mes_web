// src/types/question-answer.ts (or the unified file)

export type Answer = {
  // ⭐️ CRITICAL FIX: Change 'string' to 'number' ⭐️
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

// Ensure your query type is an alias of the correct structure
export type Question = QuestionAnswer;