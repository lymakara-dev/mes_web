"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  Input,
  Select,
  SelectItem,
  Button,
  Checkbox,
} from "@heroui/react";
import { addToast } from "@heroui/react";
import { AnswerApi, Answer } from "@/hooks/learn/answer-api";
import { Question } from "@/hooks/learn/question-api";
import { Trash2 } from "lucide-react";

const answerApi = AnswerApi();

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedQuestion: Question | null;
  answers: Answer[];
  // CHANGED: Use invalidate instead of setAnswers
  invalidateAnswers: () => void; 
  isAnswersLoading: boolean; // ADDED
  selectedAnswer: Answer | null;
  setSelectedAnswer: (answer: Answer | null) => void;
}

export default function AnswerModal({
  isOpen,
  onClose,
  selectedQuestion,
  answers,
  invalidateAnswers,
  isAnswersLoading,
  selectedAnswer,
  setSelectedAnswer,
}: Props) {
  const [answerContent, setAnswerContent] = useState("");
  const [answerContentType, setAnswerContentType] = useState("TEXT");
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null); // For individual delete loading state

  // Fill form when editing
  useEffect(() => {
    if (selectedAnswer) {
      setAnswerContent(selectedAnswer.content);
      setAnswerContentType(selectedAnswer.contentType);
      setIsCorrect(selectedAnswer.isCorrect);
    } else {
      resetForm();
    }
  }, [selectedAnswer]);

  const resetForm = () => {
    setAnswerContent("");
    setAnswerContentType("TEXT");
    setAnswerFile(null);
    setIsCorrect(false);
    setSelectedAnswer(null);
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !answerContent) {
      addToast({ title: "Please fill all fields", color: "warning" });
      return;
    }

    setLoading(true);
    try {
      if (selectedAnswer) {
        await answerApi.update(
          selectedAnswer.id,
          answerContent,
          answerContentType,
          isCorrect,
          answerFile || undefined,
        );
        addToast({ title: "Answer updated", color: "success" });
      } else {
        await answerApi.create(
          selectedQuestion.id,
          answerContent,
          answerContentType,
          isCorrect,
          answerFile || undefined,
        );
        addToast({ title: "Answer added", color: "success" });
      }
      
      // Trigger refetch of answers
      invalidateAnswers(); 
      resetForm();
    } catch (err) {
      console.error(err);
      addToast({ title: "Failed to save answer", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnswer = async (answerId: number) => {
    setDeletingId(answerId);
    try {
      await answerApi.remove(answerId);
      // Trigger refetch of answers
      invalidateAnswers(); 
      addToast({ title: "Answer deleted", color: "success" });
    } catch {
      addToast({ title: "Failed to delete answer", color: "danger" });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="3xl">
      <ModalContent>
        <ModalHeader>
          Manage Answers for: {selectedQuestion?.content}
        </ModalHeader>
        <ModalBody>
          {/* Answer Form */}
          <Card className="p-4 space-y-4 mb-4">
            <p className="font-semibold text-lg">{selectedAnswer ? "Edit Answer" : "Add New Answer"}</p>
            <Input
              label="Answer Content"
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="Enter the answer text"
            />
            <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Content Type"
                  selectedKeys={new Set([answerContentType])}
                  onSelectionChange={(keys) =>
                    setAnswerContentType(Array.from(keys)[0] as string)
                  }
                >
                  <SelectItem key="TEXT">TEXT</SelectItem>
                  <SelectItem key="IMAGE">IMAGE</SelectItem>
                </Select>
                <Input
                  type="file"
                  label="Upload image (optional)"
                  onChange={(e) =>
                    e.target.files && setAnswerFile(e.target.files[0])
                  }
                />
            </div>
            <Checkbox isSelected={isCorrect} onValueChange={setIsCorrect}>
              Correct Answer
            </Checkbox>

            <div className="flex gap-2">
                <Button
                  color="primary"
                  onClick={handleSubmitAnswer}
                  isLoading={loading}
                >
                  {selectedAnswer ? "Update Answer" : "Add Answer"}
                </Button>
                {selectedAnswer && (
                    <Button color="default" onClick={() => setSelectedAnswer(null)}>
                        Cancel Edit
                    </Button>
                )}
            </div>
          </Card>

          {/* Answer List */}
          <p className="font-semibold text-lg mt-4">Current Answers</p>
          {isAnswersLoading ? (
            <p>Loading answers...</p>
          ) : answers.length === 0 ? (
            <p className="text-gray-500">No answers added yet.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {answers.map((a) => (
                <Card
                  key={a.id}
                  className="p-3 flex justify-between items-center border-l-4"
                  style={{ borderColor: a.isCorrect ? '#10B981' : '#E5E7EB' }}
                >
                  <p className="flex-1 mr-4">
                    {a.content}{" "}
                    {a.isCorrect && (
                      <span className="text-green-600 font-semibold text-sm ml-1">
                        (Correct)
                      </span>
                    )}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setSelectedAnswer(a)} disabled={deletingId === a.id}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      color="danger"
                      isIconOnly
                      onClick={() => handleDeleteAnswer(a.id)}
                      isLoading={deletingId === a.id}
                    >
                        <Trash2 size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}