'use client'

import { Collection, User } from '@/app/types';
import { db } from './db';
import { Users, Notes, Collections, NotesCollections } from './schema';
import { eq, and, sql } from 'drizzle-orm';

// Remove loadDatabase function as it's no longer needed

export async function getCurrentUser(): Promise<User | null> {
  try {
    const users = await db.select().from(Users).limit(1);
    if (users.length > 0) {
      console.log("got users", users);
      return users[0] as unknown as User;
    } else {
      console.warn("No users found in the database");
      return null;
    }
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export async function saveNoteContent(noteId: string, content: string, title: string) {
  const now = new Date().toISOString();
  console.log("saving note content", noteId, content, title);
  await db.update(Notes)
    .set({ content, title, updated_at: now })
    .where(eq(Notes.id, parseInt(noteId)));
}

export async function getCollectionsWithNoteCount(userId: string): Promise<Collection[]> {
  const collections = await db.select({
    id: Collections.id,
    name: Collections.name,
    description: Collections.description,
    note_count: sql<number>`count(${NotesCollections.note_id})`.as('note_count'),
  })
    .from(Collections)
    .leftJoin(NotesCollections, eq(Collections.id, NotesCollections.collection_id))
    .where(eq(Collections.user_id, parseInt(userId)))
    .groupBy(Collections.id)
    .orderBy(Collections.name);
  return collections;
}

export async function getNotesInCollection(collectionId: string) {
  return await db.query.NotesCollections.findMany({
    where: eq(NotesCollections.collection_id, parseInt(collectionId)),
    with: {
      note: true
    }
  }).then(results => results.map(result => result.note));
}


export async function addUser(name: string, handle: string, email: string) {
  await db.insert(Users).values({ name, handle, email });
}

export async function addNote(title: string, content: string, userId: string) {
  const now = new Date().toISOString();
  await db.insert(Notes).values({
    title,
    content,
    created_at: now,
    updated_at: now,
    user_id: parseInt(userId),
  });
}

export async function addCollection(name: string, description: string, userId: string) {
  const now = new Date().toISOString();
  await db.insert(Collections).values({
    name,
    description,
    created_at: now,
    updated_at: now,
    user_id: parseInt(userId),
  });
}

export async function addNoteToCollection(noteId: string, collectionId: string, userId: string) {
  const now = new Date().toISOString();
  await db.insert(NotesCollections).values({
    note_id: parseInt(noteId),
    collection_id: parseInt(collectionId),
    created_at: now,
    updated_at: now,
    user_id: parseInt(userId),
  });
}

export async function deleteRecord(table: 'Users' | 'Notes' | 'Collections' | 'NotesCollections', id: string) {
  const tableMap = {
    Users,
    Notes,
    Collections,
    NotesCollections,
  };
  await db.delete(tableMap[table]).where(eq(tableMap[table].id, parseInt(id)));
}