"use client";

import { DialogContents } from "@/components/DialogContents";
import { Button } from "@/components/ui/button";
import { dialogOpenAtom } from "@/app/atoms";
import { useAtom } from "jotai";

export default function DialogTestPage() {
  const [isOpen, setIsOpen] = useAtom(dialogOpenAtom);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dialog Test Page</h1>
      <Button onClick={() => setIsOpen(!isOpen)}>Open Dialog</Button>
      {isOpen && (
        <DialogContents />
      )}
    </div>
  );
}
