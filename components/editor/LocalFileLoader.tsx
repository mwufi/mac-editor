'use client'

import { v4 as uuidv4 } from 'uuid';
import { writeFile, BaseDirectory, readFile } from '@tauri-apps/plugin-fs';
import { appDataDir } from '@tauri-apps/api/path';

export async function uploadImageToLocal(file: File) {
  console.log("Uploading image to local storage")
  const uuid = uuidv4();
  const fileName = `${uuid}.${file.name.split('.').pop()}`;
  console.log("File name", file)

  const fileReader = new FileReader();

  return new Promise<string | null>((resolve) => {
    fileReader.onload = async () => {
      const arrayBuffer = fileReader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);

      try {
        const appDataDirPath = await appDataDir();
        console.log("Writing file to", appDataDirPath)
        await writeFile(`images/${fileName}`, uint8Array, {
          baseDir: BaseDirectory.AppData,
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