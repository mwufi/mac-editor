'use client'

import { v4 as uuidv4 } from 'uuid';
import { writeFile, BaseDirectory, readFile, exists, mkdir } from '@tauri-apps/plugin-fs';

async function ensureDir(dirName: string) {
  const testDirExists = await exists(dirName, { baseDir: BaseDirectory.Home });
  if (!testDirExists) {
    await mkdir(dirName, { baseDir: BaseDirectory.Home });
  }
}

export async function uploadImageToLocal(file: File) {
  const uuid = uuidv4();
  const fileName = `${uuid}.${file.name.split('.').pop()}`;
  const fullPath = `images/${fileName}`
  console.log("Attempting to save to", fullPath)
  await ensureDir("images")

  const fileReader = new FileReader();

  return new Promise<string | null>((resolve) => {
    fileReader.onload = async () => {
      const arrayBuffer = fileReader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);

      try {
        await writeFile(fullPath, uint8Array, {
          baseDir: BaseDirectory.Home,
        });
        console.log("Uploaded image to local storage", fileName);
        resolve(`images/${fileName}`);
      } catch (error) {
        console.error('Error uploading image:', error);
        resolve(null);
      }
    };

    fileReader.readAsArrayBuffer(file);
  });
}

export const loader = async ({ src, width }: { src: string; width: number }) => {
  if (src.startsWith('images/')) {
    // Load from local storage
    try {
      const imageData = await readFile(src, {
        baseDir: BaseDirectory.AppData,
      });
      const blob = new Blob([imageData], { type: 'image/png' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error reading image:', error);
      return src;
    }
  } else {
    // Load from default (assuming it's a full URL or relative path)
    return `${src}?width=${width}`;
  }
}