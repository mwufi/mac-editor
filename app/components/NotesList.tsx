"use client";

import { useEffect, useState } from "react";
import { Search, PenSquare, LayoutGrid, List, Trash, Settings, PanelRight } from "lucide-react";
import { Note } from "../types";
import { useAtom, useSetAtom } from "jotai";
import { selectedCollectionIdAtom, collectionNotesAtom, selectedNoteIdAtom, initialContentAtom, sidebarOpenAtom } from "@/app/atoms";
import { getNotesInCollection, createNote, deleteNote } from "@/lib/orm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface NoteItemProps {
    title: string;
    date: string;
    image?: string;
    onClick?: () => void;
    isSelected: boolean;
}

const NoteItem = ({ title, date, image, onClick, isSelected }: NoteItemProps) => (
    <motion.div
        layout
        className={`flex relative items-center justify-between py-3 px-4 mx-3 group rounded-lg cursor-pointer transition-colors duration-200`}
        onClick={onClick}
    >
        <AnimatePresence>
            {isSelected && (
                <motion.div
                    layoutId="selectedBackground"
                    className="absolute inset-0 bg-red-100 dark:bg-gray-700 rounded-lg z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                />
            )}
        </AnimatePresence>
        <div className="z-10">
            <h3 className="text-sm text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-gray-100 font-medium">{title}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">{date}</p>
        </div>
        {image && <img src={image} alt={title} className="w-10 h-10 object-cover rounded z-10" />}
    </motion.div>
);

const NotesList = () => {
    const [selectedNoteId, setSelectedNoteId] = useAtom(selectedNoteIdAtom);
    const setInitialContent = useSetAtom(initialContentAtom);
    const [selectedCollectionId] = useAtom(selectedCollectionIdAtom);
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

    const handleCreateNote = async () => {
        if (selectedCollectionId) {
            try {
                const newNote = await createNote(selectedCollectionId);
                setNotes([newNote, ...notes]);
                setSelectedNoteId(newNote.id);
                setInitialContent('');
            } catch (error) {
                console.error("Failed to create new note:", error);
                // You might want to show an error message to the user here
            }
        }
    };

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
    const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom);
    return (
        <div className="shrink-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4" data-tauri-drag-region>
                    <div className="w-36" /> {/* Placeholder for Sun icon */}
                    <PenSquare
                        size={20}
                        className="text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-500"
                        onClick={handleCreateNote}
                    />
                    <div className="flex space-x-2">
                        <LayoutGrid size={20} className="text-gray-600 dark:text-gray-400" />
                        <List size={20} className="text-gray-600 dark:text-gray-400" />
                        <Trash
                            size={20}
                            className="text-gray-600 dark:text-gray-400 cursor-pointer hover:text-red-500"
                            onClick={openDeleteDialog}
                        />
                    </div>
                </div>
                <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search notes"
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>
            <motion.div className="overflow-y-auto h-[calc(100%-6rem)]" layout>
                <div className="py-2 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    {selectedCollectionId ? `Notes in ${selectedCollectionId}` : 'Notes'}
                </div>
                <AnimatePresence>
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
                </AnimatePresence>
            </motion.div>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete "{selectedNote?.title}"?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your note.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteNote}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NotesList;