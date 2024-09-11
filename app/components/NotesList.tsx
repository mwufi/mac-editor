"use client";

import { useEffect } from "react";
import { Search, PenSquare, LayoutGrid, List, Trash } from "lucide-react";
import { Note } from "../types";
import { useAtom, useSetAtom } from "jotai";
import { selectedCollectionIdAtom, collectionNotesAtom, selectedNoteIdAtom, initialContentAtom } from "@/app/atoms";
import { getNotesInCollection } from "@/lib/orm";

interface NoteItemProps {
    title: string;
    date: string;
    image?: string;
    onClick?: () => void;
    isSelected: boolean; // Add this prop
}

const NoteItem = ({ title, date, image, onClick, isSelected }: NoteItemProps) => (
    <div
        className={`flex items-center justify-between py-2 px-4 group hover:bg-accent dark:hover:bg-gray-800 ${isSelected ? 'bg-pink-700' : ''
            }`}
        onClick={onClick}
    >
        <div>
            <h3 className="text-sm text-accent group-hover:text-accent-foreground font-medium">{title}</h3>
            <p className="text-xs text-accent group-hover:text-accent-foreground dark:text-gray-400">{date}</p>
        </div>
        {image && <img src={image} alt={title} className="w-10 h-10 object-cover rounded" />}
    </div>
);

const NotesList = () => {
    const [selectedNoteId, setSelectedNoteId] = useAtom(selectedNoteIdAtom);
    const setInitialContent = useSetAtom(initialContentAtom);
    const [selectedCollectionId] = useAtom(selectedCollectionIdAtom);
    const [notes, setNotes] = useAtom(collectionNotesAtom);

    useEffect(() => {
        const fetchNotes = async () => {
            if (selectedCollectionId) {
                const collectionNotes = await getNotesInCollection(selectedCollectionId);
                console.log("collectionNotes", collectionNotes);
                setNotes(collectionNotes as unknown as Note[]);
            } else {
                setNotes([]);
            }
        };

        fetchNotes();
    }, [selectedCollectionId, setNotes]);

    return (
        <div className="shrink-0 w-80 h-full bg-background dark:bg-gray-900 border-r border-border">
            <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                    <PenSquare size={20} className="text-gray-600 dark:text-gray-400" />
                    <div className="flex space-x-2">
                        <LayoutGrid size={20} className="text-gray-600 dark:text-gray-400" />
                        <List size={20} className="text-gray-600 dark:text-gray-400" />
                        <Trash size={20} className="text-gray-600 dark:text-gray-400" />
                    </div>
                </div>
                <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search notes"
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <div className="overflow-y-auto h-[calc(100%-6rem)]">
                <div className="py-2 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    {selectedCollectionId ? `Notes in ${selectedCollectionId}` : 'Notes'}
                </div>
                {notes.map((note) => (
                    <NoteItem
                        key={note.id}
                        title={note.title || ''}
                        date={new Date(note.updated_at || '').toLocaleDateString()}
                        onClick={() => {
                            setSelectedNoteId(note.id);
                            setInitialContent(note.content || '');
                        }}
                        isSelected={note.id === selectedNoteId}
                    />
                ))}
            </div>
        </div>
    );
};

export default NotesList;