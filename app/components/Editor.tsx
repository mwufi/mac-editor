"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { editorAtom, lastSavedContentAtom, selectedNoteAtom, currentContentAtom, updateContentAtom, updateTitleAtom, initialContentAtom, selectedNoteIdAtom, characterCountAtom } from "../atoms";
import TipTapEditor from "./editor/TipTapEditor";
import { useEffect, useCallback, useMemo, useState } from "react";
import { saveNoteContent } from "@/lib/orm";
import { useDebounce } from "@/app/hooks/useDebounce";
import { showPageAtom } from "../atoms";
import { JSONContent } from "@tiptap/react";

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

    const saveContent = useCallback(async (contentJSON: JSONContent | string, contentAsText: string) => {
        const currentSelectedNoteId = selectedNoteId; // Get the latest selectedNoteId
        setLatest(currentSelectedNoteId);

        const contentAsString = typeof contentJSON === 'string' ? contentJSON : JSON.stringify(contentJSON);

        // Extract the first line as the title
        const lines = contentAsText.split('\n');
        const newTitle = lines[0].trim();
        updateSelectedNoteTitle(newTitle);

        if (currentSelectedNoteId) {
            await saveNoteContent(currentSelectedNoteId, contentAsString, newTitle);
            setLastSavedContent(contentAsString);
            updateSelectedNoteContent(contentAsString);
        } else {
            console.error("No selected note");
        }
    }, [selectedNoteId, updateSelectedNoteTitle, setLastSavedContent, updateSelectedNoteContent]);

    const debouncedSave = useDebounce(saveContent, 300);

    const handleUpdate = useCallback((jsonContent: JSONContent, contentAsText: string) => {
        setCurrentContent(jsonContent);
        debouncedSave(jsonContent, contentAsText);
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
            <div className={`flex-1 h-[calc(100vh-100px)] flex flex-col relative bg-background dark:bg-gray-900 px-8 rounded-lg w-[820px] mx-auto ${showPage ? "shadow-lg" : ""}`}>
                <div className="p-8 mb-4 overflow-y-auto flex-1">
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
                <div className="sticky bottom-2 grid place-items-center">
                    <span className="text-xs text-gray-500">{characterCount.words} words</span>
                </div>
            </div>
        );
    }, [selectedNote, lastSavedContent, currentContent, handleUpdate]);

    return editorContent;
};

export default Editor;