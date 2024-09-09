'use client'

import Database from '@tauri-apps/plugin-sql'
import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

async function loadDatabase() {
  return await Database.load('sqlite:real.db')
}

async function fetchAllData(db: Database) {
  const tables = await db.select("SELECT name FROM sqlite_master WHERE type='table'");
  console.log("All tables in the database:", tables.map((table: any) => table.name));

  const users = await db.select("SELECT * FROM users");
  const notes = await db.select("SELECT * FROM notes");
  const collections = await db.select("SELECT * FROM collections");
  const notesCollections = await db.select("SELECT * FROM notes_collections");
  const shareLinks = await db.select("SELECT * FROM share_links");
  return { users, notes, collections, notesCollections, shareLinks };
}

async function getCollectionsWithNoteCount(db: Database, userId: string) {
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
    const collections = await db.select(query, [userId]);
    return collections;
  } catch (error) {
    console.error("Error fetching collections with note count:", error);
    throw error;
  }
}


async function addUser(db: Database, name: string, handle: string, email: string) {
  await db.execute(
    "INSERT INTO users (name, handle, email) VALUES ($1, $2, $3)",
    [name, handle, email]
  );
}

async function addNote(db: Database, title: string, content: string, userId: string) {
  const now = new Date().toISOString();
  await db.execute(
    "INSERT INTO notes (title, content, created_at, updated_at, user_id) VALUES ($1, $2, $3, $4, $5)",
    [title, content, now, now, userId]
  );
}

async function addCollection(db: Database, name: string, description: string, userId: string) {
  const now = new Date().toISOString();
  await db.execute(
    "INSERT INTO collections (name, description, created_at, updated_at, user_id) VALUES ($1, $2, $3, $4, $5)",
    [name, description, now, now, userId]
  );
}

async function addNoteToCollection(db: Database, noteId: string, collectionId: string, userId: string) {
  const now = new Date().toISOString();
  await db.execute(
    "INSERT INTO notes_collections (note_id, collection_id, created_at, updated_at, user_id) VALUES ($1, $2, $3, $4, $5)",
    [noteId, collectionId, now, now, userId]
  );
}

