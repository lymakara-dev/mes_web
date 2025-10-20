"use client";
import React, { useState, useEffect } from "react";
import { Card, Input, Select, SelectItem, Button } from "@heroui/react";
import { addToast } from "@heroui/react";
import { QuestionApi, Question } from "@/hooks/learn/question-api";
import { Subject } from "@/hooks/learn/subject-api";

const questionApi = QuestionApi();

interface Props {
  subjects: Subject[];
  selectedQuestion: Question | null;
  setSelectedQuestion: (q: Question | null) => void;
  invalidateQuestions: () => void;
  handleShowAnswers: (id: number) => void;
  // ✨ NEW PROP: Handler to close the form from the parent
  onCancel: () => void;
}

export default function QuestionForm({
  subjects,
  selectedQuestion,
  setSelectedQuestion,
  invalidateQuestions,
  handleShowAnswers,
  onCancel, // Destructure new prop
}: Props) {
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [hint, setHint] = useState("");
  const [contentType, setContentType] = useState("TEXT");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedQuestion) {
      setSubjectId(selectedQuestion.subjectId);
      setContent(selectedQuestion.content);
      setHint(selectedQuestion.hint || "");
      setContentType(selectedQuestion.contentType);
      setFile(null);
    } else {
      resetForm();
    }
  }, [selectedQuestion]);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !content) {
      addToast({ title: "Please fill all required fields", color: "warning" });
      return;
    }

    setLoading(true);
    try {
      let resultQuestion: Question;

      if (selectedQuestion) {
        resultQuestion = await questionApi.update(
          selectedQuestion.id,
          subjectId,
          content,
          contentType,
          hint,
          file || undefined,
        );
        addToast({ title: "Question updated", color: "success" });
      } else {
        resultQuestion = await questionApi.create(
          subjectId,
          content,
          contentType,
          hint,
          file || undefined,
        );
        addToast({ title: "Question created", color: "success" });
      }

      invalidateQuestions();

      // Close the form after success
      onCancel();

      // Open answer modal right after successful save
      if (resultQuestion?.id) handleShowAnswers(resultQuestion.id);
    } catch (error: any) {
      addToast({
        title: "Failed to save question",
        description: error.message || "An error occurred.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubjectId(null);
    setContent("");
    setHint("");
    setContentType("TEXT");
    setFile(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Subject"
          placeholder="Select Subject"
          selectedKeys={
            subjectId !== null ? new Set([subjectId.toString()]) : new Set()
          }
          onSelectionChange={(keys) => {
            const key = Array.from(keys)[0];
            setSubjectId(key ? Number(key) : null);
          }}
          isRequired
        >
          {subjects.map((s) => (
            <SelectItem key={s.id}>{s.name}</SelectItem>
          ))}
        </Select>

        <Select
          label="Content Type"
          selectedKeys={new Set([contentType])}
          onSelectionChange={(keys) =>
            setContentType(Array.from(keys)[0] as string)
          }
        >
          <SelectItem key="TEXT">TEXT</SelectItem>
          <SelectItem key="IMAGE">IMAGE</SelectItem>
        </Select>

        <Input
          label="Question Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter the question text"
          isRequired
        />
        <Input
          label="Hint (optional)"
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          placeholder="Optional hint for the user"
        />
        <Input
          type="file"
          label={
            selectedQuestion
              ? "Upload new file to replace existing"
              : "Upload file (optional)"
          }
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          color="primary"
          onClick={handleSubmitQuestion}
          isLoading={loading}
        >
          {selectedQuestion ? "Update Question" : "Create Question"}
        </Button>
        {/* ✨ NEW BUTTON: Calls the onCancel prop */}
        <Button color="default" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
