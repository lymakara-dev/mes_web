"use client";
import React from "react";
import { Card, Button } from "@heroui/react";
import { Question } from "@/hooks/learn/question-api";
import { Answer } from "@/hooks/learn/answer-api";

interface Props {
  questions: Question[];
  answers: Answer[];
  handleEdit: (q: Question) => void;
  handleShowAnswers: (id: number) => void;
  setDeleteQuestionId: (id: number) => void;
}

export default function QuestionList({
  questions,
  answers,
  handleEdit,
  handleShowAnswers,
  setDeleteQuestionId,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {questions.map((q) => (
        <Card key={q.id} className="p-4 flex justify-between items-center">
          <div>
            <p className="font-semibold">{q.content}</p>
            {q.hint && <p className="text-sm text-gray-500">Hint: {q.hint}</p>}
          </div>
          <div className="flex gap-2">
            <Button color="default" size="sm" onClick={() => handleEdit(q)}>
              Edit
            </Button>
            <Button color="secondary" size="sm" onClick={() => handleShowAnswers(q.id)}>
              {answers.length > 0 ? "Manage Answers" : "Add Answers"}
            </Button>
            <Button color="danger" size="sm" onClick={() => setDeleteQuestionId(q.id)}>
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
