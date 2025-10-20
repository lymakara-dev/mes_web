"use client";
import React from "react";
import { Button, Spinner } from "@heroui/react";
import { Question } from "@/hooks/learn/question-api";

interface Props {
  questions: Question[];
  isLoading: boolean;
  handleEdit: (q: Question) => void;
  handleShowAnswers: (id: number) => void;
  setDeleteQuestionId: (id: number) => void;
}

export default function QuestionList({
  questions,
  isLoading,
  handleEdit,
  handleShowAnswers,
  setDeleteQuestionId,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner size="lg" />
        <p className="ml-3 text-gray-500">Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <p className="text-gray-500 p-4">
        No questions found. Start by creating one!
      </p>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2"
            >
              Question Content
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Hint
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {questions.map((q) => (
            <tr key={q.id} className="hover:bg-gray-50">
              {/* Question Content */}
              <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 max-w-lg">
                <div className="line-clamp-2">{q.content}</div>
              </td>

              {/* Type */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {q.contentType}
              </td>

              {/* Hint */}
              <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs">
                {q.hint || "—"}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Button
                    color="default"
                    size="sm"
                    onClick={() => handleEdit(q)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="secondary"
                    size="sm"
                    onClick={() => handleShowAnswers(q.id)}
                  >
                    Answers
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => setDeleteQuestionId(q.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
