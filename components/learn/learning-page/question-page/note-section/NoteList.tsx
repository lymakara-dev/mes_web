"use client";

import NoteCard from "./NoteCard";

interface Note {
  id: number;
  title: string;
  content: string;
}

interface NoteListProps {
  notes: Note[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

export default function NoteList({ notes, onDelete, onEdit }: NoteListProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.length > 0 ? (
        notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))
      ) : (
        <p className="text-gray-500 text-center col-span-full">
          No notes yet. Add one!
        </p>
      )}
    </div>
  );
}
