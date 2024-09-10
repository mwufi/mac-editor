"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { editorAtom, lastSavedContentAtom, selectedNoteAtom, currentContentAtom, updateContentAtom, updateTitleAtom } from "../atoms";
import TipTapEditor from "./editor/TipTapEditor";
import { useEffect, useCallback, useMemo } from "react";
import { loadDatabase, saveNoteContent, saveNoteTitle } from "@/lib/orm";
import { useDebounce } from "@/app/hooks/useDebounce";

const Editor = () => {
    const selectedNote = useAtomValue(selectedNoteAtom);
    const updateSelectedNoteContent = useSetAtom(updateContentAtom);
    const updateSelectedNoteTitle = useSetAtom(updateTitleAtom);
    const [currentContent, setCurrentContent] = useAtom(currentContentAtom);
    const [lastSavedContent, setLastSavedContent] = useAtom(lastSavedContentAtom);
    const editor = useAtomValue(editorAtom);

    const saveContent = useCallback(async (contentAsHtml: string, contentAsText: string) => {
        if (selectedNote) {
            const db = await loadDatabase();
            console.log("saving content", contentAsHtml);

            // Extract the first line as the title
            const lines = contentAsText.split('\n');
            const newTitle = lines[0].trim();
            if (newTitle !== selectedNote.title) {
                updateSelectedNoteTitle(newTitle);
            }

            await saveNoteContent(db, selectedNote.id, contentAsHtml, newTitle);
            setLastSavedContent(contentAsHtml);
            updateSelectedNoteContent(contentAsHtml);
        } else {
            console.error("No selected note");
        }
    }, [selectedNote, setLastSavedContent, updateSelectedNoteContent, updateSelectedNoteTitle]);

    const debouncedSave = useDebounce(saveContent, 300);

    const handleUpdate = useCallback((contentAsHtml: string, contentAsText: string) => {
        setCurrentContent(contentAsHtml);
        console.log("current selected note", selectedNote);
        if (selectedNote) {
            debouncedSave(contentAsHtml, contentAsText);
        }
    }, [debouncedSave, selectedNote, setCurrentContent]);

    useEffect(() => {
        if (editor && selectedNote) {
            editor.commands.setContent(selectedNote.content || "");
            setCurrentContent(selectedNote.content || "");
            setLastSavedContent(selectedNote.content || "");
        }
    }, [editor, selectedNote, setCurrentContent, setLastSavedContent]);

    const editorContent = useMemo(() => {
        if (!selectedNote) {
            return <div>No note selected</div>;
        }

        return (
            <div className="flex-1 h-full bg-white dark:bg-gray-900 px-8">
                <TipTapEditor onUpdate={handleUpdate} />
                <div className="fixed bottom-4 right-4 flex items-center space-x-2">
                    {lastSavedContent === currentContent ? (
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-xs text-gray-500">Saved</span>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                            <span className="text-xs text-gray-500">Writing...</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }, [selectedNote, lastSavedContent, currentContent, handleUpdate]);

    return editorContent;
};

export default Editor;