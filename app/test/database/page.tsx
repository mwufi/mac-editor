'use client'

import Database from '@tauri-apps/plugin-sql'
import { useState, useEffect } from 'react'

async function loadDatabase() {
  return await Database.load('sqlite:real.db')
}

async function fetchAllData(db) {
  const tables = await db.select("SELECT name FROM sqlite_master WHERE type='table'");
  console.log("All tables in the database:", tables.map(table => table.name));

  const users = await db.select("SELECT * FROM users");
  const notes = await db.select("SELECT * FROM notes");
  const collections = await db.select("SELECT * FROM collections");
  const notesCollections = await db.select("SELECT * FROM notes_collections");
  const shareLinks = await db.select("SELECT * FROM share_links");
  return { users, notes, collections, notesCollections, shareLinks };
}

async function addUser(db, name, handle, email) {
  await db.execute(
    "INSERT INTO users (name, handle, email) VALUES ($1, $2, $3)",
    [name, handle, email]
  );
}

async function addNote(db, title, content, userId) {
  const now = new Date().toISOString();
  await db.execute(
    "INSERT INTO notes (title, content, created_at, updated_at, user_id) VALUES ($1, $2, $3, $4, $5)",
    [title, content, now, now, userId]
  );
}

async function addNoteToCollection(db, noteId, collectionId, userId) {
  const now = new Date().toISOString();
  await db.execute(
    "INSERT INTO notes_collections (note_id, collection_id, created_at, updated_at, user_id) VALUES ($1, $2, $3, $4, $5)",
    [noteId, collectionId, now, now, userId]
  );
}

export default function Page() {
  const [data, setData] = useState(null);
  const [db, setDb] = useState(null);

  useEffect(() => {
    loadDatabase().then(setDb);
  }, []);

  useEffect(() => {
    if (db) {
      fetchAllData(db).then(setData);
    }
  }, [db]);

  const handleAddUser = async () => {
    const name = prompt("Enter user name:");
    const handle = prompt("Enter user handle:");
    const email = prompt("Enter user email:");
    await addUser(db, name, handle, email);
    fetchAllData(db).then(setData);
  };

  const handleAddNote = async () => {
    const title = prompt("Enter note title:");
    const content = prompt("Enter note content:");
    const userId = prompt("Enter user ID:");
    await addNote(db, title, content, userId);
    fetchAllData(db).then(setData);
  };

  const handleAddNoteToCollection = async () => {
    const noteId = prompt("Enter note ID:");
    const collectionId = prompt("Enter collection ID:");
    const userId = prompt("Enter user ID:");
    await addNoteToCollection(db, noteId, collectionId, userId);
    fetchAllData(db).then(setData);
  };

  if (!data) return <div>Loading... <button onClick={() => {
    loadDatabase().then(setDb);
  }}>Reload</button></div>;

  return (
    <div>
      <h1>Database Overview</h1>

      <h2>Users</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Handle</th><th>Email</th></tr>
        </thead>
        <tbody>
          {data.users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.handle}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddUser}>Add User</button>

      <h2>Notes</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Title</th><th>Content</th><th>Created At</th><th>Updated At</th><th>User ID</th></tr>
        </thead>
        <tbody>
          {data.notes.map(note => (
            <tr key={note.id}>
              <td>{note.id}</td>
              <td>{note.title}</td>
              <td>{note.content}</td>
              <td>{note.created_at}</td>
              <td>{note.updated_at}</td>
              <td>{note.user_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddNote}>Add Note</button>

      <h2>Collections</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Description</th><th>Created At</th><th>Updated At</th><th>User ID</th></tr>
        </thead>
        <tbody>
          {data.collections.map(collection => (
            <tr key={collection.id}>
              <td>{collection.id}</td>
              <td>{collection.name}</td>
              <td>{collection.description}</td>
              <td>{collection.created_at}</td>
              <td>{collection.updated_at}</td>
              <td>{collection.user_id}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Notes in Collections</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Note ID</th><th>Collection ID</th><th>Created At</th><th>Updated At</th><th>User ID</th></tr>
        </thead>
        <tbody>
          {data.notesCollections.map(nc => (
            <tr key={nc.id}>
              <td>{nc.id}</td>
              <td>{nc.note_id}</td>
              <td>{nc.collection_id}</td>
              <td>{nc.created_at}</td>
              <td>{nc.updated_at}</td>
              <td>{nc.user_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddNoteToCollection}>Add Note to Collection</button>

      <h2>Share Links</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>Note ID</th><th>Link</th><th>Created At</th><th>Updated At</th><th>User ID</th></tr>
        </thead>
        <tbody>
          {data.shareLinks.map(link => (
            <tr key={link.id}>
              <td>{link.id}</td>
              <td>{link.note_id}</td>
              <td>{link.link}</td>
              <td>{link.created_at}</td>
              <td>{link.updated_at}</td>
              <td>{link.user_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}