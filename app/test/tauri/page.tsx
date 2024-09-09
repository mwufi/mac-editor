"use client";

import { readTextFile } from "@tauri-apps/plugin-fs";
import { FullScreenSection } from "@/app/components/Layout";
import { ensureDir, getFileTree } from "@/lib/notes";
import { useEffect, useState } from "react";

export default function FileTest() {
    const [filetree, setFileTree] = useState<any[]>([]);
    const [selectedNote, setSelectedNote] = useState<any | null>(null);
    const [selectedFolder, setSelectedFolder] = useState<any | null>(null);
    const [selectedNoteContent, setSelectedNoteContent] = useState<any | null>(null);

    async function fetchNotes() {
        const allNotes = await getFileTree();
        setFileTree(allNotes);
    }

    useEffect(() => {
        void ensureDir("notes");
        fetchNotes();
    }, []);

    useEffect(() => {
        console.log("selectedNote: ", selectedNote);
        if (selectedNote) {
            readTextFile(selectedNote.path).then((content) => {
                setSelectedNoteContent(content);
            });
        }
    }, [selectedNote]);

    return (
        <FullScreenSection>
            <div className="w-full flex gap-4 p-4">
                <div className="flex-1 border p-4">
                    <h2 className="font-medium text-xl">Folders</h2>
                    {filetree.map((folder, index) => (
                        <div key={index} className="border border-green-500 p-2 rounded-md cursor-pointer" onClick={() => {
                            setSelectedFolder(folder);
                        }}>
                            Folder: {folder.name}
                        </div>
                    ))}
                </div>
                <div className="flex-1 border p-4">
                    <h2 className="font-medium text-xl">Notes</h2>
                    {selectedFolder?.children.map((file, index) => (
                        <div key={index} className="border border-blue-500 p-2 rounded-md cursor-pointer" onClick={() => setSelectedNote(file)}>
                            Note {index + 1}: {file.name}
                        </div>
                    ))}
                </div>
                <div className="flex-1 border p-4">
                    <h2 className="font-medium text-xl">{selectedNote?.name}</h2>
                    {selectedNote ? (
                        <div>
                            <pre>{selectedNoteContent}</pre>
                        </div>
                    ) : (
                        <div>Select a note to view its content</div>
                    )}
                </div>
            </div>
        </FullScreenSection>
    )
}