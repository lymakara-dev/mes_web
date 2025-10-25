export interface ISchool {
  id: number;
  name: string;
  logoUrl: string;
  subjectCount: number;
}

export interface ISubject {
  id: number;
  schoolId: number;
  name: string;
  logoUrl: string;
  questionCount: number;
  userProgress: number;
}

export interface IAnswer {
  id: number;
  questionId: number;
  content: string;
  contentType: "TEXT" | "IMAGE" | "LATEX" | "VIDEO";
  isCorrect: boolean;
}

export interface IQuestionAnswer {
  id: number;
  subjectId: number;
  content: string;
  contentType: "TEXT" | "IMAGE" | "LATEX" | "VIDEO";
  hint: string;
  answers: IAnswer[];
}

// Types matching your NestJS DTOs (optional but recommended)
export interface InitiateChatPayload {
  questionId: number;
}
export interface SendMessagePayload {
  message: string;
}
export interface RagChatPayload {
  documentId: string;
  message: string;
}

// Response types expected from your backend
export interface InitiateChatResponse {
  firstMessage: string;
}
export interface SendMessageResponse {
  response: string;
}
export interface RagChatResponse {
  response: string;
}
