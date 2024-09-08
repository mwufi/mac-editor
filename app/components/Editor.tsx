"use client";

import { useAtomValue } from "jotai";
import { editorAtom, selectedNoteAtom } from "../atoms";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
            <Button onClick={() => toast.info("Save")}>
                Save
            </Button>
        </div>
    );
};

export default Editor;