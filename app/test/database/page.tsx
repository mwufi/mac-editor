'use client'

import Database from '@tauri-apps/plugin-sql'
import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addUser, createNote, createCollection, createNoteToCollection, deleteRecord, deleteNote, ensureTables } from '@/lib/orm'
import { writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import { appDataDir } from '@tauri-apps/api/path';

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

  const handlecreateNote = async () => {
    if (!db) {
      toast.message('Error', { description: 'Database not loaded' });
      return;
    }
    if (!newNote.title || !newNote.content || !currentUser) {
      toast.message('Error', { description: 'All fields are required' });
      return;
    }
    await createNote(newNote.title, newNote.content, currentUser);
    fetchAllData(db).then(setData);
    setNewNote({ title: '', content: '', userId: '' });
    toast.success("Note added successfully");
  };

  const handlecreateCollection = async () => {
    if (!db) {
      toast.message('Error', { description: 'Database not loaded' });
      return;
    }
    if (!newCollection.name || !newCollection.description || !currentUser) {
      toast.message('Error', { description: 'All fields are required' });
      return;
    }
    await createCollection(newCollection.name, newCollection.description, currentUser);
    fetchAllData(db).then(setData);
    setNewCollection({ name: '', description: '', userId: '' });
    toast.success("Collection added successfully");
  };

  const handlecreateNoteToCollection = async () => {
    if (!db) {
      toast.message('Error', { description: 'Database not loaded' });
      return;
    }
    if (!newNoteCollection.noteId || !newNoteCollection.collectionId || !currentUser) {
      toast.message('Error', { description: 'All fields are required' });
      return;
    }
    await createNoteToCollection(newNoteCollection.noteId, newNoteCollection.collectionId, currentUser);
    fetchAllData(db).then(setData);
    setNewNoteCollection({ noteId: '', collectionId: '', userId: '' });
    toast.success("Note added to collection successfully");
  };

  const handleDelete = async (table: "Users" | "Notes" | "Collections" | "NotesCollections" | "ShareLinks", id: string) => {
    if (!db) {
      toast.message('Error', { description: 'Database not loaded' });
      return;
    }
    await deleteRecord(table, id);
    fetchAllData(db).then(setData);
    toast.success("Record deleted successfully");
  };

  if (!data) return <div>Loading... <Button onClick={() => loadDatabase().then(setDb)}>Reload</Button></div>;

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Database Overview</h1>
      <Button onClick={async () => {
        await ensureTables();
        fetchAllData(db!).then(setData);
        toast.success("Tables ensured successfully");
      }}>
        Ensure Tables
      </Button>

      <Button onClick={async () => {
        async function write(message: string) {
          await writeTextFile('test.txt', message, { baseDir: BaseDirectory.AppData });
        }
        const appDataDirPath = await appDataDir();
        toast.info("App data directory path: " + appDataDirPath);
        write("Hello, world!");
      }}>
        Create text file
      </Button>

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
                <td><Button onClick={() => handleDelete('Users', user.id)}>Delete</Button></td>
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
          <Button onClick={handlecreateNote}>Add Note</Button>
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
                <td>{note.content.substring(0, 50) + "..."}</td>
                <td>{new Date(note.created_at).toLocaleString()}</td>
                <td>{new Date(note.updated_at).toLocaleString()}</td>
                <td>{note.user_id}</td>
                <td><Button onClick={async () => {
                  await deleteNote(note.id)
                  fetchAllData(db!).then(setData);
                }}>Delete</Button></td>
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
          <Button onClick={handlecreateCollection}>Add Collection</Button>
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
                <td><Button onClick={() => handleDelete('Collections', collection.id)}>Delete</Button></td>
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
          <Button onClick={handlecreateNoteToCollection}>Add Note to Collection</Button>
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
                <td><Button onClick={() => handleDelete('NotesCollections', nc.id)}>Delete</Button></td>
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
                <td><Button onClick={() => handleDelete('ShareLinks', link.id)}>Delete</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}