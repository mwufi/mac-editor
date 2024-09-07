import Sidebar from "@/app/components/Sidebar";
import NotesList from "@/app/components/NotesList";
import Editor from "@/app/components/Editor";

export default function Home() {
  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 font-[family-name:var(--font-geist-sans)]">
      <Sidebar />
      <NotesList />
      <Editor />
    </div>
  );
}
