// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use std::fs;

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
  // This is where you pass in your commands
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![my_custom_command, read_config])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}