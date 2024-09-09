
export interface LocalNote {
    id: string;
    fullpath: string;
    content: string;
    createdAt: string;
    updatedAt: string;

    title: string;
    date: string;
    image?: string;
}

export interface Note {
    id: string;
    content: string;
    title: string;
    image?: string;

    updatedAt: Date;
    createdAt: Date;
    versions: Version[];
    parent_folder: Folder;
}

export interface Version {
    id: string;
    note_id: string;
    content: string;
    author: Author;
    updatedAt: Date;
    createdAt: Date;
}

export interface Folder {
    id: string;
    name: string;
    notes: Note[];
}

export interface Author {
    id: string;
    name: string;
    email: string;
}


export interface User {
    id: string;
    name: string;
    handle: string;
    email?: string;
}

export interface Collection {
    id: string;
    name: string;
    description: string;
    note_count: number;
}
