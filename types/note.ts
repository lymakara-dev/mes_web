// types.ts
export interface Note {
  id: number;
  title: string;
  content: string;
}

// For creating/editing (id optional)
export type NoteInput = Omit<Note, "id"> & { id?: number };
