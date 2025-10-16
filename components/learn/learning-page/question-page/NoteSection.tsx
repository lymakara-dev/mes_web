"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import NoteList from "./note-section/NoteList";
import NoteModal from "./note-section/NoteModal";

import { Note, NoteInput } from "@/types/note";
import { UserNoteApi } from "@/hooks/learn/user-note-api";
import { addToast } from "@heroui/toast";

interface NoteSectionProps {
  questionId: number;
}

export default function NoteSection({ questionId }: NoteSectionProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);

  console.log("note", notes);

  const api = UserNoteApi();
  // 🧠 Load notes from backend when component mounts
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const res = await api.getMyQuestionNotes({
          questionId,
        });
        setNotes(res);
      } catch (err) {
        console.error("Failed to load notes:", err);
        addToast({ title: "Error", description: "Failed to load notes" });
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // 🗑 Delete note
  const handleDelete = async (id: number) => {
    try {
      await api.deleteUserNote(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
      addToast({ title: "Deleted", description: "Note deleted successfully" });
    } catch (err) {
      console.error("Delete failed:", err);
      addToast({ title: "Error", description: "Failed to delete note" });
    }
  };

  // ✏️ Edit note
  const handleEdit = (id: number) => {
    const note = notes.find((n) => n.id === id) || null;
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  // ➕ Add new note
  const handleAdd = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  // 💾 Save (create or update)
  const handleSave = async (note: NoteInput) => {
    try {
      if (note.id) {
        // Update existing
        const updated = await api.updateUserNote(note.id, {
          // title: note.title,
          note: note.note,
        });
        setNotes((prev) => prev.map((n) => (n.id === note.id ? updated : n)));
        addToast({
          title: "Updated",
          description: "Note updated successfully",
        });
      } else {
        // Create new
        const created = await api.createUserNote({
          userId: 1, // dynamic from auth
          questionId: 1, // dynamic current question
          title: note.title,
          note: note.note,
        });

        setNotes((prev) => [...prev, created]);
        addToast({ title: "Created", description: "Note added successfully" });
      }
    } catch (err) {
      console.error("Save failed:", err);
      addToast({ title: "Error", description: "Failed to save note" });
    }
  };

  return (
    <div className="w-full mx-auto p-6 rounded-2xl border border-gray-200">
      <h1 className="text-2xl font-bold mb-6">My Notes</h1>

      {/* List */}
      <NoteList notes={notes} onDelete={handleDelete} onEdit={handleEdit} />

      {/* Floating Plus Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
        onClick={handleAdd}
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Note Modal (for add & edit) */}
      <NoteModal
        initialNote={selectedNote}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNote(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
