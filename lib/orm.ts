'use client'

import { Collection, Note, User } from '@/app/types';
import { db } from './db';
import { Users, Notes, Collections, NotesCollections, ShareLinks } from './schema';
import { eq, desc, sql } from 'drizzle-orm';

export async function ensureTables() {
  // Check if a default user exists
  const userCount = await db.select({ count: sql<number>`count(*)` })
    .from(Users)
    .then(result => result[0].count);

  if (userCount === 0) {
    // Create a default user if none exists
    await db.insert(Users).values({
      name: 'Default User',
      handle: 'default',
      email: 'default@example.com'
    });
  }

  // Default collections to ensure
  const defaultCollections = ['Deleted', 'Archived', 'Starred'];

  for (const collectionName of defaultCollections) {
    // Check if the collection exists
    const collectionCount = await db.select({ count: sql<number>`count(*)` })
      .from(Collections)
      .where(eq(Collections.name, collectionName))
      .then(result => result[0].count);

    if (collectionCount === 0) {
      // Get the first user's ID (which should be our default user)
      const user = await db.select().from(Users).limit(1).then(users => users[0]);

      // Create the collection if it doesn't exist
      await db.insert(Collections).values({
        name: collectionName,
        description: `Default ${collectionName} collection`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user.id
      });
    }
  }

}

// utils
export function getNoteSummary(note: Note, n: number = 40) {
  let content;

  try {
    content = JSON.parse(note.content);
  } catch (error) {
    content = note.content;
  }

  try {
    let summary = '';
    const extractText = (node: any) => {
      if (node.type === 'text' && node.text) {
        summary += " " + node.text;
      } else if (node.content) {
        node.content.forEach(extractText);
      }
    };
    content.content.forEach((node: any) => {
      if (node.type !== 'heading') {
        extractText(node);
      }
    });
    return summary.slice(0, n);
  } catch (error) {
    console.error('Error parsing note content:', error);
    console.log("content", content);
    return ""
  }
}

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

export async function createNote(title: string, content: string, userId: string) {
  const now = new Date().toISOString();
  await db.insert(Notes).values({
    title,
    content,
    created_at: now,
    updated_at: now,
    user_id: parseInt(userId),
  });
}

export async function createCollection(name: string, description: string, userId: string) {
  const now = new Date().toISOString();
  await db.insert(Collections).values({
    name,
    description,
    created_at: now,
    updated_at: now,
    user_id: parseInt(userId),
  });
}

export async function renameCollection(collectionId: string, newName: string) {
  await db.update(Collections).set({ name: newName }).where(eq(Collections.id, parseInt(collectionId)));
}

export async function createNoteToCollection(noteId: string, collectionId: string, userId: string) {
  const now = new Date().toISOString();
  await db.insert(NotesCollections).values({
    note_id: parseInt(noteId),
    collection_id: parseInt(collectionId),
    created_at: now,
    updated_at: now,
    user_id: parseInt(userId),
  });
}

export async function deleteRecord(table: 'Users' | 'Notes' | 'Collections' | 'NotesCollections' | 'ShareLinks', id: string) {
  const tableMap = {
    Users,
    Notes,
    Collections,
    NotesCollections,
    ShareLinks,
  };
  await db.delete(tableMap[table]).where(eq(tableMap[table].id, parseInt(id)));
}

export async function createNoteInCollection(collectionId: string): Promise<Note> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No user found");
  } else {
    console.log("user", user.id, "is making a note", user);
  }

  const now = new Date().toISOString();
  await db.insert(Notes).values({
    title: "Untitled",
    content: "",
    created_at: now,
    updated_at: now,
    user_id: parseInt(user.id),
  })

  const newNote = await db.select().from(Notes).orderBy(desc(Notes.id)).limit(1).then(rows => rows[0]);
  console.log("new note", newNote);
  if (!newNote || !newNote.id) {
    throw new Error("Failed to create new note");
  }

  await createNoteToCollection(newNote.id.toString(), collectionId, user.id.toString());

  return newNote as unknown as Note;
}

export async function deleteNote(noteId: string): Promise<void> {
  await db.delete(NotesCollections).where(eq(NotesCollections.note_id, parseInt(noteId)));
  await db.delete(Notes).where(eq(Notes.id, parseInt(noteId)));
}