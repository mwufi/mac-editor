'use client'

import { useEffect } from 'react';
import Database from '@tauri-apps/plugin-sql';
import { useAtom } from 'jotai';
import { currentUserAtom, collectionsAtom } from '@/app/atoms'; // Assuming you have these atoms defined

import Sidebar from "@/app/components/Sidebar";
import NotesList from "@/app/components/NotesList";
import Editor from "@/app/components/Editor";
import { Collection, User } from '@/app/types';

async function loadDatabase() {
  return await Database.load('sqlite:real.db')
}

async function getCurrentUser(db: Database): Promise<User | null> {
  try {
    const users = await db.select<User[]>("SELECT * FROM users LIMIT 1");
    if (users.length > 0) {
      console.log("got users", users);
      return users[0];
    } else {
      console.warn("No users found in the database");
      return null;
    }
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

async function getCollectionsWithNoteCount(db: Database, userId: string): Promise<Collection[]> {
  const query = `
    SELECT 
      c.id, 
      c.name, 
      c.description, 
      COUNT(nc.note_id) as note_count
    FROM 
      collections c
    LEFT JOIN 
      notes_collections nc ON c.id = nc.collection_id
    WHERE 
      c.user_id = $1
    GROUP BY 
      c.id
    ORDER BY 
      c.name
  `;

  try {
    const collections = await db.select<Collection[]>(query, [userId]);
    return collections;
  } catch (error) {
    console.error("Error fetching collections with note count:", error);
    throw error;
  }
}

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
          setCollections(userCollections);
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
