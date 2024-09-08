"use client";

import { useAtomValue } from "jotai";
import { editorAtom, selectedNoteAtom } from "../atoms";
import TipTapEditor from "./editor/TipTapEditor";
import { useEffect } from "react";

const Editor = () => {
    const selectedNote = useAtomValue(selectedNoteAtom);
    const editor = useAtomValue(editorAtom);

    useEffect(() => {
        if (editor) {
            editor.commands.setContent(selectedNote?.content || "");
        }
    }, [editor, selectedNote]);

    return (
        <div className="flex-1 h-full bg-white dark:bg-gray-900 px-8">
            <TipTapEditor />
        </div>
    );
};

export default Editor;