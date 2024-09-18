import Link from "next/link";
import { LayoutDashboard, Star, Archive, Trash2, Folder, Plus } from "lucide-react";
import { collectionsAtom, currentUserAtom, selectedCollectionIdAtom, sidebarOpenAtom } from "../atoms";
import { useAtom, useAtomValue } from "jotai";
import { useState } from 'react';
import { toast } from "sonner";
import { getCollectionsWithNoteCount, renameCollection, createCollection } from "@/lib/orm";
import { Collection } from "../types";

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    count?: number;
    href?: string;
    onRename?: (newLabel: string) => void;
    onClick?: () => void;
    selected?: boolean;
}

const SidebarItem = ({ icon: Icon, label, count, href = "#", onClick, selected, onRename }: SidebarItemProps) => {
    const [isEditing, setIsEditing] = useState(true);
    const [newLabel, setNewLabel] = useState(label);

    const handleDoubleClick = () => {
        if (onRename) {
            setIsEditing(true);
        }
    };

    const handleRename = (e: React.FormEvent) => {
        e.preventDefault();
        onRename?.(newLabel);
        setIsEditing(false);
    };

    return (
        <div className="relative group">
            {isEditing ? (
                <form onSubmit={handleRename} className="max-w-full flex w-full items-center gap-2 px-4 py-2">
                    <Icon size={18} className="text-accent-darker shrink-0" fill="currentColor" />
                    <input
                        type="text"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                        className="flex-grow bg-transparent text-sm text-gray-700 dark:text-gray-300 min-w-0"
                        autoFocus
                        onBlur={() => setIsEditing(false)}
                    />
                </form>
            ) : (
                <Link
                    href={href}
                    className={`flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md ${selected ? "bg-gray-100 dark:bg-gray-800" : ""}`}
                    onClick={onClick}
                    onDoubleClick={handleDoubleClick}
                >
                    <Icon size={18} className="text-accent-darker shrink-0" fill="currentColor" />
                    <span className="flex-grow">{label}</span>
                    {count !== undefined && <span className="bg-gray-200 dark:bg-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">{count}</span>}
                </Link>
            )}
        </div>
    );
};

const Sidebar = () => {
    const [collections, setCollections] = useAtom(collectionsAtom);
    const [selectedCollectionId, setSelectedCollectionId] = useAtom(selectedCollectionIdAtom);
    const sidebarOpen = useAtomValue(sidebarOpenAtom);
    const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

    const handleAddCollection = async () => {
        try {
            if (currentUser) {
                await createCollection("New collection", "New collection description", currentUser.id);
                toast.success("New collection created");
                
                // Refresh collections
                const userCollections = await getCollectionsWithNoteCount(currentUser.id);
                setCollections(userCollections as unknown as Collection[]);
            }
        } catch (error) {
            toast.error(`Error creating new collection: ${error}`);
        }
    };

    return (
        <div className={`shrink-0 ${!sidebarOpen && "fixed"} h-full overflow-y-auto bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-2`}>
            <div className="">
                <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" />
            </div>
            <div className="mt-8">
                <div className="px-4 flex justify-between items-center">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tests</h3>
                    <button
                        onClick={handleAddCollection}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title="Add new collection"
                    >
                        <Plus size={16} />
                    </button>
                </div>
                <div className="mt-2 ">
                    <SidebarItem icon={Trash2} label="Test dialog" count={12} href="/test/dialog" />
                    <SidebarItem icon={Trash2} label="Test database" count={12} href="/test/database" />
                </div>
            </div>
            <div className="mt-8">
                <div className="px-4 flex justify-between items-center">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vault</h3>
                    <button
                        onClick={handleAddCollection}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        title="Add new collection"
                    >
                        <Plus size={16} />
                    </button>
                </div>
                <div className="mt-2 ">
                    {collections.map((collection) => (
                        <SidebarItem
                            key={collection.id}
                            icon={Folder}
                            onRename={async (newLabel) => {
                                try {
                                    await renameCollection(collection.id, newLabel);
                                    toast.success(`Renamed collection to ${newLabel}`);

                                    // Refresh collections
                                    if (currentUser) {
                                        const userCollections = await getCollectionsWithNoteCount(currentUser.id);
                                        setCollections(userCollections as unknown as Collection[]);
                                    }
                                } catch (error) {
                                    toast.error(`Error renaming collection: ${error}`);
                                }
                            }}
                            selected={collection.id === selectedCollectionId}
                            label={collection.name}
                            count={collection.note_count}
                            onClick={() => setSelectedCollectionId(collection.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;