"use client";

import { Edit, Trash } from "lucide-react";

interface NoteCardProps {
  note: { id: number; title: string; content: string };
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

export default function NoteCard({ note, onDelete, onEdit }: NoteCardProps) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-md flex flex-col justify-between hover:shadow-lg transition">
      <div>
        <h3 className="text-lg font-semibold">{note.title}</h3>
        <p className="text-gray-600 mt-2">{note.content}</p>
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <button
          className="p-2 rounded-lg hover:bg-gray-100"
          onClick={() => onEdit(note.id)}
        >
          <Edit size={18} />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-gray-100 text-red-500"
          onClick={() => onDelete(note.id)}
        >
          <Trash size={18} />
        </button>
      </div>
    </div>
  );
}
