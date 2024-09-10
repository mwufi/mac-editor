
export async function generateStaticParams() {
    return [];
}

export default function NotePage({ params }: { params: { noteId: string } }) {
    return <div>Note {params.noteId}</div>;
}