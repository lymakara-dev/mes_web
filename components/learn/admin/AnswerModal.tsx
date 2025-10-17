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

const answerApi = AnswerApi();

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedQuestion: Question | null;
  answers: Answer[];
  setAnswers: React.Dispatch<React.SetStateAction<Answer[]>>;
  selectedAnswer: Answer | null;
  setSelectedAnswer: (answer: Answer | null) => void;
  deleteAnswerId: number | null;
  setDeleteAnswerId: (id: number | null) => void;
}

export default function AnswerModal({
  isOpen,
  onClose,
  selectedQuestion,
  answers,
  setAnswers,
  selectedAnswer,
  setSelectedAnswer,
  deleteAnswerId,
  setDeleteAnswerId,
}: Props) {
  const [answerContent, setAnswerContent] = useState("");
  const [answerContentType, setAnswerContentType] = useState("TEXT");
  const [answerFile, setAnswerFile] = useState<File | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);

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
        const newAnswer = await answerApi.create(
          selectedQuestion.id,
          answerContent,
          answerContentType,
          isCorrect,
          answerFile || undefined,
        );
        setAnswers([...answers, newAnswer]);
        addToast({ title: "Answer added", color: "success" });
      }
      resetForm();
    } catch (err) {
      console.error(err);
      addToast({ title: "Failed to save answer", color: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnswer = async () => {
    if (!deleteAnswerId) return;
    try {
      await answerApi.remove(deleteAnswerId);
      setAnswers((prev) => prev.filter((a) => a.id !== deleteAnswerId));
      addToast({ title: "Answer deleted", color: "success" });
    } catch {
      addToast({ title: "Failed to delete answer", color: "danger" });
    } finally {
      setDeleteAnswerId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Manage Answers</ModalHeader>
        <ModalBody>
          {/* Answer Form */}
          <Card className="p-3 space-y-3">
            <Input
              label="Answer Content"
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
            />
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
              onChange={(e) =>
                e.target.files && setAnswerFile(e.target.files[0])
              }
            />
            <Checkbox isSelected={isCorrect} onValueChange={setIsCorrect}>
              Correct Answer
            </Checkbox>

            <Button
              color="primary"
              onClick={handleSubmitAnswer}
              isLoading={loading}
            >
              {selectedAnswer ? "Update Answer" : "Add Answer"}
            </Button>
          </Card>

          {/* Answer List */}
          <div className="space-y-2 mt-3">
            {answers.map((a) => (
              <Card
                key={a.id}
                className="p-2 flex justify-between items-center"
              >
                <p>
                  {a.content}{" "}
                  {a.isCorrect && (
                    <span className="text-green-500 font-semibold">
                      (Correct)
                    </span>
                  )}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setSelectedAnswer(a)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    onClick={() => setDeleteAnswerId(a.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
          {deleteAnswerId && (
            <Button color="danger" onClick={handleDeleteAnswer}>
              Delete Selected Answer
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
