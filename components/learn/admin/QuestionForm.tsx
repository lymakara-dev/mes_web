"use client";
import React, { useState } from "react";
import { Card, Input, Select, SelectItem, Button } from "@heroui/react";
import { addToast } from "@heroui/react";
import { QuestionApi, Question } from "@/hooks/learn/question-api";
import { Subject } from "@/hooks/learn/subject-api";

const questionApi = QuestionApi();

interface Props {
  subjects: Subject[];
  selectedQuestion: Question | null;
  setSelectedQuestion: (q: Question | null) => void;
  fetchData: () => void;
  handleShowAnswers: (id: number) => void;
}

export default function QuestionForm({
  subjects,
  selectedQuestion,
  setSelectedQuestion,
  fetchData,
  handleShowAnswers,
}: Props) {
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [hint, setHint] = useState("");
  const [contentType, setContentType] = useState("TEXT");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !content) {
      addToast({ title: "Please fill all required fields", color: "warning" });
      return;
    }

    setLoading(true);
    try {
      let createdQuestion: Question;

      if (selectedQuestion) {
        await questionApi.update(
          selectedQuestion.id,
          subjectId,
          content,
          contentType,
          hint,
          file || undefined
        );
        addToast({ title: "Question updated", color: "success" });
        createdQuestion = selectedQuestion;
      } else {
        const res = await questionApi.create(
          subjectId,
          content,
          contentType,
          hint,
          file || undefined
        );
        addToast({ title: "Question created", color: "success" });
        createdQuestion = res;
      }

      if (createdQuestion?.id) handleShowAnswers(createdQuestion.id);
      setSelectedQuestion(null);
      resetForm();
      fetchData();
    } catch {
      addToast({ title: "Failed to save question", color: "danger" });
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
    <Card className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Subject"
          selectedKeys={
            subjectId !== null ? new Set([subjectId.toString()]) : new Set()
          }
          onSelectionChange={(keys) => {
            const key = Array.from(keys)[0];
            setSubjectId(key ? Number(key) : null);
          }}
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

        <Input label="Question Content" value={content} onChange={(e) => setContent(e.target.value)} />
        <Input label="Hint (optional)" value={hint} onChange={(e) => setHint(e.target.value)} />
        <Input type="file" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
      </div>

      <Button color="primary" onClick={handleSubmitQuestion} isLoading={loading}>
        {selectedQuestion ? "Update Question" : "Create Question"}
      </Button>
    </Card>
  );
}
