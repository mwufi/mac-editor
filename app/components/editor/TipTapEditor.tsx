'use client'

import { useEffect } from 'react';

import { EditorContent, useEditor as useTiptapEditor } from '@tiptap/react';
import CharacterCount from '@tiptap/extension-character-count';
import StarterKit from '@tiptap/starter-kit'
import Youtube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder';
import Focus from '@tiptap/extension-focus';
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'

// import CustomImageGallery from './CustomImageGallery';
import { WelcomeText } from './WelcomeText';
import FileHandler from '@/components/editor/FileHandler'
import NextImage from '@/components/editor/NextImage';


import { useAtom, useSetAtom } from 'jotai';
import { editorAtom } from '@/app/atoms';


import { uploadAndInsertImage, insertImageUrl } from './actions';

import { Libre_Baskerville, JetBrains_Mono } from 'next/font/google';
import { toast } from 'sonner'

const libreBaskerville = Libre_Baskerville({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const TipTapEditor = ({ editable = true, initialContent = null, font = 'serif' }) => {
    const [_, setEditor] = useAtom(editorAtom);

    const editor = useTiptapEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write your note here...',
            }),
            Focus.configure({
                className: 'focus',
            }),
            CharacterCount,
            NextImage,
            Link,
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Youtube.configure({
                controls: false,
                nocookie: true,
            }),
            FileHandler.configure({
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
                onDrop: (currentEditor, files, pos) => {
                    files.forEach(async file => {
                        uploadAndInsertImage(currentEditor, file, pos)
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
        content: initialContent,
        editorProps: {
            attributes: {
                class: `font-body h-full pb-10 min-h-[400px] focus:outline-none`,
            },
        },
        editable: editable,
    })

    useEffect(() => {
        if (editor && initialContent !== null) {
            editor.commands.setContent(initialContent);
        }
    }, [editor, initialContent]);

    const updateContent = useSetAtom(updateContentAtom);

    useEffect(() => {
        if (editor) {
            setEditor(editor); // Set the editor in the context when it's created

            const handleUpdate = () => {
                const content = editor.getHTML();
                updateContent(content);
            };

            editor.on('update', handleUpdate);

            return () => {
                editor.off('update', handleUpdate);
            };
        }
    }, [editor, setEditor]);

    return <div>{editor && <EditorContent editor={editor} />}</div>;
}

export default TipTapEditor