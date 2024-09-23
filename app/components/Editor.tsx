"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { editorAtom, lastSavedContentAtom, selectedNoteAtom, currentContentAtom, updateContentAtom, updateTitleAtom, initialContentAtom, selectedNoteIdAtom, characterCountAtom } from "../atoms";
import TipTapEditor from "./editor/TipTapEditor";
import { useEffect, useCallback, useMemo, useState } from "react";
import { saveNoteContent } from "@/lib/orm";
import { useDebounce } from "@/app/hooks/useDebounce";
import { showPageAtom } from "../atoms";

const Editor = () => {
    const selectedNote = useAtomValue(selectedNoteAtom);
    const selectedNoteId = useAtomValue(selectedNoteIdAtom);
    const initialContent = useAtomValue(initialContentAtom);
    const updateSelectedNoteContent = useSetAtom(updateContentAtom);
    const updateSelectedNoteTitle = useSetAtom(updateTitleAtom);
    const [currentContent, setCurrentContent] = useAtom(currentContentAtom);
    const [lastSavedContent, setLastSavedContent] = useAtom(lastSavedContentAtom);
    const editor = useAtomValue(editorAtom);
    const showPage = useAtomValue(showPageAtom);
    const [latest, setLatest] = useState<string | null>(null);

    const saveContent = useCallback(async (contentAsHtml: string, contentAsText: string) => {
        const currentSelectedNoteId = selectedNoteId; // Get the latest selectedNoteId
        setLatest(currentSelectedNoteId);

        // Extract the first line as the title
        const lines = contentAsText.split('\n');
        const newTitle = lines[0].trim();
        updateSelectedNoteTitle(newTitle);

        if (currentSelectedNoteId) {
            await saveNoteContent(currentSelectedNoteId, contentAsHtml, newTitle);
            setLastSavedContent(contentAsHtml);
            updateSelectedNoteContent(contentAsHtml);
        } else {
            console.error("No selected note");
        }
    }, [selectedNoteId, updateSelectedNoteTitle, setLastSavedContent, updateSelectedNoteContent]);

    const debouncedSave = useDebounce(saveContent, 300);

    const handleUpdate = useCallback((contentAsHtml: string, contentAsText: string) => {
        setCurrentContent(contentAsHtml);
        debouncedSave(contentAsHtml, contentAsText);
    }, [debouncedSave, setCurrentContent]);

    useEffect(() => {
        if (editor) {
            let content;
            try {
                content = JSON.parse(initialContent || "{}");
            } catch (error) {
                console.error("Error parsing initial content", error);
                content = initialContent || "";
            }
            editor.commands.setContent(content);
            setCurrentContent(content || "");
            setLastSavedContent(content || "");
        }
    }, [editor, setCurrentContent, setLastSavedContent, initialContent]);

    const characterCount = useAtomValue(characterCountAtom);

    const editorContent = useMemo(() => {
        if (!selectedNote) {
            return <div className="flex-1 h-full w-full grid place-items-center dark:bg-gray-900 px-8 overflow-y-auto">No note selected
            </div>;
        }

        return (
            <div className={`flex-1 h-full relative bg-background dark:bg-gray-900 px-8 overflow-y-auto rounded-lg w-[820px] mx-auto ${showPage ? "shadow-lg" : ""}`}>
                <div className="p-8">
                    <TipTapEditor onUpdate={handleUpdate} initialContent={initialContent} />
                </div>
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
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <span className="text-xs text-gray-500">{characterCount.words} words</span>
                </div>
            </div>
        );
    }, [selectedNote, lastSavedContent, currentContent, handleUpdate]);

    return editorContent;
};

export default Editor;