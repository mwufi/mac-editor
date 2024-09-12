import { Button } from "@/components/ui/button";
import { deleteNote } from "@/lib/orm";
import { useAtom, useSetAtom } from "jotai";
import { selectedNoteIdAtom, initialContentAtom, collectionNotesAtom } from "@/app/atoms";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

function TrashNoteButton() {
  const [selectedNoteId, setSelectedNoteId] = useAtom(selectedNoteIdAtom);
  const setInitialContent = useSetAtom(initialContentAtom);
  const [notes, setNotes] = useAtom(collectionNotesAtom);

  const handleDeleteNote = async () => {
    let noteTitle = "";
    if (selectedNoteId) {
      const note = notes.find(note => note.id === selectedNoteId);
      if (note) {
        noteTitle = note.title;
      }
      await deleteNote(selectedNoteId);
      setNotes(notes.filter(note => note.id !== selectedNoteId));
      setSelectedNoteId(notes.length > 0 ? notes[0].id : null);
      setInitialContent('');
    }

    toast.success(`"${noteTitle}" deleted`);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      onClick={handleDeleteNote}
    >
      <Trash2 size={16} className="text-gray-600 cursor-pointer" />
    </Button>
  );
}

export default TrashNoteButton;