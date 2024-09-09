// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use tauri::Manager;
use tauri_plugin_sql::{Builder, Migration, MigrationKind};

#[tauri::command]
fn read_config() -> Result<String, String> {
    let config_path = format!("{}/Desktop/config.json", std::env::var("HOME").unwrap());
    println!("config_path: {}", config_path);
    match fs::read_to_string(config_path) {
        Ok(content) => Ok(content),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
fn my_custom_command() {
    println!("I was invoked from JS!");
}

fn main() {
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, handle TEXT, email TEXT);",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_notes_table",
            sql: "CREATE TABLE notes (id INTEGER PRIMARY KEY, title TEXT, content TEXT, created_at DATETIME, updated_at DATETIME, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id));",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create_note_versions_table",
            sql: "CREATE TABLE note_versions (id INTEGER PRIMARY KEY, note_id INTEGER, content TEXT, created_at DATETIME, updated_at DATETIME, user_id INTEGER, FOREIGN KEY(note_id) REFERENCES notes(id), FOREIGN KEY(user_id) REFERENCES users(id));",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 4,
            description: "create_collections_table",
            sql: "CREATE TABLE collections (id INTEGER PRIMARY KEY, name TEXT, description TEXT, created_at DATETIME, updated_at DATETIME, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id));",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 5,
            description: "create_notes_collections_table",
            sql: "CREATE TABLE notes_collections (id INTEGER PRIMARY KEY, note_id INTEGER, collection_id INTEGER, created_at DATETIME, updated_at DATETIME, user_id INTEGER, FOREIGN KEY(note_id) REFERENCES notes(id), FOREIGN KEY(collection_id) REFERENCES collections(id), FOREIGN KEY(user_id) REFERENCES users(id));",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 6,
            description: "create_share_links_table",
            sql: "CREATE TABLE share_links (id INTEGER PRIMARY KEY, note_id INTEGER, link TEXT, created_at DATETIME, updated_at DATETIME, user_id INTEGER, FOREIGN KEY(note_id) REFERENCES notes(id), FOREIGN KEY(user_id) REFERENCES users(id));",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 7,
            description: "add_unique_constraint_to_notes_collections",
            sql: "CREATE UNIQUE INDEX idx_unique_note_collection ON notes_collections(note_id, collection_id);",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 8,
            description: "add_unique_constraint_to_users_handle_and_email",
            sql: "CREATE UNIQUE INDEX idx_unique_user_handle ON users(handle); CREATE UNIQUE INDEX idx_unique_user_email ON users(email);",
            kind: MigrationKind::Up,
        },
    ];

    // This is where you pass in your commands
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().add_migrations("sqlite:real.db", migrations).build())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![my_custom_command, read_config])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
