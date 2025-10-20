"use client";

import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { addToast } from "@heroui/react";
import { QuestionApi } from "@/hooks/learn/question-api";

const questionApi = QuestionApi();

interface Props {
  isOpen: boolean;
  onClose: () => void;
  questionId: number | null;
  // CHANGED: Use invalidate to refetch data
  invalidateQuestions: () => void;
}

export default function DeleteQuestionModal({
  isOpen,
  onClose,
  questionId,
  invalidateQuestions,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!questionId) return;

    setLoading(true);
    try {
      await questionApi.remove(questionId);
      addToast({ title: "Question deleted", color: "success" });
      // Trigger refetch of questions
      invalidateQuestions();
    } catch {
      addToast({ title: "Failed to delete question", color: "danger" });
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Delete Question</ModalHeader>
        <ModalBody>Are you sure you want to permanently delete this question? This action cannot be undone.</ModalBody>
        <ModalFooter>
          <Button onClick={onClose} isDisabled={loading}>Cancel</Button>
          <Button color="danger" onClick={handleDelete} isLoading={loading}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}