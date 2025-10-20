'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  confirmButtonColor?: "primary" | "danger" | "default";
  isLoading: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  confirmButtonColor = "danger",
  isLoading,
}: ConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody><p>{message}</p></ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button
                color={confirmButtonColor}
                isLoading={isLoading}
                onPress={onConfirm}
              >
                {confirmText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};