import { Editor } from "@tiptap/react";

export function insertImageUrl(editor: Editor, url: string) {
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

export const insertCustomButton = (editor: Editor, label: string, onClick: () => void) => {
    editor
        .chain()
        .focus()
        .insertContent([{
            type: 'customButton',
            attrs: {
                label,
                onClick: onClick ? onClick.toString() : null,
            },
        },
        {
            type: 'paragraph'
        }
        ])
        .run();
};

export const insertGallery = (editor: Editor) => {
    editor
        .chain()
        .focus()
        .insertContent([{
            type: 'customImageGallery',
            attrs: {
                layout: 'carousel',
                images: [],
                caption: '',
            },
        },
        {
            type: 'paragraph'
        }
        ])
        .run();
};
