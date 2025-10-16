// types.ts
export interface Note {
  id: number;
  title: string;
  note: string;
  questionId?: number;
  userId?: number;
}

// For creating/editing (id optional)
export type NoteInput = Omit<Note, "id"> & { id?: number };
