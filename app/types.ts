// ---- our new models ----
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

export interface Note {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    user_id: string;
}
