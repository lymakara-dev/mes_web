"use client";

import React, { useEffect, useState } from "react";
import { Card, Button } from "@heroui/react";
import { addToast } from "@heroui/react";
import { QuestionApi, Question } from "@/hooks/learn/question-api";
import { AnswerApi, Answer } from "@/hooks/learn/answer-api";
import { SubjectApi, Subject } from "@/hooks/learn/subject-api";
import QuestionForm from "@/components/learn/admin/QuestionForm";
import QuestionList from "@/components/learn/admin/QuestionList";
import AnswerModal from "@/components/learn/admin/AnswerModal";
import DeleteQuestionModal from "@/components/learn/admin/DeleteQuestionModal";
import DeleteAnswerModal from "@/components/learn/admin/DeleteAnswerModal";
const questionApi = QuestionApi();
const answerApi = AnswerApi();
const subjectApi = SubjectApi();

export default function ManageQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);

  const [deleteQuestionId, setDeleteQuestionId] = useState<number | null>(null);
  const [deleteAnswerId, setDeleteAnswerId] = useState<number | null>(null);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);

  // Load all data
  const fetchData = async () => {
    try {
      const [q, s] = await Promise.all([
        questionApi.getAll(),
        subjectApi.getAll(),
      ]);
      setQuestions(q);
      setSubjects(s);
    } catch {
      addToast({ title: "Failed to load data", color: "danger" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Show answers for selected question
  const handleShowAnswers = async (questionId: number) => {
    try {
      const data = await answerApi.getByQuestion(questionId);
      setAnswers(data);
      setSelectedQuestion(questions.find((q) => q.id === questionId) || null);
      setIsAnswerModalOpen(true);
    } catch {
      addToast({ title: "Failed to load answers", color: "danger" });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <p className="text-2xl font-bold">Manage Questions & Answers</p>

      <QuestionForm
        subjects={subjects}
        selectedQuestion={selectedQuestion}
        setSelectedQuestion={setSelectedQuestion}
        fetchData={fetchData}
        handleShowAnswers={handleShowAnswers}
      />

      <QuestionList
        questions={questions}
        handleEdit={setSelectedQuestion}
        handleShowAnswers={handleShowAnswers}
        setDeleteQuestionId={setDeleteQuestionId}
        answers={answers}
      />

      <AnswerModal
        isOpen={isAnswerModalOpen}
        onClose={() => setIsAnswerModalOpen(false)}
        selectedQuestion={selectedQuestion}
        answers={answers}
        setAnswers={setAnswers}
        selectedAnswer={selectedAnswer}
        setSelectedAnswer={setSelectedAnswer}
        deleteAnswerId={deleteAnswerId}
        setDeleteAnswerId={setDeleteAnswerId}
      />

      <DeleteQuestionModal
        isOpen={deleteQuestionId !== null}
        onClose={() => setDeleteQuestionId(null)}
        questionId={deleteQuestionId}
        refreshQuestions={fetchData}
      />

      <DeleteAnswerModal
        isOpen={deleteAnswerId !== null}
        onClose={() => setDeleteAnswerId(null)}
        answerId={deleteAnswerId}
        setAnswers={setAnswers}
      />
    </div>
  );
}
