'use client'

import { useEffect } from 'react';

import { Editor, EditorContent, JSONContent, useEditor as useTiptapEditor } from '@tiptap/react';
import CharacterCount from '@tiptap/extension-character-count';
import StarterKit from '@tiptap/starter-kit'
import Youtube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder';
import Focus from '@tiptap/extension-focus';
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import NextImageNode from '@/components/editor/nodes/NextImageNode'
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style'
import FontSize from 'tiptap-extension-font-size'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Document from '@tiptap/extension-document'
import FileHandler from '@/components/editor/extensions/FileHandler';
import CalculatorExtension from '@/components/editor/extensions/CalculatorExtension';

import { useAtom, useSetAtom } from 'jotai';
import { editorAtom, characterCountAtom } from '@/app/atoms';
import { toast } from 'sonner';
import { uploadImageToLocal } from '@/components/editor/LocalFileLoader';

interface TipTapEditorProps {
    onUpdate: (contentAsJson: JSONContent, contentAsText: string) => void;
    initialContent: string | null;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ onUpdate, initialContent }) => {
    const [_, setEditor] = useAtom(editorAtom);

    const editor = useTiptapEditor({
        extensions: [
            Document,
            StarterKit.configure({
                document: false,
            }),
            Placeholder.configure({
                placeholder: 'Write your note here...',
            }),
            Focus.configure({
                className: 'focus',
            }),
            CharacterCount,
            NextImageNode,
            CalculatorExtension,
            Link,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            FontSize,
            TextStyle,
            FontFamily.configure({
                types: ['textStyle'],
            }),
            Youtube.configure({
                controls: false,
                nocookie: true,
            }),
            FileHandler.configure({
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
                onDrop: (currentEditor, files, pos) => {
                    files.forEach(async file => {
                        uploadAndInsertImage(currentEditor, file)
                    })
                },
                onPaste: (currentEditor, files, htmlContent) => {
                    if (htmlContent) {
                        // Handle pasted HTML content
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(htmlContent, 'text/html');
                        const imgElement = doc.querySelector('img');
                        console.log("pasted html content", htmlContent, imgElement)

                        if (imgElement && imgElement.src) {
                            insertImageUrl(currentEditor, imgElement.src)
                            return true;
                        }

                        // If no image in HTML content, allow default paste behavior
                        return false;
                    }

                    files.forEach(async file => {
                        uploadAndInsertImage(currentEditor, file)
                    })
                },
            }),
        ],
        content: null,
        editorProps: {
            attributes: {
                class: `h-full focus:outline-none`,
            },
        },
        editable: true,
    })

    useEffect(() => {
        if (editor && initialContent !== null) {
            try {
                editor.commands.setContent(JSON.parse(initialContent));
            } catch (error) {
                console.error("Error setting initial content in editor", error);
                editor.commands.setContent(initialContent);
            }
        }
    }, [editor, initialContent]);

    const setCharacterCount = useSetAtom(characterCountAtom);
    useEffect(() => {
        if (editor) {
            setEditor(editor); // Set the editor in the context when it's created

            const handleUpdate = () => {
                const contentAsJSON = editor.getJSON();
                const contentAsText = editor.getText();
                onUpdate(contentAsJSON, contentAsText);
                setCharacterCount({
                    characters: editor.storage.characterCount.characters(),
                    words: editor.storage.characterCount.words(),
                });
            };

            editor.on('update', handleUpdate);

            return () => {
                editor.off('update', handleUpdate);
            };
        }
    }, [editor, setEditor]);

    return <div>
        {editor &&
            <EditorContent editor={editor} />
        }
    </div>;
}

async function uploadAndInsertImage(editor: Editor, file: File) {
    toast.info("Uploading image to cloud....")
    try {
        const supabasePath = await uploadImageToLocal(file)

        editor.chain().insertContent([
            {
                type: 'nextImage',
                attrs: {
                    src: supabasePath,
                },
            },
            {
                type: 'paragraph'
            },
        ]).focus().run()
    } catch (error) {
        toast.error('Error uploading image:', error.message);
    }
}

function insertImageUrl(editor: Editor, url: string) {
    editor.chain().insertContent([
        {
            type: 'nextImage',
            attrs: {
                src: url,
            },
        },
        {
            type: 'paragraph'
        }
    ]).focus().run()
}

export default TipTapEditor