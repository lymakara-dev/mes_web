"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NoteList from "./note-section/NoteList";
import NoteModal from "./note-section/NoteModal";
import apiService from "@/service/api"; // Assuming your global API service
import { Note, NoteInput } from "@/types/note"; // Assuming these types are correct
import { addToast } from "@heroui/toast"; // Assuming this is imported globally

interface NoteSectionProps {
  questionId: number;
}

// ⭐️ FIX: Define separate endpoints for clarity and safety
// 1. Endpoint for fetching filtered notes
const NOTES_FETCH_ENDPOINT = "/user-notes/my-question-notes";
// 2. Endpoint for creation/deletion (often the base resource path)
const NOTES_CRUD_ENDPOINT = "/user-notes";

// Interface for the expected server response when querying (e.g., from Sequelize)
interface NoteResponse {
  count: number;
  rows: Note[];
}

export default function NoteSection({ questionId }: NoteSectionProps) {
  const queryClient = useQueryClient();
  // Query key uses the question ID to ensure uniqueness per question
  const notesQueryKey = ["userNotes", questionId];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // ---------------------------------------------------
  // 1. FETCH NOTES (useQuery) - FIXED
  // ---------------------------------------------------
  const { data, isLoading } = useQuery<Note[]>({
    queryKey: notesQueryKey,
    queryFn: async () => {
      // Expecting a direct array response (Note[])
      const res = await apiService.get<Note[]>(NOTES_FETCH_ENDPOINT, {
        questionId,
      });

      // Safely return the data array. If res.data is null/undefined/void, return [].
      return res.data || [];
    },
    enabled: !!questionId,
  });

  // Cast data to Note[] for use in component
  const notes = data || [];

  // ---------------------------------------------------
  // 2. DELETE NOTE (useMutation)
  // ---------------------------------------------------
  const deleteMutation = useMutation({
    mutationFn: (noteId: number) =>
      apiService.delete(`${NOTES_CRUD_ENDPOINT}/${noteId}`), // Use CRUD endpoint
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesQueryKey });
      addToast({
        title: "Deleted",
        description: "Note deleted successfully",
        color: "success",
      });
    },
    onError: (err: any) => {
      console.error("Delete failed:", err);
      addToast({
        title: "Error",
        description: "Failed to delete note",
        color: "danger",
      });
    },
  });

  // ---------------------------------------------------
  // 3. CREATE/UPDATE NOTE (useMutation) - FIXED (Security)
  // ---------------------------------------------------
  const saveMutation = useMutation({
    mutationFn: async (noteData: NoteInput) => {
      if (noteData.id) {
        // UPDATE (PATCH/PUT)
        return apiService.patch<Note>(`${NOTES_CRUD_ENDPOINT}/${noteData.id}`, {
          note: noteData.note,
        });
      } else {
        // CREATE (POST)
        const payload = {
          // ❌ FIX: Removed hardcoded userId. Server must infer this from the auth token.
          questionId: questionId,
          title: noteData.title,
          note: noteData.note,
        };
        return apiService.post<Note>(NOTES_CRUD_ENDPOINT, payload);
      }
    },
    onSuccess: (response, noteData) => {
      queryClient.invalidateQueries({ queryKey: notesQueryKey });

      const successTitle = noteData.id ? "Updated" : "Created";
      const successDescription = noteData.id
        ? "Note updated successfully"
        : "Note added successfully";

      addToast({
        title: successTitle,
        description: successDescription,
        color: "success",
      });

      setIsModalOpen(false);
      setSelectedNote(null);
    },
    onError: (err: any) => {
      console.error("Save failed:", err);
      addToast({
        title: "Error",
        description: "Failed to save note",
        color: "danger",
      });
    },
  });

  // ---------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (id: number) => {
    // Access notes from the local state/cache
    const note = notes.find((n) => n.id === id) || null;
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const handleSave = async (note: NoteInput) => {
    saveMutation.mutate(note);
  };

  // ---------------------------------------------------
  // RENDER
  // ---------------------------------------------------
  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading notes...</div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 rounded-2xl border border-gray-200">
      <h1 className="text-2xl font-bold mb-6">My Notes</h1>

      {/* List */}
      <NoteList
        // Use the 'notes' array from the data property
        notes={notes}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {/* Floating Plus Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
        onClick={handleAdd}
        disabled={saveMutation.isPending || deleteMutation.isPending}
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
        isSaving={saveMutation.isPending}
      />
    </div>
  );
}
