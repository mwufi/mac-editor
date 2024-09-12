import { Button } from "@/components/ui/button";
import { createNote } from "@/lib/orm";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { selectedNoteIdAtom, initialContentAtom, selectedCollectionIdAtom, collectionNotesAtom } from "@/app/atoms";
import { Pencil } from "lucide-react";

function CreateNoteButton() {
  const setSelectedNoteId = useSetAtom(selectedNoteIdAtom);
  const setInitialContent = useSetAtom(initialContentAtom);
  const selectedCollectionId = useAtomValue(selectedCollectionIdAtom);
  const [notes, setNotes] = useAtom(collectionNotesAtom);

  const handleCreateNote = async () => {
    if (selectedCollectionId) {
      try {
        const newNote = await createNote(selectedCollectionId);
        setNotes([newNote, ...notes]);
        setSelectedNoteId(newNote.id);
        setInitialContent('');
      } catch (error) {
        console.error("Failed to create new note:", error);
        // You might want to show an error message to the user here
      }
    }
  };
  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      onClick={handleCreateNote}
    >
      <Pencil size={16} className="text-gray-600 cursor-pointer" />
    </Button>
  );
}

export default CreateNoteButton;