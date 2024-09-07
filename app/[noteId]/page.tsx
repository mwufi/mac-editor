
import { LocalNote } from "@/app/types";

export async function generateStaticParams() {
    const notes: LocalNote[] = [
        {
            id: "1",
            fullpath: "/notes/1",
            createdAt: "2023-01-01",
            updatedAt: "2023-01-01",
            title: "Meeting Notes",
            date: "2023-01-01",
            image: "https://picsum.photos/200/300?random=1",
        },
        {
            id: "2",
            fullpath: "/notes/2",
            createdAt: "2023-01-01",
            updatedAt: "2023-01-01",
            title: "Project Ideas",
            date: "2023-01-01",
            image: "https://picsum.photos/200/300?random=2",
        },
        {
            id: "3",
            fullpath: "/notes/3",
            createdAt: "2023-01-01",
            updatedAt: "2023-01-01",
            title: "Travel Plans",
            date: "2023-01-01",
            image: "https://picsum.photos/200/300?random=3",
        },
    ];

    return notes.map((note) => ({
        noteId: note.id,
    }));
}

export default function NotePage({ params }: { params: { noteId: string } }) {
    return <div>Note {params.noteId}</div>;
}