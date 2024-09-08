
import { atom } from "jotai";
import { LocalNote } from "./types";

export const selectedNoteAtom = atom<LocalNote | null>(null);