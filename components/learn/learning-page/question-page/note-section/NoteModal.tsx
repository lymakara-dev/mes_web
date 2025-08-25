"use client";

import { useState, useEffect } from "react";

import { NoteInput } from "@/types/note";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: NoteInput) => void;
  initialNote?: NoteInput | null;
}

export default function NoteModal({
  isOpen,
  onClose,
  onSave,
  initialNote,
}: NoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Populate when editing
  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setContent(initialNote.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [initialNote]);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSave({ id: initialNote?.id, title, content });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {initialNote ? "Edit Note" : "New Note"}
        </h2>

        <input
          className="w-full border p-2 rounded mb-3 dark:bg-gray-700 dark:text-white"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-2 rounded mb-3 h-28 resize-none dark:bg-gray-700 dark:text-white"
          placeholder="Note Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