async function deleteRecord(db: Database, table: string, id: string) {
  await db.execute(`DELETE FROM ${table} WHERE id = $1`, [id]);
}

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [db, setDb] = useState<Database | null>(null);
  const [newUser, setNewUser] = useState({ name: '', handle: '', email: '' });
  const [newNote, setNewNote] = useState({ title: '', content: '', userId: '' });
  const [newNoteCollection, setNewNoteCollection] = useState({ noteId: '', collectionId: '', userId: '' });
  const [newCollection, setNewCollection] = useState({ name: '', description: '', userId: '' });
  const [currentUser, setCurrentUser] = useState<string>('');

  useEffect(() => {
    loadDatabase().then(setDb);
  }, []);

  useEffect(() => {
    if (db) {
      fetchAllData(db).then(setData);
    }
  }, [db]);

  const handleAddUser = async () => {
    if (!db) {
      toast.message('Error', { description: 'Database not loaded' });
      return;
    }
    if (!newUser.name || !newUser.handle || !newUser.email) {
      toast.message('Error', { description: 'All fields are required' });
      return;
    }
    await addUser(db, newUser.name, newUser.handle, newUser.email);
    fetchAllData(db).then(setData);
    setNewUser({ name: '', handle: '', email: '' });
    toast.success("User added successfully");
  };

  const handleAddNote = async () => {
    if (!db) {
      toast.message('Error', { description: 'Database not loaded' });
      return;
    }
    if (!newNote.title || !newNote.content || !currentUser) {
      toast.message('Error', { description: 'All fields are required' });
      return;
    }
    await addNote(db, newNote.title, newNote.content, currentUser);
    fetchAllData(db).then(setData);
    setNewNote({ title: '', content: '', userId: '' });
    toast.success("Note added successfully");
  };

  const handleAddCollection = async () => {
    if (!db) {
      toast.message('Error', { description: 'Database not loaded' });
      return;
    }
    if (!newCollection.name || !newCollection.description || !currentUser) {
      toast.message('Error', { description: 'All fields are required' });
      return;
    }
    await addCollection(db, newCollection.name, newCollection.description, currentUser);
    fetchAllData(db).then(setData);
    setNewCollection({ name: '', description: '', userId: '' });
    toast.success("Collection added successfully");
  };

  const handleAddNoteToCollection = async () => {
    if (!db) {
      toast.message('Error', { description: 'Database not loaded' });
      return;
    }
    if (!newNoteCollection.noteId || !newNoteCollection.collectionId || !currentUser) {
      toast.message('Error', { description: 'All fields are required' });
      return;
    }
    await addNoteToCollection(db, newNoteCollection.noteId, newNoteCollection.collectionId, currentUser);
    fetchAllData(db).then(setData);
    setNewNoteCollection({ noteId: '', collectionId: '', userId: '' });
    toast.success("Note added to collection successfully");
  };

  const handleDelete = async (table: string, id: string) => {
    if (!db) {
      toast.message('Error', { description: 'Database not loaded' });
      return;
    }
    await deleteRecord(db, table, id);
    fetchAllData(db).then(setData);
    toast.success("Record deleted successfully");
  };

  if (!data) return <div>Loading... <Button onClick={() => loadDatabase().then(setDb)}>Reload</Button></div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Database Overview</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Current User</h2>
        <Select onValueChange={setCurrentUser} value={currentUser}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            {data.users.map((user: any) => (
              <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <div className="flex gap-2 mb-2">
          <Input placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
          <Input placeholder="Handle" value={newUser.handle} onChange={(e) => setNewUser({ ...newUser, handle: e.target.value })} />
          <Input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          <Button onClick={handleAddUser}>Add User</Button>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-1/12">ID</th>
              <th className="w-3/12">Name</th>
              <th className="w-3/12">Handle</th>
              <th className="w-4/12">Email</th>
              <th className="w-1/12">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((user: any) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.handle}</td>
                <td>{user.email}</td>
                <td><Button onClick={() => handleDelete('users', user.id)}>Delete</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Notes</h2>
        <div className="flex gap-2 mb-2">
          <Input placeholder="Title" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} />
          <Input placeholder="Content" value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} />
          <Button onClick={handleAddNote}>Add Note</Button>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-1/12">ID</th>
              <th className="w-2/12">Title</th>
              <th className="w-3/12">Content</th>
              <th className="w-2/12">Created At</th>
              <th className="w-2/12">Updated At</th>
              <th className="w-1/12">User ID</th>
              <th className="w-1/12">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.notes.map((note: any) => (
              <tr key={note.id}>
                <td>{note.id}</td>
                <td>{note.title}</td>
                <td>{note.content}</td>
                <td>{new Date(note.created_at).toLocaleString()}</td>
                <td>{new Date(note.updated_at).toLocaleString()}</td>
                <td>{note.user_id}</td>
                <td><Button onClick={() => handleDelete('notes', note.id)}>Delete</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Collections</h2>
        <div className="flex gap-2 mb-2">
          <Input placeholder="Name" value={newCollection.name} onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })} />
          <Input placeholder="Description" value={newCollection.description} onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })} />
          <Button onClick={handleAddCollection}>Add Collection</Button>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-1/12">ID</th>
              <th className="w-2/12">Name</th>
              <th className="w-3/12">Description</th>
              <th className="w-2/12">Created At</th>
              <th className="w-2/12">Updated At</th>
              <th className="w-1/12">User ID</th>
              <th className="w-1/12">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.collections.map((collection: any) => (
              <tr key={collection.id}>
                <td>{collection.id}</td>
                <td>{collection.name}</td>
                <td>{collection.description}</td>
                <td>{new Date(collection.created_at).toLocaleString()}</td>
                <td>{new Date(collection.updated_at).toLocaleString()}</td>
                <td>{collection.user_id}</td>
                <td><Button onClick={() => handleDelete('collections', collection.id)}>Delete</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Notes in Collections</h2>
        <div className="flex gap-2 mb-2">
          <Input placeholder="Note ID" value={newNoteCollection.noteId} onChange={(e) => setNewNoteCollection({ ...newNoteCollection, noteId: e.target.value })} />
          <Input placeholder="Collection ID" value={newNoteCollection.collectionId} onChange={(e) => setNewNoteCollection({ ...newNoteCollection, collectionId: e.target.value })} />
          <Button onClick={handleAddNoteToCollection}>Add Note to Collection</Button>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-1/12">ID</th>
              <th className="w-2/12">Note ID</th>
              <th className="w-2/12">Collection ID</th>
              <th className="w-2/12">Created At</th>
              <th className="w-2/12">Updated At</th>
              <th className="w-2/12">User ID</th>
              <th className="w-1/12">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.notesCollections.map((nc: any) => (
              <tr key={nc.id}>
                <td>{nc.id}</td>
                <td>{nc.note_id}</td>
                <td>{nc.collection_id}</td>
                <td>{new Date(nc.created_at).toLocaleString()}</td>
                <td>{new Date(nc.updated_at).toLocaleString()}</td>
                <td>{nc.user_id}</td>
                <td><Button onClick={() => handleDelete('notes_collections', nc.id)}>Delete</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Share Links</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-1/12">ID</th>
              <th className="w-2/12">Note ID</th>
              <th className="w-3/12">Link</th>
              <th className="w-2/12">Created At</th>
              <th className="w-2/12">Updated At</th>
              <th className="w-1/12">User ID</th>
              <th className="w-1/12">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.shareLinks.map((link: any) => (
              <tr key={link.id}>
                <td>{link.id}</td>
                <td>{link.note_id}</td>
                <td>{link.link}</td>
                <td>{new Date(link.created_at).toLocaleString()}</td>
                <td>{new Date(link.updated_at).toLocaleString()}</td>
                <td>{link.user_id}</td>
                <td><Button onClick={() => handleDelete('share_links', link.id)}>Delete</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}