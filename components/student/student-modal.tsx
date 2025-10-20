"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  addToast,
} from "@heroui/react";
import { Save, Plus } from "lucide-react";
import {
  ICreateStudentPayload,
  IStudent,
  IUpdateStudentPayload,
} from "@/types/type";

interface StudentModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSubmit: (payload: ICreateStudentPayload | IUpdateStudentPayload) => void;
  isLoading: boolean;
  initialData: IStudent | null; // Pass student to edit, or null to create
}

export const StudentModal = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
  initialData,
}: StudentModalProps) => {
  // State for fields that are either on the DTO or displayed/edited
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState(""); // Kept for display/edit in userInfo
  const [username, setUsername] = useState(""); // Only used for Create payload / display
  const [password, setPassword] = useState("");

  const isEditing = !!initialData;
  const modalTitle = isEditing ? "Edit Student" : "Create New Student";
  const buttonText = isEditing ? "Save Changes" : "Create Student";

  useEffect(() => {
    if (isOpen) {
      if (isEditing && initialData) {
        // Read data from the nested 'userInfo' object and top-level 'username'
        setFirstname(initialData.userInfo?.firstname || "");
        setLastname(initialData.userInfo?.lastname || "");
        setEmail(initialData.userInfo?.email || ""); // Display existing email for context
        setUsername(initialData.username);
        setPassword(""); // Always clear password field on open
      } else {
        // Reset all fields for creation
        setFirstname("");
        setLastname("");
        setEmail("");
        setUsername("");
        setPassword("");
      }
    }
  }, [isOpen, initialData, isEditing]);

  const handleSubmit = () => {
    // --- Validation ---
    if (!firstname || !lastname) {
      addToast({
        title: "Validation Error",
        description: "First Name and Last Name are required.",
        color: "warning",
      });
      return;
    }

    if (isEditing) {
      // NOTE: We assume IUpdateStudentPayload is flexible enough to take the fields below.
      // We must send 'email' here because it's editable and part of IUpdateStudentPayload.
      const payload: IUpdateStudentPayload = {
        firstname,
        lastname,
        email,
        // Assuming phone is included if you decide to add that input later
      };

      // Only include password if the field is not empty
      if (password) {
        (payload as any).password = password; // Assuming 'password?: string' should be on IUpdateStudentPayload
      }

      onSubmit(payload);
    } else {
      // Creation logic based on your ICreateStudentPayload
      if (!username || !password) {
        addToast({
          title: "Validation Error",
          description: "Username and Password are required for new students.",
          color: "warning",
        });
        return;
      }

      // FIX 1: Construct ICreateStudentPayload with only DTO fields
      const payload: ICreateStudentPayload = {
        username,
        // password needs to be set if not optional, but your DTO has it as optional,
        // though your validation requires it. We'll include it.
        password,
        firstname,
        lastname,
      };

      onSubmit(payload);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{modalTitle}</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {/* Name Fields */}
                <div className="flex gap-4">
                  <Input
                    label="First Name"
                    value={firstname}
                    onValueChange={setFirstname}
                    isRequired
                    autoFocus={!isEditing}
                  />
                  <Input
                    label="Last Name"
                    value={lastname}
                    onValueChange={setLastname}
                    isRequired
                  />
                </div>

                {/* Username Field (Only for Create) */}
                {!isEditing && (
                  <Input
                    label="Username"
                    value={username}
                    onValueChange={setUsername}
                    isRequired={!isEditing}
                    placeholder="e.g., john_doe"
                    autoFocus={!isEditing}
                  />
                )}

                {/* Email Field - Readonly for Create, Editable for Edit (for userInfo) */}
                {/* If the backend automatically handles userInfo creation/update from these fields, this is fine */}
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onValueChange={setEmail}
                  // Email is required if editing, but not needed in the creation payload
                  isRequired={isEditing}
                  isDisabled={!isEditing}
                  placeholder={
                    isEditing
                      ? "Enter student's email"
                      : "Email is set upon account creation"
                  }
                />

                {/* Password Field */}
                <Input
                  label="Password"
                  type="password"
                  placeholder={
                    isEditing
                      ? "Leave blank to keep current password"
                      : "Enter new password"
                  }
                  value={password}
                  onValueChange={setPassword}
                  isRequired={!isEditing} // Required for new user, optional for existing
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={isLoading}
                startContent={
                  isEditing ? <Save size={16} /> : <Plus size={16} />
                }
              >
                {buttonText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
