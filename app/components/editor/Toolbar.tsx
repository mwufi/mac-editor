import { useAtomValue } from "jotai";
import { editorAtom } from "@/app/atoms";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Bold, Italic, Underline, Strikethrough, Image, AlignLeft, AlignCenter, AlignRight, Paperclip, Share, Type } from "lucide-react";
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
        <div className="control-group py-2 flex flex-row gap-1 mb-4 text-pink-500">
            <div className="button-group">
                <Select onValueChange={(value) => {
                    getSelectionChain(editor).setFontFamily(value).run();
                }}>
                    <SelectTrigger className="w-[150px] h-8 text-xs">
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
            <div className="flex items-center gap-1 border rounded-md p-1">
                <button
                    onClick={() => {
                        const currentSize = parseInt(editorFontSize || '16');
                        const newSize = Math.max(8, currentSize - 1);
                        editor.chain().focus().setFontSize(`${newSize}pt`).run();
                    }}
                    className="h-4 w-6 text-xs font-medium flex items-center justify-center"
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
                    className="w-6 text-xs font-medium text-center rounded h-4"
                />
                <button
                    onClick={() => {
                        const currentSize = parseInt(editorFontSize || '16');
                        const newSize = Math.min(72, currentSize + 1);
                        getSelectionChain(editor).setFontSize(`${newSize}pt`).run();
                    }}
                    className="h-4 w-6 text-xs flex items-center justify-center"
                >
                    +
                </button>
            </div>
            <div className="flex items-center border p-0.5 rounded-md">
                <Toggle
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => {
                        getSelectionChain(editor).toggleBold().run();
                    }}
                    aria-label="Toggle bold"
                    className="h-6 w-6 text-pink-500 bg-blue-500"
                >
                    <Bold className="h-3 w-3" />
                </Toggle>
                <Toggle
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => {
                        getSelectionChain(editor).toggleItalic().run();
                    }}
                    aria-label="Toggle italic"
                    className="h-6 w-6"
                >
                    <Italic className="h-3 w-3" />
                </Toggle>
                <Toggle
                    pressed={editor.isActive('underline')}
                    onPressedChange={() => {
                        getSelectionChain(editor).toggleUnderline().run();
                    }}
                    aria-label="Toggle underline"
                    className="h-6 w-6"
                >
                    <Underline className="h-3 w-3" />
                </Toggle>
                <Toggle
                    pressed={editor.isActive('strike')}
                    onPressedChange={() => {
                        getSelectionChain(editor).toggleStrike().run();
                    }}
                    aria-label="Toggle strikethrough"
                    className="h-6 w-6"
                >
                    <Strikethrough className="h-3 w-3" />
                </Toggle>
                <Toggle
                    pressed={editor.isActive('textStyle', { color: '#ff69b4' })}
                    onPressedChange={() => {
                        getSelectionChain(editor).setColor('#ff69b4').run();
                    }}
                    aria-label="Toggle pink text"
                    className="h-6 w-6"
                >
                    <Type className="h-3 w-3 text-pink-400" />
                </Toggle>
            </div>
            <div className="flex items-center border p-0.5 rounded-md">
                <Toggle
                    pressed={editor.isActive({ textAlign: 'left' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                    aria-label="Align left"
                    className="h-6 w-6"
                >
                    <AlignLeft className="h-3 w-3" />
                </Toggle>
                <Toggle
                    pressed={editor.isActive({ textAlign: 'center' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                    aria-label="Align center"
                    className="h-6 w-6"
                >
                    <AlignCenter className="h-3 w-3" />
                </Toggle>
                <Toggle
                    pressed={editor.isActive({ textAlign: 'right' })}
                    onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                    aria-label="Align right"
                    className="h-6 w-6"
                >
                    <AlignRight className="h-3 w-3" />
                </Toggle>
            </div>
            <div className="flex items-center gap-1 ml-auto">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                        // Implement image upload logic here
                    }}
                    aria-label="Add image"
                    className="h-6 w-6"
                >
                    <Image className="h-3 w-3" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                        // Implement attachment logic here
                    }}
                    aria-label="Add attachment"
                    className="h-6 w-6"
                >
                    <Paperclip className="h-3 w-3" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 w-16 h-6 text-xs flex items-center justify-center gap-1"
                    onClick={() => {
                        // Implement share logic here
                    }}
                    aria-label="Share"
                >
                    <Share className="h-3 w-3" />
                    Share
                </Button>
            </div>
        </div>
    )
}