"use client";

import { useState, useEffect } from "react";

import { NoteInput } from "@/types/note";

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Note: Since onSave is expected to trigger a mutation, its return type is often void or Promise<void>
  onSave: (note: NoteInput) => void; 
  initialNote?: NoteInput | null;
  // ⭐️ FIX 1: Add the missing prop ⭐️
  isSaving: boolean; 
}

export default function NoteModal({
  isOpen,
  onClose,
  onSave,
  initialNote,
  isSaving, // ⭐️ Destructure the new prop ⭐️
}: NoteModalProps) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  // Populate when editing
  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title);
      setNote(initialNote.note);
    } else {
      setTitle("");
      setNote("");
    }
    // Dependency array is correct
  }, [initialNote]);

  const handleSubmit = () => {
    if (!title.trim() || !note.trim()) return;
    
    // Call the onSave function from the parent
    onSave({ id: initialNote?.id, title, note });
    
    // The parent component should handle closing the modal 
    // in its onSuccess handler, but we'll keep onClose here 
    // for immediate UI feedback on successful sync calls.
    // However, since we are using TanStack Query, it's better 
    // for the parent to call onClose only upon successful mutation.
    // For now, we'll keep your original logic.
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
          disabled={isSaving} // Disable input while saving
        />

        <textarea
          className="w-full border p-2 rounded mb-3 h-28 resize-none dark:bg-gray-700 dark:text-white"
          placeholder="Note Content"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={isSaving} // Disable input while saving
        />

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white disabled:opacity-50"
            onClick={onClose}
            disabled={isSaving} // Prevent closing while saving
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isSaving || !title.trim() || !note.trim()} // ⭐️ FIX 2: Disable while saving ⭐️
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}