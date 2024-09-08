// it's just a big mega note
import { appConfigDir, appDataDir, desktopDir } from '@tauri-apps/api/path';
import { exists } from '@tauri-apps/api/fs';

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
import { createDir, BaseDirectory } from '@tauri-apps/api/fs';

export async function ensureDir(path: string) {
    const existingDir = await exists(path, { dir: BaseDirectory.AppData });
    if (!existingDir) {
        await createDir(path, { dir: BaseDirectory.AppData, recursive: true });
        console.log(`Directory created: ${path}`);
    }
}



import { readDir } from '@tauri-apps/api/fs';

export async function listFilesInDirs() {
    const { appDataDirPath, appConfigDirPath, desktopDirPath } = await getAppDataDir();

    const appDataFiles = await readDir(appDataDirPath);
    const appConfigFiles = await readDir(appConfigDirPath);
    const desktopFiles = await readDir(desktopDirPath);

    return {
        appDataFiles,
        appConfigFiles,
        desktopFiles,
    };
}
