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

// ⭐️ The base endpoint for notes
const NOTES_ENDPOINT = "/user-notes";

export default function NoteSection({ questionId }: NoteSectionProps) {
  const queryClient = useQueryClient();
  const notesQueryKey = ["userNotes", questionId];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // ---------------------------------------------------
  // 1. FETCH NOTES (useQuery)
  // ---------------------------------------------------
  const { data: notes, isLoading } = useQuery<Note[]>({
    queryKey: notesQueryKey,
    queryFn: async () => {
      // Endpoint: GET /api/user-notes?questionId=X
      const res = await apiService.get<Note[]>(NOTES_ENDPOINT, { questionId });
      // Assuming the API returns the array directly in res.data
      return res.data;
    },
    enabled: !!questionId,
  });

  // ---------------------------------------------------
  // 2. DELETE NOTE (useMutation)
  // ---------------------------------------------------
  const deleteMutation = useMutation({
    // Endpoint: DELETE /api/user-notes/:id
    mutationFn: (noteId: number) => apiService.delete(`${NOTES_ENDPOINT}/${noteId}`),
    onSuccess: () => {
      // Invalidate the query to force a fresh fetch and UI update
      queryClient.invalidateQueries({ queryKey: notesQueryKey });
      addToast({ title: "Deleted", description: "Note deleted successfully", color: "success" });
    },
    onError: (err: any) => {
      console.error("Delete failed:", err);
      addToast({ title: "Error", description: "Failed to delete note", color: "danger" });
    },
  });

  // ---------------------------------------------------
  // 3. CREATE/UPDATE NOTE (useMutation) - Single function for both
  // ---------------------------------------------------
  const saveMutation = useMutation({
    mutationFn: async (noteData: NoteInput) => {
      if (noteData.id) {
        // UPDATE (PATCH/PUT)
        // Endpoint: PATCH /api/user-notes/:id
        return apiService.patch<Note>(`${NOTES_ENDPOINT}/${noteData.id}`, {
          note: noteData.note, // Only sending fields that are updated
        });
      } else {
        // CREATE (POST)
        // Endpoint: POST /api/user-notes
        const payload = {
          // ⚠️ NOTE: You must replace '1' with actual dynamic values
          userId: 1, 
          questionId: questionId, // Use prop here
          title: noteData.title,
          note: noteData.note,
        };
        return apiService.post<Note>(NOTES_ENDPOINT, payload);
      }
    },
    onSuccess: (response, noteData) => {
      // Invalidate query to refresh list
      queryClient.invalidateQueries({ queryKey: notesQueryKey });
      
      const successTitle = noteData.id ? "Updated" : "Created";
      const successDescription = noteData.id ? "Note updated successfully" : "Note added successfully";
      
      addToast({ title: successTitle, description: successDescription, color: "success" });
      
      // Close modal and clear selection
      setIsModalOpen(false);
      setSelectedNote(null);
    },
    onError: (err: any) => {
      console.error("Save failed:", err);
      addToast({ title: "Error", description: "Failed to save note", color: "danger" });
    },
  });

  // ---------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------

  // 🗑 Delete note
  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // ✏️ Edit note
  const handleEdit = (id: number) => {
    const note = notes?.find((n) => n.id === id) || null;
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
        notes={notes || []} 
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