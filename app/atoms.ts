import { atom } from "jotai";
import { Note, User, Collection } from "./types";
import { Editor } from "@tiptap/react";

export const collectionNotesAtom = atom<Note[]>([]);
export const selectedNoteAtom = atom<Note | null>(null);

export const currentContentAtom = atom<string | null>(null);

export const lastSavedContentAtom = atom<string | null>(null);

export const editorAtom = atom<Editor | null>(null);

export const dialogOpenAtom = atom(false);

export const currentUserAtom = atom<User | null>(null);
export const collectionsAtom = atom<Collection[]>([]);

export const selectedCollectionAtom = atom<string | null>(null);
