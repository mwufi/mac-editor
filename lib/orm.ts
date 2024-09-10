'use client'

import { User } from '@/app/types';
import Database from '@tauri-apps/plugin-sql'

export async function loadDatabase() {
  return await Database.load('sqlite:real.db')
}

export async function getCurrentUser(db: Database): Promise<User | null> {
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

export async function saveNoteContent(db: Database, noteId: string, content: string) {
  const now = new Date().toISOString();
  await db.execute(
    "UPDATE notes SET content = $1, updated_at = $2 WHERE id = $3",
    [content, now, noteId]
  );
}

export async function getCollectionsWithNoteCount(db: Database, userId: string) {
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

  return await db.select(query, [userId]);
}

export async function getNotesInCollection(db: Database, collectionId: string) {
  const query = `
    SELECT * FROM notes WHERE id IN (SELECT note_id FROM notes_collections WHERE collection_id = $1)
  `;
  return await db.select(query, [collectionId]);
}

export async function addUser(db: Database, name: string, handle: string, email: string) {
  await db.execute(
    "INSERT INTO users (name, handle, email) VALUES ($1, $2, $3)",
    [name, handle, email]
  );
}

export async function addNote(db: Database, title: string, content: string, userId: string) {
  const now = new Date().toISOString();
  await db.execute(
    "INSERT INTO notes (title, content, created_at, updated_at, user_id) VALUES ($1, $2, $3, $4, $5)",
    [title, content, now, now, userId]
  );
}

export async function addCollection(db: Database, name: string, description: string, userId: string) {
  const now = new Date().toISOString();
  await db.execute(
    "INSERT INTO collections (name, description, created_at, updated_at, user_id) VALUES ($1, $2, $3, $4, $5)",
    [name, description, now, now, userId]
  );
}

export async function addNoteToCollection(db: Database, noteId: string, collectionId: string, userId: string) {
  const now = new Date().toISOString();
  await db.execute(
    "INSERT INTO notes_collections (note_id, collection_id, created_at, updated_at, user_id) VALUES ($1, $2, $3, $4, $5)",
    [noteId, collectionId, now, now, userId]
  );
}

export async function deleteRecord(db: Database, table: string, id: string) {
  await db.execute(`DELETE FROM ${table} WHERE id = $1`, [id]);
}