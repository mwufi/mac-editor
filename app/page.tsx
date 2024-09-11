'use client'

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { currentUserAtom, collectionsAtom } from '@/app/atoms'; // Assuming you have these atoms defined

import Sidebar from "@/app/components/Sidebar";
import NotesList from "@/app/components/NotesList";
import Editor from "@/app/components/Editor";
import { getCurrentUser, getCollectionsWithNoteCount } from '@/lib/orm';
import { Collection } from './types';
import LightNav from './test/LightNav';

export default function Home() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [collections, setCollections] = useAtom(collectionsAtom);

  useEffect(() => {
    async function initializeData() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);

        if (user) {
          const userCollections = await getCollectionsWithNoteCount(user.id.toString());
          console.log("collections", userCollections);
          setCollections(userCollections as unknown as Collection[]);
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    }

    initializeData();
  }, [setCurrentUser, setCollections]);

  return (
    <>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/4 overflow-y-auto">
          <Sidebar />
        </div>
        <div className="w-[300px] overflow-y-auto">
          <NotesList />
          <div data-tauri-drag-region className="h-10 bg-red-500 p-4">
            hi there
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Editor />
        </div>
      </div>
    </>
  );
}
