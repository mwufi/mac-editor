"use client";

import { useAtomValue } from "jotai";
import { selectedNoteAtom } from "../atoms";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Editor = () => {
    const selectedNote = useAtomValue(selectedNoteAtom);
    return (
        <div className="flex-1 h-full bg-white dark:bg-gray-900 p-8">
            <h2 className="text-2xl font-semibold mb-4">{selectedNote?.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{selectedNote?.content}</p>
            <Button onClick={() => toast.info("Save")}>
                Save
            </Button>
        </div>
    );
};

export default Editor;