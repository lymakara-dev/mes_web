"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Button } from "@heroui/react"; // Import Button here
import { Plus } from "lucide-react"; // Import Plus icon
import { addToast } from "@heroui/react";

// Assuming these are the hooks/types from your provided API files:
import { QuestionApi, Question } from "@/hooks/learn/question-api";
import { AnswerApi, Answer } from "@/hooks/learn/answer-api";
import { SubjectApi, Subject } from "@/hooks/learn/subject-api";

import QuestionForm from "@/components/learn/admin/QuestionForm";
import QuestionList from "@/components/learn/admin/QuestionList";
import AnswerModal from "@/components/learn/admin/AnswerModal";
import DeleteQuestionModal from "@/components/learn/admin/DeleteQuestionModal";
import apiService from "@/service/api";
import { useParams } from "next/navigation";

const questionApi = QuestionApi();
const answerApi = AnswerApi();
const subjectApi = SubjectApi();

// --- Centralized Query Keys ---
const QUERY_KEYS = {
  questions: ["questions"],
  subjects: ["subjects"],
  answers: (questionId: number) => ["answers", questionId],
};

export default function ManageQuestionsPage() {
  const queryClient = useQueryClient();

  // --- Local UI State ---
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [deleteQuestionId, setDeleteQuestionId] = useState<number | null>(null);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  // ✨ NEW STATE: Controls the visibility of the form
  const [isFormOpen, setIsFormOpen] = useState(false);

  // --- Invalidation Functions ---
  const invalidateQuestions = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.questions });
  };

  const invalidateAnswers = () => {
    if (activeQuestionId) {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.answers(activeQuestionId),
      });
    }
  };

  // 1. Fetch Questions
  const {
    data: questions = [],
    isLoading: isQuestionsLoading,
    error: questionsError,
  } = useQuery<Question[], Error, Question[]>({
    queryKey: QUERY_KEYS.questions,
    queryFn: () => questionApi.getAll(),
  });

  // 2. Fetch Subjects
  const {
    data: subjects = [],
    isLoading: isSubjectsLoading,
    error: subjectsError,
  } = useQuery<Subject[], Error, Subject[]>({
    queryKey: QUERY_KEYS.subjects,
    queryFn: () => subjectApi.getAll(),
  });

  // 3. Fetch Answers (Conditional fetch based on modal state)
  const {
    data: answers = [],
    isLoading: isAnswersLoading,
    error: answersError,
  } = useQuery<Answer[], Error, Answer[]>({
    queryKey: QUERY_KEYS.answers(activeQuestionId || 0),
    queryFn: async () => {
      const res = await apiService.get(`/answers/question`, {
        questionId: activeQuestionId,
      });
      return res.data;
    },
    enabled: isAnswerModalOpen && activeQuestionId !== null,
  });

  console.log("answer=============", activeQuestionId);
  console.log("answer=============", answers);
  // --- Error Handling with useEffect ---
  useEffect(() => {
    if (questionsError) {
      addToast({ title: "Failed to load questions", color: "danger" });
    }
  }, [questionsError]);

  useEffect(() => {
    if (subjectsError) {
      addToast({ title: "Failed to load subjects", color: "danger" });
    }
  }, [subjectsError]);

  useEffect(() => {
    if (answersError && isAnswerModalOpen) {
      addToast({ title: "Failed to load answers", color: "danger" });
    }
  }, [answersError, isAnswerModalOpen]);

  // --- Handlers ---

  const handleShowAnswers = (questionId: number) => {
    setActiveQuestionId(questionId);
    setSelectedQuestion(
      questions.find((q: any) => q.id === questionId) || null,
    );
    // If we open the answer modal, close the main form
    setIsFormOpen(false);
    setIsAnswerModalOpen(true);
  };

  // Handler for opening the form for a new question
  const handleCreateNew = () => {
    setSelectedQuestion(null); // Ensure we are in create mode
    setIsFormOpen(true);
  };

  // Handler for closing the form (used by the form itself)
  const handleCloseForm = () => {
    setSelectedQuestion(null);
    setIsFormOpen(false);
  };

  // Handler for editing an existing question
  const handleEditQuestion = (q: Question) => {
    setSelectedQuestion(q);
    setIsFormOpen(true);
  };

  const handleCloseAnswerModal = () => {
    setIsAnswerModalOpen(false);
    setActiveQuestionId(null);
    setSelectedAnswer(null);
  };

  if (isQuestionsLoading || isSubjectsLoading) {
    return <div className="p-6 text-xl">Loading management data...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold">Manage Questions & Answers</p>

        {/* ✨ NEW BUTTON to open the form */}
        <Button
          color="primary"
          onClick={handleCreateNew}
          className="flex items-center"
        >
          <Plus size={20} className="mr-1" />
          Create New Question
        </Button>
      </div>

      {/* ✨ CONDITIONAL RENDERING of the Form */}
      {isFormOpen && (
        <Card className="p-4 space-y-4">
          <h2 className="text-xl font-semibold mb-4">
            {selectedQuestion ? "Edit Question" : "Create New Question"}
          </h2>
          <QuestionForm
            subjects={subjects}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
            invalidateQuestions={invalidateQuestions}
            handleShowAnswers={handleShowAnswers}
            onCancel={handleCloseForm} // Pass the new cancel handler
          />
        </Card>
      )}

      <QuestionList
        questions={questions}
        isLoading={isQuestionsLoading}
        handleEdit={handleEditQuestion} // Use the new handler
        handleShowAnswers={handleShowAnswers}
        setDeleteQuestionId={setDeleteQuestionId}
      />

      {/* Modals remain the same */}
      <AnswerModal
        isOpen={isAnswerModalOpen}
        onClose={handleCloseAnswerModal}
        selectedQuestion={selectedQuestion}
        answers={answers}
        invalidateAnswers={invalidateAnswers}
        isAnswersLoading={isAnswersLoading}
        selectedAnswer={selectedAnswer}
        setSelectedAnswer={setSelectedAnswer}
      />

      <DeleteQuestionModal
        isOpen={deleteQuestionId !== null}
        onClose={() => setDeleteQuestionId(null)}
        questionId={deleteQuestionId}
        invalidateQuestions={invalidateQuestions}
      />
    </div>
  );
}
