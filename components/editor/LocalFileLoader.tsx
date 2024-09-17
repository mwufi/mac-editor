'use client'

import { v4 as uuidv4 } from 'uuid';
import { writeFile, BaseDirectory, readFile, exists, mkdir } from '@tauri-apps/plugin-fs';
import { join, homeDir } from '@tauri-apps/api/path';
import { convertFileSrc } from '@tauri-apps/api/core';

async function ensureDir(dirName: string) {
  const testDirExists = await exists(dirName, { baseDir: BaseDirectory.Home });
  if (!testDirExists) {
    await mkdir(dirName, { baseDir: BaseDirectory.Home });
  }
}

export async function uploadImageToLocal(file: File) {
  const uuid = uuidv4();
  const fileName = `${uuid}.${file.name.split('.').pop()}`;
  const filepath = `images/${fileName}`
  console.log("Attempting to save to", filepath)
  await ensureDir("images")

  const fileReader = new FileReader();

  return new Promise<string | null>((resolve) => {
    fileReader.onload = async () => {
      const arrayBuffer = fileReader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);

      try {
        await writeFile(filepath, uint8Array, {
          baseDir: BaseDirectory.Home,
        });
        console.log("Uploaded image to local storage", fileName);

        const assetUrl = convertFileSrc(await join(await homeDir(), filepath))
        resolve(assetUrl)
      } catch (error) {
        console.error('Error uploading image:', error.message);
        resolve(null);
      }
    };

    fileReader.readAsArrayBuffer(file);
  });
}

export const loader = async ({ src, width, quality }: { src: string; width: number, quality?: number }) => {
  console.log("[loader] loading from local storage", src)
  if (src.startsWith('images/')) {
    // Load from local storage
    try {
      const homedirectory = await homeDir()
      const filePath = await join(homedirectory, src);
      const assetUrl = convertFileSrc(filePath);
      return assetUrl;
    } catch (error) {
      console.error('Error reading image:', error);
      return src;
    }
  } else {
    // Load from default (assuming it's a full URL or relative path)
    return `${src}?width=${width}`;
  }
}