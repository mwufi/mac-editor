'use client'

import { useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { currentUserAtom, collectionsAtom, sidebarOpenAtom } from '@/app/atoms';
import { motion, AnimatePresence } from 'framer-motion';

import Sidebar from "@/app/components/Sidebar";
import NotesList from "@/app/components/NotesList";
import Editor from "@/app/components/Editor";
import { getCurrentUser, getCollectionsWithNoteCount } from '@/lib/orm';
import { Collection } from './types';

export default function Home() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [collections, setCollections] = useAtom(collectionsAtom);
  const sidebarOpen = useAtomValue(sidebarOpenAtom);

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
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "230px", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-y-auto"
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="w-[300px] overflow-y-auto"
          transition={{ duration: 0.3 }}
        >
          <NotesList />
          <div data-tauri-drag-region className="h-10 bg-red-500 p-4">
            hi there
          </div>
        </motion.div>
        <motion.div
          layout
          className="flex-1 overflow-y-auto"
          transition={{ duration: 0.3 }}
        >
          <Editor />
        </motion.div>
      </div>
    </>
  );
}
