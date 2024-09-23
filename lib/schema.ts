import { relations } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const Users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name"),
  handle: text("handle").notNull(),
  email: text("email").notNull(),
}, (table) => ({
  handleIdx: uniqueIndex("idx_unique_user_handle").on(table.handle),
  emailIdx: uniqueIndex("idx_unique_user_email").on(table.email),
}));

export const Notes = sqliteTable("notes", {
  id: integer("id").primaryKey(),
  title: text("title"),
  content: text("content"),
  created_at: text("created_at").default("CURRENT_TIMESTAMP"),
  updated_at: text("updated_at").default("CURRENT_TIMESTAMP"),
  user_id: integer("user_id").references(() => Users.id),
});

export const Chat = sqliteTable("chat", {
  id: integer("id").primaryKey(),
  note_id: integer("note_id").references(() => Notes.id),
  created_at: text("created_at").default("CURRENT_TIMESTAMP"),
  updated_at: text("updated_at").default("CURRENT_TIMESTAMP"),
});

export const ChatMessages = sqliteTable("chat_messages", {
  id: integer("id").primaryKey(),
  chat_id: integer("chat_id").references(() => Chat.id),
  content: text("content"),
  created_at: text("created_at").default("CURRENT_TIMESTAMP"),
  updated_at: text("updated_at").default("CURRENT_TIMESTAMP"),
  sender: text("sender"),
});

export const NoteVersions = sqliteTable("note_versions", {
  id: integer("id").primaryKey(),
  note_id: integer("note_id").references(() => Notes.id),
  content: text("content"),
  created_at: text("created_at").default("CURRENT_TIMESTAMP"),
  updated_at: text("updated_at").default("CURRENT_TIMESTAMP"),
  user_id: integer("user_id").references(() => Users.id),
});

export const Collections = sqliteTable("collections", {
  id: integer("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  created_at: text("created_at").default("CURRENT_TIMESTAMP"),
  updated_at: text("updated_at").default("CURRENT_TIMESTAMP"),
  user_id: integer("user_id").references(() => Users.id),
});

export const NotesCollections = sqliteTable("notes_collections", {
  id: integer("id").primaryKey(),
  note_id: integer("note_id").references(() => Notes.id),
  collection_id: integer("collection_id").references(() => Collections.id),
  created_at: text("created_at").default("CURRENT_TIMESTAMP"),
  updated_at: text("updated_at").default("CURRENT_TIMESTAMP"),
  user_id: integer("user_id").references(() => Users.id),
}, (table) => ({
  uniqueNoteCollection: uniqueIndex("idx_unique_note_collection").on(table.note_id, table.collection_id),
}));

export const ShareLinks = sqliteTable("share_links", {
  id: integer("id").primaryKey(),
  note_id: integer("note_id").references(() => Notes.id),
  link: text("link"),
  created_at: text("created_at").default("CURRENT_TIMESTAMP"),
  updated_at: text("updated_at").default("CURRENT_TIMESTAMP"),
  user_id: integer("user_id").references(() => Users.id),
});

export const ChatRelations = relations(Chat, ({ many, one }) => ({
  note: one(Notes, {
    fields: [Chat.note_id],
    references: [Notes.id],
  }),
  messages: many(ChatMessages),
}));

export const ChatMessagesRelations = relations(ChatMessages, ({ one }) => ({
  chat: one(Chat, {
    fields: [ChatMessages.chat_id],
    references: [Chat.id],
  }),
}));

export const UsersRelations = relations(Users, ({ many }) => ({
  notes: many(Notes),
  collections: many(Collections),
}));

export const NotesRelations = relations(Notes, ({ many, one }) => ({
  collections: many(NotesCollections),
  versions: many(NoteVersions),
  shareLinks: many(ShareLinks),
  chat: one(Chat, {
    fields: [Notes.id],
    references: [Chat.note_id],
  }),
  user: one(Users, {
    fields: [Notes.user_id],
    references: [Users.id],
  }),
}));

export const CollectionsRelations = relations(Collections, ({ many, one }) => ({
  notes: many(NotesCollections),
  user: one(Users, {
    fields: [Collections.user_id],
    references: [Users.id],
  }),
}));

export const NotesCollectionsRelations = relations(NotesCollections, ({ one }) => ({
  note: one(Notes, {
    fields: [NotesCollections.note_id],
    references: [Notes.id],
  }),
  collection: one(Collections, {
    fields: [NotesCollections.collection_id],
    references: [Collections.id],
  }),
}));

export const ShareLinksRelations = relations(ShareLinks, ({ one }) => ({
  note: one(Notes, {
    fields: [ShareLinks.note_id],
    references: [Notes.id],
  }),
}));

export const NoteVersionsRelations = relations(NoteVersions, ({ one }) => ({
  note: one(Notes, {
    fields: [NoteVersions.note_id],
    references: [Notes.id],
  }),
}));
