
import { atom } from "jotai";
import { LocalNote } from "./types";
import { Editor } from "@tiptap/react";

export const selectedNoteAtom = atom<LocalNote | null>(null);
export const editorAtom = atom<Editor | null>(null);