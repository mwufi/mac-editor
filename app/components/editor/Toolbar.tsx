import { useAtomValue } from "jotai";
import { editorAtom } from "@/app/atoms";
import { useEffect, useState } from "react";
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

const ButtonGroup = ({ children }: { children: React.ReactNode }) => (
    <div className="flex shadow border border-input rounded-md h-8 items-center overflow-hidden">
        {children}
    </div>
);

export default function Toolbar() {
    const editor = useAtomValue(editorAtom);
    const [fontSize, setFontSize] = useState('16');
    const [fontFamily, setFontFamily] = useState('');
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrike, setIsStrike] = useState(false);
    const [textAlign, setTextAlign] = useState('left');

    useEffect(() => {
        if (!editor) return;

        const updateToolbar = () => {
            const attrs = editor.getAttributes('textStyle');
            setFontSize(attrs.fontSize ? attrs.fontSize.replace('pt', '') : '16');
            setFontFamily(attrs.fontFamily || '');
            setIsBold(editor.isActive('bold'));
            setIsItalic(editor.isActive('italic'));
            setIsUnderline(editor.isActive('underline'));
            setIsStrike(editor.isActive('strike'));
            setTextAlign(editor.isActive({ textAlign: 'center' }) ? 'center' :
                editor.isActive({ textAlign: 'right' }) ? 'right' : 'left');
        };

        editor.on('selectionUpdate', updateToolbar);
        editor.on('update', updateToolbar);

        return () => {
            editor.off('selectionUpdate', updateToolbar);
            editor.off('update', updateToolbar);
        };
    }, [editor]);

    if (!editor) return null;

    return (
        <div className="w-full flex flex-row gap-2 h-12 items-center">
            <ButtonGroup>
                <Select value={fontFamily} onValueChange={(value) => {
                    setFontFamily(value);
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
            </ButtonGroup>
            <ButtonGroup>
                <button
                    onClick={() => {
                        const newSize = Math.max(8, parseInt(fontSize) - 1);
                        setFontSize(newSize.toString());
                        editor.chain().focus().setFontSize(`${newSize}pt`).run();
                    }}
                    className="h-4 w-6 text-xs font-medium flex items-center justify-center"
                >
                    -
                </button>
                <input
                    type="text"
                    value={fontSize}
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
                        const newSize = Math.min(72, parseInt(fontSize) + 1);
                        setFontSize(newSize.toString());
                        getSelectionChain(editor).setFontSize(`${newSize}pt`).run();
                    }}
                    className="h-4 w-6 text-xs flex items-center justify-center"
                >
                    +
                </button>
            </ButtonGroup>
            <ButtonGroup>
                <Toggle
                    value="bold"
                    aria-label="Toggle bold"
                    pressed={isBold}
                    onPressedChange={() => getSelectionChain(editor).toggleBold().run()}
                >
                    <Bold size={16} />
                </Toggle>
                <Toggle
                    value="italic"
                    aria-label="Toggle italic"
                    pressed={isItalic}
                    onPressedChange={() => getSelectionChain(editor).toggleItalic().run()}
                >
                    <Italic size={16} />
                </Toggle>
                <Toggle
                    value="underline"
                    aria-label="Toggle underline"
                    pressed={isUnderline}
                    onPressedChange={() => getSelectionChain(editor).toggleUnderline().run()}
                >
                    <Underline size={16} />
                </Toggle>
                <Toggle
                    value="strike"
                    aria-label="Toggle strikethrough"
                    pressed={isStrike}
                    onPressedChange={() => getSelectionChain(editor).toggleStrike().run()}
                >
                    <Strikethrough size={16} />
                </Toggle>
            </ButtonGroup>
            <ButtonGroup>
                <Toggle
                    value="alignLeft"
                    aria-label="Align left"
                    pressed={textAlign === 'left'}
                    onPressedChange={() => getSelectionChain(editor).setTextAlign('left').run()}
                >
                    <AlignLeft size={16} />
                </Toggle>
                <Toggle
                    value="alignCenter"
                    aria-label="Align center"
                    pressed={textAlign === 'center'}
                    onPressedChange={() => getSelectionChain(editor).setTextAlign('center').run()}
                >
                    <AlignCenter size={16} />
                </Toggle>
                <Toggle
                    value="alignRight"
                    aria-label="Align right"
                    pressed={textAlign === 'right'}
                    onPressedChange={() => getSelectionChain(editor).setTextAlign('right').run()}
                >
                    <AlignRight size={16} />
                </Toggle>
            </ButtonGroup>
            <Button
                variant="outline"
                size="icon"
                onClick={() => {
                    // Implement image upload logic here
                }}
                aria-label="Add image"
            >
                <Image size={16} />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => {
                    // Implement attachment logic here
                }}
                aria-label="Add attachment"
            >
                <Paperclip size={16} />
            </Button>
            <Button
                variant="outline"
                size="sm"
                className="shrink-0 w-16 text-xs flex items-center justify-center gap-1"
                onClick={() => {
                    // Implement share logic here
                }}
                aria-label="Share"
            >
                <Share size={16} />
                Share
            </Button>
        </div>
    )
}