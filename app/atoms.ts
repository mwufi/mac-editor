import { atom } from "jotai";
import { Note, User, Collection } from "./types";
import { Editor } from "@tiptap/react";

export const collectionsAtom = atom<Collection[]>([]);
export const selectedCollectionIdAtom = atom<string | null>(null);
export const selectedCollectionAtom = atom((get) => {
  const id = get(selectedCollectionIdAtom);
  const collections = get(collectionsAtom);
  return collections.find((collection) => collection.id === id) || null;
});

export const collectionNotesAtom = atom<Note[]>([]);
export const selectedNoteIdAtom = atom<string | null>(null);
export const initialContentAtom = atom<string | null>(null);

// only gets the selected note when the selected note id changes
export const selectedNoteAtom = atom<Note | null>((get) => {
  const id = get(selectedNoteIdAtom);
  const notes = get(collectionNotesAtom);
  return notes.find((note) => note.id === id) || null;
});

// write-only atom to update the content of the selected note
export const updateContentAtom = atom(null, (get, set, update: string) => {
  const id = get(selectedNoteIdAtom);
  const notes = get(collectionNotesAtom);
  const updatedNotes = notes.map((note) => {
    if (note.id === id) {
      return { ...note, content: update };
    }
    return note;
  });
  set(collectionNotesAtom, updatedNotes as Note[]);
});

export const updateTitleAtom = atom(null, (get, set, update: string) => {
  const id = get(selectedNoteIdAtom);
  const notes = get(collectionNotesAtom);
  const updatedNotes = notes.map((note) => {
    if (note.id === id) {
      return { ...note, title: update };
    }
    return note;
  });
  set(collectionNotesAtom, updatedNotes as Note[]);
});

export const currentContentAtom = atom<string | null>(null);

export const lastSavedContentAtom = atom<string | null>(null);

export const editorAtom = atom<Editor | null>(null);

export const dialogOpenAtom = atom(false);

export const currentUserAtom = atom<User | null>(null);

// UI
export const sidebarOpenAtom = atom(true); // Default to open
export const showPageAtom = atom(false);
export const zenModeAtom = atom(false);