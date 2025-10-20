"use client";

import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { addToast } from "@heroui/react";
import { QuestionApi } from "@/hooks/learn/question-api";

const questionApi = QuestionApi();

interface Props {
  isOpen: boolean;
  onClose: () => void;
  questionId: number | null;
  refreshQuestions: () => void;
}

export default function DeleteQuestionModal({
  isOpen,
  onClose,
  questionId,
  refreshQuestions,
}: Props) {
  const handleDelete = async () => {
    if (!questionId) return;

    try {
      await questionApi.remove(questionId);
      addToast({ title: "Question deleted", color: "success" });
      refreshQuestions();
    } catch {
      addToast({ title: "Failed to delete question", color: "danger" });
    } finally {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Delete Question</ModalHeader>
        <ModalBody>Are you sure you want to delete this question?</ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button color="danger" onClick={handleDelete}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
