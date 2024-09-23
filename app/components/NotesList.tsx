"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Note } from "../types";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { selectedCollectionIdAtom, collectionNotesAtom, selectedNoteIdAtom, initialContentAtom, selectedCollectionAtom } from "@/app/atoms";
import { getNotesInCollection, deleteNote, getNoteSummary } from "@/lib/orm";
import { motion, AnimatePresence } from "framer-motion";

interface NoteItemProps {
    title: string;
    date: string;
    summary?: string;
    image?: string;
    onClick?: () => void;
    isSelected: boolean;
}

const NoteItem = ({ title, date, summary, image, onClick, isSelected }: NoteItemProps) => (
    <motion.div
        layout
        className={`flex relative items-center justify-between py-3 px-4 mx-3 group rounded-lg cursor-pointer transition-colors duration-200`}
        onClick={onClick}
    >
        <AnimatePresence>
            {isSelected && (
                <motion.div
                    layoutId="selectedBackground"
                    className="absolute inset-0 bg-accent dark:bg-gray-700 rounded-lg z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                />
            )}
        </AnimatePresence>
        <div className="z-10">
            <h3 className={`text-sm font-medium ${isSelected ? 'text-accent-foreground' : 'text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100'}`}>{title.substring(0, 35)}</h3>
            <p className={`text-xs ${isSelected ? 'text-accent-foreground' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>{date}</p>
            <p className={`text-xs ${isSelected ? 'text-accent-foreground' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>{summary}</p>
        </div>
        {image && <img src={image} alt={title} className="w-10 h-10 object-cover rounded z-10" />}
    </motion.div>
);

const NotesList = () => {
    const [selectedNoteId, setSelectedNoteId] = useAtom(selectedNoteIdAtom);
    const setInitialContent = useSetAtom(initialContentAtom);
    const [selectedCollectionId] = useAtom(selectedCollectionIdAtom);
    const selectedCollection = useAtomValue(selectedCollectionAtom);
    const [notes, setNotes] = useAtom(collectionNotesAtom);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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


    const handleDeleteNote = async () => {
        if (selectedNoteId) {
            await deleteNote(selectedNoteId);
            setNotes(notes.filter(note => note.id !== selectedNoteId));
            setSelectedNoteId(null);
            setInitialContent('');
            setIsDeleteDialogOpen(false);
        }
    };

    const openDeleteDialog = () => {
        setIsDeleteDialogOpen(true);
    };

    const selectedNote = notes.find(note => note.id === selectedNoteId);

    return (
        <div className="shrink-0 h-full bg-white select-none">
            <div className="p-4">
                <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search notes"
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 select-text"
                    />
                </div>
            </div>
            <motion.div className="overflow-y-auto h-[calc(100%-6rem)]" layout>
                <div className="py-2 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    {selectedCollectionId ? `${selectedCollection?.name}` : 'Notes'}
                </div>
                <AnimatePresence>
                    {notes.map((note) => (
                        <NoteItem
                            key={note.id}
                            title={note.title || ''}
                            date={new Date(note.updated_at || '').toLocaleDateString()}
                            summary={getNoteSummary(note)}
                            onClick={() => {
                                setSelectedNoteId(note.id);
                                setInitialContent(note.content || '');
                            }}
                            isSelected={note.id === selectedNoteId}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default NotesList;