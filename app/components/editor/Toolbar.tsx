import { useAtomValue } from "jotai";
import { editorAtom } from "@/app/atoms";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Bold, Italic, Underline, Strikethrough, Image, AlignLeft, AlignCenter, AlignRight, Paperclip, Share } from "lucide-react";
import { Editor } from "@tiptap/react";

function getSelectionChain(editor: Editor) {
    if (editor.state.selection.empty) {
        return editor.chain().focus().selectParentNode();
    }
    return editor.chain().focus();
}

export default function Toolbar() {
    const editor = useAtomValue(editorAtom);

    const editorFontSize = editor?.getAttributes('textStyle').fontSize;
    const [fontSize, setFontSize] = useState(editorFontSize);

    if (!editor) return null;

    return (
        <div className="control-group py-2 flex flex-row gap-2 mb-4">
            <div className="button-group">
                <Select onValueChange={(value) => {
                    getSelectionChain(editor).setFontFamily(value).run();
                }}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Comic Sans MS, Comic Sans">Comic Sans</SelectItem>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="monospace">Monospace</SelectItem>
                        <SelectItem value="cursive">Cursive</SelectItem>
                        <SelectItem value="var(--title-font-family)">CSS variable</SelectItem>
                        <SelectItem value='"Comic Sans MS", "Comic Sans"'>Comic Sans quoted</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-1 border rounded-md p-2">
                <button
                    onClick={() => {
                        const currentSize = parseInt(editorFontSize || '16');
                        const newSize = Math.max(8, currentSize - 1);
                        editor.chain().focus().setFontSize(`${newSize}pt`).run();
                    }}
                    className="h-5 w-8 font-medium flex items-center justify-center"
                >
                    -
                </button>
                <input
                    type="text"
                    value={fontSize || '16pt'}
                    onChange={(e) => {
                        const newSize = e.target.value.replace(/[^0-9]/g, '');
                        setFontSize(newSize);
                        if (parseInt(newSize) >= 10 && parseInt(newSize) <= 72) {
                            editor.chain().focus().setFontSize(`${newSize}pt`).run();
                        }
                    }}
                    className="w-8 font-medium text-center rounded h-5"
                />
                <button
                    onClick={() => {
                        const currentSize = parseInt(editorFontSize || '16');
                        const newSize = Math.min(72, currentSize + 1);
                        getSelectionChain(editor).setFontSize(`${newSize}pt`).run();
                    }}
                    className="h-5 w-8 flex items-center justify-center"
                >
                    +
                </button>
            </div>
            <div className="flex items-center border p-1 rounded-md">
                <Toggle
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => {
                        getSelectionChain(editor).toggleBold().run();
                    }}
                    aria-label="Toggle bold"
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => {
                        getSelectionChain(editor).toggleItalic().run();
                    }}
                    aria-label="Toggle italic"
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                    pressed={editor.isActive('underline')}
                    onPressedChange={() => {
                        getSelectionChain(editor).toggleUnderline().run();
                    }}
                    aria-label="Toggle underline"
                >
                    <Underline className="h-4 w-4" />
                </Toggle>
                <Toggle
                    pressed={editor.isActive('strike')}
                    onPressedChange={() => {
                        getSelectionChain(editor).toggleStrike().run();
                    }}
                    aria-label="Toggle strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </Toggle>
            </div>
            <div className="flex items-center border p-1 rounded-md">
                <Toggle
                    pressed={editor.isActive({ textAlign: 'left' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                    aria-label="Align left"
                >
                    <AlignLeft className="h-4 w-4" />
                </Toggle>
                <Toggle
                    pressed={editor.isActive({ textAlign: 'center' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                    aria-label="Align center"
                >
                    <AlignCenter className="h-4 w-4" />
                </Toggle>
                <Toggle
                    pressed={editor.isActive({ textAlign: 'right' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                    aria-label="Align right"
                >
                    <AlignRight className="h-4 w-4" />
                </Toggle>
            </div>
            <div className="flex items-center gap-2 ml-auto">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                        // Implement image upload logic here
                    }}
                    aria-label="Add image"
                >
                    <Image className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                        // Implement attachment logic here
                    }}
                    aria-label="Add attachment"
                >
                    <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 w-18 flex items-center justify-center gap-2"
                    onClick={() => {
                        // Implement share logic here
                    }}
                    aria-label="Share"
                >
                    <Share className="h-4 w-4" />
                    Share
                </Button>
            </div>
        </div>
    )
}