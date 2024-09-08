'use client'

import { useEffect } from 'react';

import { Editor, EditorContent, useEditor as useTiptapEditor } from '@tiptap/react';
import CharacterCount from '@tiptap/extension-character-count';
import StarterKit from '@tiptap/starter-kit'
import Youtube from '@tiptap/extension-youtube'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder';
import Focus from '@tiptap/extension-focus';
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Image from '@tiptap/extension-image'
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style'
import FontSize from 'tiptap-extension-font-size'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'

import { useAtom } from 'jotai';
import { editorAtom } from '@/app/atoms';

import { Libre_Baskerville, JetBrains_Mono } from 'next/font/google';
import Toolbar from './Toolbar';

const libreBaskerville = Libre_Baskerville({
    weight: ['400', '700'],
    subsets: ['latin'],
    display: 'swap',
});

interface TipTapEditorProps {
    editable?: boolean;
    initialContent?: string | null;
    onUpdate?: (content: string) => void;
}


const TipTapEditor = ({ editable = true, initialContent = null, onUpdate = (content: string) => { } }: TipTapEditorProps) => {
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
            Image,
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
            })
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: `${libreBaskerville.className} h-full pb-10 min-h-[400px] focus:outline-none`,
            },
        },
        editable: editable,
    })

    useEffect(() => {
        if (editor && initialContent !== null) {
            editor.commands.setContent(initialContent);
        }
    }, [editor, initialContent]);

    useEffect(() => {
        if (editor) {
            setEditor(editor); // Set the editor in the context when it's created

            const handleUpdate = () => {
                const content = editor.getHTML();
                onUpdate(content);
            };

            editor.on('update', handleUpdate);

            return () => {
                editor.off('update', handleUpdate);
            };
        }
    }, [editor, setEditor]);

    return <div>
        {editor &&
            <>
                <Toolbar editor={editor} />
                <EditorContent editor={editor} />
            </>
        }
    </div>;
}

export default TipTapEditor