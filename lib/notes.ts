// it's just a big mega note
import { appConfigDir, appDataDir, desktopDir } from '@tauri-apps/api/path';
import { exists } from '@tauri-apps/plugin-fs';

export async function getAppDataDir() {
    const appDataDirPath = await appDataDir();
    const appConfigDirPath = await appConfigDir();
    const desktopDirPath = await desktopDir();
    return {
        appDataDirPath,
        appConfigDirPath,
        desktopDirPath,
    };
}
import { createDir, BaseDirectory } from '@tauri-apps/plugin-fs';

export async function ensureDir(path: string) {
    const existingDir = await exists(path, { dir: BaseDirectory.AppData });
    if (!existingDir) {
        await createDir(path, { dir: BaseDirectory.AppData, recursive: true });
        console.log(`Directory created: ${path}`);
    }
}



import { readDir } from '@tauri-apps/plugin-fs';

export async function getFileTree() {
    const appDir = await getAppDataDir();
    const notes = await readDir(appDir.appDataDirPath + "notes", { recursive: true });
    return notes;
}