import Sidebar from "@/app/components/Sidebar";
import NotesList from "@/app/components/NotesList";
import Editor from "@/app/components/Editor";
import LightNav from "@/app/test/LightNav";

export default function Home() {
  return (
    <div className="flex h-full max-h-[100vh] overflow-hidden bg-white dark:bg-gray-900 font-[family-name:var(--font-geist-sans)]">
      {/* <Sidebar /> */}
      <LightNav />
      <NotesList />
      <Editor />
    </div>
  );
}
