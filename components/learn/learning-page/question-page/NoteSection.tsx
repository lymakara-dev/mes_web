"use client";

import { useState } from "react";
import NoteList from "./note-section/NoteList";
import { Plus } from "lucide-react";
import NoteModal from "./note-section/NoteModal";
import { NoteInput } from "@/types/note";

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function NoteSection() {
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, title: "First Note", content: "This is the first note." },
    { id: 2, title: "Second Note", content: "Another note content here." },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleDelete = (id: number) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const handleEdit = (id: number) => {
    const note = notes.find((n) => n.id === id) || null;
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedNote(null); // means create new
    setIsModalOpen(true);
  };

  const handleSave = (note: NoteInput) => {
    if (note.id) {
      // Editing existing
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, ...note } : n))
      );
    } else {
      // Creating new
      const newNote: Note = {
        id: Date.now(),
        title: note.title,
        content: note.content,
      };
      setNotes((prev) => [...prev, newNote]);
    }
  };

  return (
    <div className="w-full mx-auto p-6 rounded-2xl border border-gray-200">
      <h1 className="text-2xl font-bold mb-6">My Notes</h1>

      {/* List */}
      <NoteList notes={notes} onDelete={handleDelete} onEdit={handleEdit} />

      {/* Floating Plus Button */}
      <button
        onClick={handleAdd}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Note Modal (for add & edit) */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNote(null);
        }}
        onSave={handleSave}
        initialNote={selectedNote}
      />
    </div>
  );
}
