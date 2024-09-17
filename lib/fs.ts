import { writeTextFile, mkdir, readTextFile, exists, BaseDirectory } from '@tauri-apps/plugin-fs';

export async function checkFile() {
  const testDirExists = await exists('test', { baseDir: BaseDirectory.Home });
  if (!testDirExists) {
    await mkdir('test', { baseDir: BaseDirectory.Home });
  }
  const result = await exists('test/avatar.png', { baseDir: BaseDirectory.Home });
  console.log("result: " + result);
  return result;
}

export async function ensureDir(dirName: string) {
  const testDirExists = await exists(dirName, { baseDir: BaseDirectory.Home });
  if (!testDirExists) {
    await mkdir(dirName, { baseDir: BaseDirectory.Home });
  }
}

export async function readFile() {
  const result = await readTextFile('test/config.json', { baseDir: BaseDirectory.Home });
  console.log("readFile: " + result);
  return result;
}

export async function writeFile() {
  const contents = JSON.stringify({ notifications: true });
  await writeTextFile('test/config.json', contents, {
    baseDir: BaseDirectory.Home,
  });
}