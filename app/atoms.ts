
import { atom } from "jotai";
import { LocalNote, User, Collection } from "./types";
import { Editor } from "@tiptap/react";

export const selectedNoteAtom = atom<LocalNote | null>(null);
export const editorAtom = atom<Editor | null>(null);

export const dialogOpenAtom = atom(false);

export const currentUserAtom = atom<User | null>(null);
export const collectionsAtom = atom<Collection[]>([]);