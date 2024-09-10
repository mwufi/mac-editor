"use client";

import { useAtom, useAtomValue } from "jotai";
import { editorAtom, lastSavedContentAtom, selectedNoteAtom, currentContentAtom } from "../atoms";
import TipTapEditor from "./editor/TipTapEditor";
import { useEffect, useCallback } from "react";
import { loadDatabase, saveNoteContent } from "@/lib/orm";
import { useDebounce } from "@/app/hooks/useDebounce";

const Editor = () => {
    const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);
    const [currentContent, setCurrentContent] = useAtom(currentContentAtom);
    const [lastSavedContent, setLastSavedContent] = useAtom(lastSavedContentAtom);
    const editor = useAtomValue(editorAtom);

    if (!selectedNote) {
        return <div>No note selected</div>;
    }

    useEffect(() => {
        // when the selected note changes, update the editor content
        if (editor && selectedNote) {
            editor.commands.setContent(selectedNote.content || "");
            setCurrentContent(selectedNote.content || "");
            setLastSavedContent(selectedNote.content || "");
        }
    }, [editor, selectedNote, setCurrentContent, setLastSavedContent]);

    const saveContent = useCallback(async (content: string) => {
        if (selectedNote) {
            const db = await loadDatabase();
            console.log("saving content", content);
            await saveNoteContent(db, selectedNote.id, content);
            setLastSavedContent(content);
            setSelectedNote((prevNote) => {
                if (prevNote) {
                    return { ...prevNote, content: content };
                }
                console.log("prevNote", prevNote);
                return prevNote;
            });
        } else {
            console.error("No selected note");
        }
    }, [selectedNote, setLastSavedContent, setSelectedNote]);

    const debouncedSave = useDebounce(saveContent, 1000);

    const handleUpdate = useCallback((content: string) => {
        setCurrentContent(content);
        console.log("current selected note", selectedNote);
        if (selectedNote) {
            debouncedSave(content);
        }
    }, [debouncedSave, selectedNote, setCurrentContent]);

    return (
        <div className="flex-1 h-full bg-white dark:bg-gray-900 px-8">
            {lastSavedContent !== currentContent && (
                <div className="bg-yellow-100 p-4 rounded-md mb-4">
                    <p className="text-yellow-800">Unsaved changes {currentContent} | {lastSavedContent}</p>
                </div>
            )}
            <TipTapEditor onUpdate={handleUpdate} />
        </div>
    );
};

export default Editor;