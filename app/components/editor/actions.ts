import { toast } from "sonner";
import { uploadImageToSupabase } from "@/app/utils/supabase";
import { Editor } from "@tiptap/react";

export async function uploadAndInsertImage(editor: Editor, file: File, pos = null) {
    toast.info("Uploading image to cloud....")
    try {
        const supabasePath = await uploadImageToSupabase(file)
        console.log("Supabase path", supabasePath)

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

export function setFont(editor: Editor, font: string) {
    editor.chain().focus().setFontFamily(font).run()
}

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
