'use client'

import { useEffect } from 'react';
import Database from '@tauri-apps/plugin-sql';
import { useAtom } from 'jotai';
import { currentUserAtom, collectionsAtom } from '@/app/atoms'; // Assuming you have these atoms defined

import Sidebar from "@/app/components/Sidebar";
import NotesList from "@/app/components/NotesList";
import Editor from "@/app/components/Editor";
import { loadDatabase, getCurrentUser, getCollectionsWithNoteCount } from '@/lib/orm';
import { Collection } from './types';


export default function Home() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [collections, setCollections] = useAtom(collectionsAtom);

  useEffect(() => {
    async function initializeData() {
      try {
        const db = await loadDatabase();
        const user = await getCurrentUser(db);
        setCurrentUser(user);

        if (user) {
          const userCollections = await getCollectionsWithNoteCount(db, user.id);
          setCollections(userCollections as Collection[]);
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    }

    initializeData();
  }, [setCurrentUser, setCollections]);

  return (
    <div className="flex h-full max-h-[100vh] overflow-hidden bg-white dark:bg-gray-900 font-[family-name:var(--font-geist-sans)]">
      <Sidebar />
      <NotesList />
      <Editor />
    </div>
  );
}
