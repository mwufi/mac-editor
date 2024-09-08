"use client";

import { save } from "@tauri-apps/api/dialog";
import { writeTextFile } from "@tauri-apps/api/fs";
import { FullScreenSection, TwoColumnLayout } from "@/app/components/Layout";
import { Button } from "@/components/ui/button";
import { ensureDir, getAppDataDir, listFilesInDirs } from "@/lib/notes";
import { invoke } from "@tauri-apps/api/tauri";
import { toast } from "sonner";
import { useState } from "react";

export default function FileTest() {
    const [messages, setMessages] = useState<any[]>([]);
    const logMessage = (message: any) => {
        setMessages(prevMessages => [...prevMessages, message]);
    };

    return (
        <FullScreenSection>
            <div className="flex p-4 gap-4">
                <Button onClick={async () => {
                    await ensureDir("settings");
                    logMessage(await getAppDataDir());
                    logMessage(await listFilesInDirs());
                }}>Log Paths</Button>
                <Button onClick={async () => {
                    const filepath = await save({
                        defaultPath: "settings/test.txt",
                        title: "Save File",
                        filters: [{ name: "Text Files", extensions: ["txt"] }],
                    });
                    if (filepath) {
                        logMessage("writing file to " + filepath);
                        await writeTextFile(filepath, "Hello World");
                        toast.success("File saved");
                    } else {
                        toast.error("File not saved");
                    }
                }}>Create Test File</Button>
                <Button onClick={async () => {
                    try {
                        await writeTextFile("/Users/zen.tang/Documents/test.txt", "Hello World");
                        toast.success("File saved");
                    } catch (error) {
                        logMessage("error");
                        logMessage(error);
                    }
                }}>Create Test File Directly</Button>
                <Button onClick={async () => {
                    const filepath = "/Users/zen.tang/mac-editor/Desktop/test.txt";
                    try {
                        logMessage("writing file to Desktop");
                        await writeTextFile(filepath, "Hello World");
                        toast.success("File saved");
                    } catch (error) {
                        logMessage("error");
                        logMessage(error);
                    }
                }}>Open Test File</Button>

                <Button onClick={async () => {
                    const result = await invoke("read_config");
                    logMessage("read_config");
                    logMessage(result);
                    const parsedResult = JSON.parse(result as string);
                    toast.success(parsedResult.hello);
                }}>Invoke Command</Button>
            </div>
            <div className="flex flex-col gap-2 bg-gray-200 p-2 rounded-md overflow-y-auto max-h-[300px]">
                {messages.map((message, index) => (
                    <div key={index} className="bg-gray-200 p-2 rounded-md">
                        {JSON.stringify(message)}
                    </div>
                ))}
            </div>
        </FullScreenSection>

    )
}