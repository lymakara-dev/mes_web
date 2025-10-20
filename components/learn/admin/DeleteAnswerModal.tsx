"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { addToast } from "@heroui/react";
import { Answer, AnswerApi } from "@/hooks/learn/answer-api";

const answerApi = AnswerApi();

interface Props {
  isOpen: boolean;
  onClose: () => void;
  answerId: number | null;
  setAnswers: React.Dispatch<React.SetStateAction<Answer[]>>;
}

export default function DeleteAnswerModal({
  isOpen,
  onClose,
  answerId,
  setAnswers,
}: Props) {
  const handleDelete = async () => {
    if (!answerId) return;
    try {
      await answerApi.remove(answerId);
      setAnswers((prev) => prev.filter((a) => a.id !== answerId));
      addToast({ title: "Answer deleted", color: "success" });
    } catch {
      addToast({ title: "Failed to delete answer", color: "danger" });
    } finally {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Delete Answer</ModalHeader>
        <ModalBody>Are you sure you want to delete this answer?</ModalBody>
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
