'use client'

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from '@/app/components/Sidebar';
import { Collection } from '@/app/types';
import { getCurrentUser, getCollectionsWithNoteCount } from '@/lib/orm';
import { currentUserAtom, collectionsAtom, selectedCollectionIdAtom } from '@/app/atoms';
import { useAtom, useSetAtom } from 'jotai';
import NotesList from '@/app/components/NotesList';
import Editor from '@/app/components/Editor';
import HeaderToolbar from '@/app/components/toolbars/HeaderToolbar';
import CreateNoteButton from '@/app/components/toolbars/CreateNoteButton';
import TrashNoteButton from '@/app/components/toolbars/TrashNoteButton';
import Toolbar from './components/editor/Toolbar';

export default function Layout() {
  // TODO: if you use atom value, it doesn't re-render properly!! something with motion.div
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [collections, setCollections] = useAtom(collectionsAtom);
  const setSelectedCollectionId = useSetAtom(selectedCollectionIdAtom);

  useEffect(() => {
    async function initializeData() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);

        if (user) {
          const userCollections = await getCollectionsWithNoteCount(user.id.toString());
          console.log("collections", userCollections);
          setCollections(userCollections as unknown as Collection[]);
          if (userCollections.length > 0) {
            setSelectedCollectionId(userCollections[0].id);
          }
        }
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    }

    initializeData();
  }, [setCurrentUser, setCollections]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "230px" }}
            exit={{ width: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 overflow-y-auto flex flex-col shrink-0"
          >
            {/* Sidebar header */}
            <HeaderToolbar className="pl-20 border-r">
              <Button
                onClick={toggleSidebar}
                variant="outline"
                size="icon"
                className="h-8 w-8"
              >
                <ChevronRight size={16} />
              </Button>
            </HeaderToolbar>
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-grow">
        <div className="flex-grow flex overflow-hidden">
          <motion.div
            layout
            className="w-[300px] bg-white overflow-y-auto flex flex-col"
            transition={{ duration: 0.3 }}
          >
            <HeaderToolbar className={sidebarOpen ? "" : "pl-20"}>
              <div className="flex space-x-2 items-center">
                {!sidebarOpen && (
                  <Button
                    onClick={toggleSidebar}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <ChevronRight size={16} />
                  </Button>
                )}
                <CreateNoteButton />
                <TrashNoteButton />
              </div>
            </HeaderToolbar>
            <NotesList />
          </motion.div>

          <motion.div
            layout
            className="flex-1 overflow-y-auto flex flex-col"
            transition={{ duration: 0.3 }}
          >
            <HeaderToolbar className={sidebarOpen ? "" : "pl-20"}>
              <Toolbar />
            </HeaderToolbar>
            <div className="mt-4"></div>
            <Editor />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
